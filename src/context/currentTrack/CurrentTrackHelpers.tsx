import { type LatLngTuple } from 'leaflet';
import {
  obtainElevation,
  obtainRunDistance,
  obtainSkiDistance,
  obtainStraightDistance,
} from '../../helpers/distances';
import type { Track } from './CurrentTrackProvider';
import { obtainLiftDuration, obtainSeconds } from '../../helpers/times';
import type { TrackSettingsState } from '../trackSettings/TrackSettingsContext';
import type { Lift, Run } from '../../interfaces/interfacesRunLift';

type ConnectionType =
  | 'EndStart'
  | 'EndMiddle'
  | 'EndEnd'
  | 'MiddleStart'
  | 'MiddleMiddle'
  | 'MiddleEnd'
  | 'StartStart'
  | 'StartMiddle'
  | 'StartEnd'
  | 'StartConexStart'
  | 'StartConexEnd'
  | 'StartConexMiddle'
  | 'MiddleConexStart'
  | 'MiddleConexMiddle'
  | 'MiddleConexEnd'
  | 'EndConexStart'
  | 'EndConexMiddle'
  | 'EndConexEnd';

type Directions = 'UpUp' | 'UpDown' | 'DownDown' | 'DownUp';

type Intersection = 'Start' | 'Middle' | 'End';

type Direction = 'Down' | 'Up';

type Connection = 'Conex' | '';

interface ConnectionInfo {
  lastTrackConnection: Intersection | null;
  lastTrackConnectionIndex: number;
  lastTrackDirection: Direction | null;
  newTrackConnection: Intersection | null;
  newTrackConnectionIndex: number;
  newTrackDirection: Direction | null;
  connectionType: ConnectionType | null;
  directions: Directions | null;
  connectorTrack: Run | undefined;
  connectorTrackConnection: Connection;
}

interface GetConnectionInfoProps {
  lastTrack: Run | Lift | undefined;
  newTrack: Run | Lift;
  allRuns: Run[];
}

export const getConnectionInfo = ({
  lastTrack,
  newTrack,
  allRuns,
}: GetConnectionInfoProps): ConnectionInfo => {
  const connectionInfo: ConnectionInfo = {
    lastTrackConnection: null,
    lastTrackConnectionIndex: -1,
    lastTrackDirection: null,
    newTrackConnection: null,
    newTrackConnectionIndex: -1,
    newTrackDirection: null,
    connectionType: null,
    directions: null,
    connectorTrack: undefined,
    connectorTrackConnection: '',
  };

  if (!lastTrack) {
    return connectionInfo;
  }

  const lastTrackCoords = lastTrack.coordinates;
  const newTrackCoords = newTrack.coordinates;

  if (
    lastTrackCoords.at(-1)![0] === newTrackCoords[0][0] &&
    lastTrackCoords.at(-1)![1] === newTrackCoords[0][1]
  ) {
    connectionInfo.connectionType = 'EndStart';
    return connectionInfo;
  }

  connectionInfo.lastTrackDirection = lastTrack.type === 'run' ? 'Down' : 'Up';
  connectionInfo.newTrackDirection = newTrack.type === 'run' ? 'Down' : 'Up';

  const hasConnection = lastTrackCoords.some((point1, index1) =>
    newTrackCoords.some((point2, index2) => {
      if (index1 === 0) return false;

      const hasMatch = point1[0] === point2[0] && point1[1] === point2[1];

      if (hasMatch) {
        connectionInfo.lastTrackConnectionIndex = index1;
        connectionInfo.newTrackConnectionIndex = index2;
        connectionInfo.lastTrackConnection =
          index1 === lastTrackCoords.length - 1 ? 'End' : 'Middle';
        connectionInfo.newTrackConnection =
          index2 === 0 ? 'Start' : index2 === newTrackCoords.length - 1 ? 'End' : 'Middle';
      }
      return hasMatch;
    }),
  );

  if (!hasConnection) {
    allRuns.find((run) => {
      const usedConnection = structuredClone(run);
      let lastTrackConnectionIndex = -1;
      let newTrackConnectionIndex = -1;
      let lastTrackConnection = null;
      let newTrackConnection = null;

      const hasMatchLastTrack = lastTrackCoords.some((point1, index1) => {
        if (index1 === 0) return false;

        return usedConnection.coordinates.some((point2, index) => {
          const hasMatch = point2[0] === point1[0] && point2[1] === point1[1];

          if (hasMatch) {
            lastTrackConnectionIndex = index1;
            lastTrackConnection = index1 === lastTrackCoords.length - 1 ? 'End' : 'Middle';
            usedConnection.coordinates = usedConnection.coordinates.slice(index);
          }

          return hasMatch;
        });
      });

      if (!hasMatchLastTrack) return false;

      const hasMatchNewTrack = newTrackCoords.some((point3, index2) => {
        if (index2 === newTrackCoords.length - 1) return false;

        return usedConnection.coordinates.some((point4, index) => {
          const hasMatch = point4[0] === point3[0] && point4[1] === point3[1];

          if (hasMatch) {
            newTrackConnectionIndex = index2;
            newTrackConnection = index2 === 0 ? 'Start' : 'Middle';
            usedConnection.coordinates = usedConnection.coordinates.slice(0, index + 1);
          }
          return hasMatch;
        });
      });

      if (hasMatchNewTrack) {
        connectionInfo.connectorTrack = usedConnection;
        connectionInfo.connectorTrackConnection = 'Conex';
        connectionInfo.lastTrackConnectionIndex = lastTrackConnectionIndex;
        connectionInfo.lastTrackConnection = lastTrackConnection;
        connectionInfo.newTrackConnectionIndex = newTrackConnectionIndex;
        connectionInfo.newTrackConnection = newTrackConnection;
      }

      return hasMatchNewTrack;
    });
  }

  connectionInfo.connectionType =
    hasConnection || connectionInfo.connectorTrackConnection === 'Conex'
      ? `${connectionInfo.lastTrackConnection!}${connectionInfo.connectorTrackConnection!}${connectionInfo.newTrackConnection!}`
      : null;

  connectionInfo.directions = connectionInfo.lastTrackDirection
    ? `${connectionInfo.lastTrackDirection!}${connectionInfo.newTrackDirection!}`
    : null;

  return connectionInfo;
};

export const obtainTrackTime = (track: Run | Lift, trackSettings: TrackSettingsState) => {
  const trackSkiDistance = obtainSkiDistance({
    distance: track.length,
    turn: trackSettings.turn,
    runType: track.difficulty,
  });
  const trackTime = obtainSeconds({
    distance: trackSkiDistance,
    track: track,
    speed: trackSettings.speed,
    stops: trackSettings.stops,
  });

  return trackTime;
};

interface AddNewTrackProps {
  currentTrack: Track;
  newTrack: Run | Lift;
  trackSettings: TrackSettingsState;
}

export const addNewTrack = ({ currentTrack, newTrack, trackSettings }: AddNewTrackProps): Track => {
  const isDownhill = newTrack.type === 'run';
  const lastTrack = currentTrack.trackSteps.at(-1);
  const isLastTrackDownhill = lastTrack?.type === 'run';
  const isConnection = newTrack.uses?.includes('connection');

  const newTrackTime = obtainTrackTime(newTrack, trackSettings);

  return {
    trackSteps: [...currentTrack.trackSteps, newTrack],
    downhillDistance: currentTrack.downhillDistance + (isDownhill ? newTrack.length : 0),
    uphillDistance: currentTrack.uphillDistance + (!isDownhill ? newTrack.length : 0),
    totalDistance: currentTrack.totalDistance + newTrack.length,
    totalTime: currentTrack.totalTime + newTrackTime,
    descentElevation: currentTrack.descentElevation + (isDownhill ? newTrack.elevation : 0),
    climbElevation: currentTrack.climbElevation + (!isDownhill ? newTrack.elevation : 0),
    downhills: !isConnection
      ? currentTrack.downhills
      : !isLastTrackDownhill && isDownhill
        ? currentTrack.downhills + 1
        : currentTrack.downhills,
  };
};

interface ClipCurrentTrack {
  currentTrack: Track;
  cutIndex: number;
  trackSettings: TrackSettingsState;
}

export const clipCurrentTrack = ({
  currentTrack,
  cutIndex,
  trackSettings,
}: ClipCurrentTrack): Track => {
  const lastTrack = currentTrack.trackSteps.at(-1)!;
  const coordsToRemove = lastTrack.coordinates.slice(cutIndex);
  const isDownhill = lastTrack.type === 'run';

  const removeDistance =
    lastTrack.type === 'run'
      ? obtainRunDistance(coordsToRemove)
      : obtainStraightDistance(coordsToRemove);
  const removeElevation = obtainElevation(coordsToRemove);
  const removeDuration =
    lastTrack.type === 'lift' ? obtainLiftDuration(coordsToRemove, lastTrack.lift_type) : undefined;
  const removeTime = obtainTrackTime(
    {
      ...lastTrack,
      coordinates: coordsToRemove,
      length: removeDistance,
      elevation: removeElevation,
      ...(lastTrack.type === 'lift' && { duration: removeDuration }),
    },
    trackSettings,
  );
  const newTrackStep: Run | Lift = {
    ...lastTrack,
    coordinates: [...lastTrack.coordinates.slice(0, cutIndex)],
    length: lastTrack.length - removeDistance,
    elevation: lastTrack.elevation - removeElevation,
    ...(lastTrack.type === 'lift' && { duration: lastTrack.duration - removeDuration! }),
  };

  return {
    trackSteps: [
      ...currentTrack.trackSteps.slice(0, currentTrack.trackSteps.length - 1),
      newTrackStep,
    ],
    downhillDistance: currentTrack.downhillDistance - (isDownhill ? removeDistance : 0),
    uphillDistance: currentTrack.uphillDistance - (!isDownhill ? removeDistance : 0),
    totalDistance: currentTrack.totalDistance - removeDistance,
    totalTime: currentTrack.totalTime - removeTime,
    descentElevation: currentTrack.descentElevation - (isDownhill ? removeElevation : 0),
    climbElevation: currentTrack.climbElevation - (!isDownhill ? removeElevation : 0),
    downhills: currentTrack.downhills,
  };
};

export const clipNewTrack = (newTrack: Run | Lift, cutIndex: number): Run | Lift => {
  const coordinates = newTrack.coordinates.slice(cutIndex);

  const length =
    newTrack.type === 'run' ? obtainRunDistance(coordinates) : obtainStraightDistance(coordinates);

  return {
    ...newTrack,
    coordinates: coordinates,
    length,
    elevation: obtainElevation(coordinates),
  };
};

export const removeLastTrack = (currentTrack: Track, trackSettings: TrackSettingsState): Track => {
  const lastTrack = currentTrack.trackSteps.at(-1)!;
  const isConnection = lastTrack.uses?.includes('connection');

  const isLastTrackDownhill = lastTrack.type === 'run';
  const isPreviousTrackDownhill = currentTrack.trackSteps.at(-2)?.type === 'run';

  const removeTime = obtainTrackTime(lastTrack, trackSettings);

  return {
    trackSteps: [...currentTrack.trackSteps.slice(0, currentTrack.trackSteps.length - 1)],
    downhillDistance: currentTrack.downhillDistance - (isLastTrackDownhill ? lastTrack.length : 0),
    uphillDistance: currentTrack.uphillDistance - (!isLastTrackDownhill ? lastTrack.length : 0),
    totalDistance: currentTrack.totalDistance - lastTrack.length,
    totalTime: currentTrack.totalTime - removeTime,
    descentElevation:
      currentTrack.descentElevation - (isLastTrackDownhill ? lastTrack.elevation : 0),
    climbElevation: currentTrack.climbElevation - (!isLastTrackDownhill ? lastTrack.elevation : 0),
    downhills: !isConnection
      ? currentTrack.downhills
      : !isPreviousTrackDownhill && isLastTrackDownhill
        ? currentTrack.downhills - 1
        : currentTrack.downhills,
  };
};

export const createConnectorTrack = (coordinates: LatLngTuple[]): Run => ({
  id: `${Date.now()}`,
  sources: 'connector',
  name: 'Conexión',
  ski_area_names: 'connector',
  length: obtainRunDistance(coordinates),
  elevation: obtainElevation(coordinates),
  coordinates: coordinates,
  type: 'run',
  uses: 'connection',
  grooming: 'classic',
  difficulty: 'novice',
});
