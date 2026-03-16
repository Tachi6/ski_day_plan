import { type LatLngTuple } from 'leaflet';
import {
  obtainRunDistance,
  obtainSkiDistance,
  obtainStraightDistance,
} from '../../helpers/distances';
import type { Track } from './CurrentTrackProvider';
import { obtainSeconds } from '../../helpers/times';
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
  lastTrackCoords: LatLngTuple[];
  newTrackCoords: LatLngTuple[];
  allRuns: Run[];
}

export const getConnectionInfo = ({
  lastTrackCoords,
  newTrackCoords,
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

  if (lastTrackCoords.length === 0) {
    return connectionInfo;
  }

  if (
    lastTrackCoords.at(-1)![0] === newTrackCoords[0][0] &&
    lastTrackCoords.at(-1)![1] === newTrackCoords[0][1]
  ) {
    connectionInfo.connectionType = 'EndStart';
    return connectionInfo;
  }

  connectionInfo.lastTrackDirection =
    lastTrackCoords[0][2]! - lastTrackCoords.at(-1)![2]! >= 0 ? 'Down' : 'Up';
  connectionInfo.newTrackDirection =
    newTrackCoords[0][2]! - newTrackCoords.at(-1)![2]! >= 0 ? 'Down' : 'Up';

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

interface AddNewTrackProps {
  currentTrack: Track;
  newTrack: Run | Lift;
  trackSettings: TrackSettingsState;
}

export const addNewTrack = ({ currentTrack, newTrack, trackSettings }: AddNewTrackProps): Track => {
  const newTrackCoords = newTrack.coordinates;
  const isDownhill = newTrack.type === 'run';
  const lastTrack = currentTrack.trackSteps.at(-1);
  const isLastTrackDownhill = lastTrack?.type === 'run';

  const newTrackDistance = obtainSkiDistance({
    distance: newTrack.length,
    turn: trackSettings.turn,
    runType: newTrack.difficulty,
  });
  const newTrackTime = obtainSeconds({
    distance: newTrackDistance,
    track: newTrack,
    speed: trackSettings.speed,
    stops: trackSettings.stops,
  });
  const newTrackElevation = Math.abs(newTrackCoords[0][2]! - newTrackCoords.at(-1)![2]!);
  const isConnection = newTrack.uses?.includes('connection');

  return {
    trackSteps: [...currentTrack.trackSteps, newTrack],
    downhillDistance: currentTrack.downhillDistance + (isDownhill ? newTrackDistance : 0),
    uphillDistance: currentTrack.uphillDistance + (!isDownhill ? newTrackDistance : 0),
    totalDistance: currentTrack.totalDistance + newTrackDistance,
    totalTime: currentTrack.totalTime + newTrackTime,
    descentElevation: currentTrack.descentElevation + (isDownhill ? newTrackElevation : 0),
    climbElevation: currentTrack.climbElevation + (!isDownhill ? newTrackElevation : 0),
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
  const lastTrackInitHeight = lastTrack.coordinates[0][2]!;
  const lastTrackEndHeight = lastTrack.coordinates.at(-1)![2]!;

  const isDownhill = lastTrack.type === 'run';

  const removeDistance =
    lastTrack.type === 'run'
      ? obtainRunDistance(coordsToRemove)
      : obtainStraightDistance(coordsToRemove);

  const distance = obtainSkiDistance({
    distance: removeDistance,
    turn: trackSettings.turn,
    runType: lastTrack.difficulty,
  });

  const removeElevation = Math.abs(lastTrackEndHeight - lastTrackInitHeight);
  const removeTime = obtainSeconds({
    distance: distance,
    speed: trackSettings.speed,
    stops: trackSettings.stops,
    track: lastTrack,
  });

  const newTrackStep: Run | Lift = {
    ...lastTrack,
    coordinates: [...lastTrack.coordinates.slice(0, cutIndex)],
    length: lastTrack.length - removeDistance,
  };

  return {
    trackSteps: [
      ...currentTrack.trackSteps.slice(0, currentTrack.trackSteps.length - 2),
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
  };
};

export const removeLastTrack = (currentTrack: Track, trackSettings: TrackSettingsState): Track => {
  const lastTrack = currentTrack.trackSteps.at(-1)!;

  const lastTrackInitHeight = lastTrack.coordinates[0][2]!;
  const lastTrackEndHeight = lastTrack.coordinates.at(-1)![2]!;

  const isLastTrackDownhill = lastTrack.type === 'run';
  const isPreviousTrackDownhill = currentTrack.trackSteps.at(-2)?.type === 'run';

  const distance = obtainSkiDistance({
    distance: lastTrack.length,
    turn: trackSettings.turn,
    runType: lastTrack.difficulty,
  });

  const removeElevation = Math.abs(lastTrackEndHeight - lastTrackInitHeight);
  const removeTime = obtainSeconds({
    distance: distance,
    speed: trackSettings.speed,
    stops: trackSettings.stops,
    track: lastTrack,
  });

  const isConnection = lastTrack.uses?.includes('connection');

  return {
    trackSteps: [...currentTrack.trackSteps.slice(0, currentTrack.trackSteps.length - 1)],
    downhillDistance: currentTrack.downhillDistance - (isLastTrackDownhill ? lastTrack.length : 0),
    uphillDistance: currentTrack.uphillDistance - (!isLastTrackDownhill ? lastTrack.length : 0),
    totalDistance: currentTrack.totalDistance - lastTrack.length,
    totalTime: currentTrack.totalTime - removeTime,
    descentElevation: currentTrack.descentElevation - (isLastTrackDownhill ? removeElevation : 0),
    climbElevation: currentTrack.climbElevation - (!isLastTrackDownhill ? removeElevation : 0),
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
  coordinates: coordinates,
  type: 'run',
  uses: 'connection',
  grooming: 'classic',
  difficulty: 'novice',
});
