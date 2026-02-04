import { type LatLngTuple } from 'leaflet';
import { obtainDistance } from '../../helpers/distances';
import type { Track } from './CurrentTrackProvider';
import type { Lift, Run } from '../../hooks/useObtainData';
import { obtainSeconds } from '../../helpers/times';
import type { TrackSettingsState } from '../trackSettings/TrackSettingsContext';
import type { RunTypes } from '../../map/CustomPolyline';

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

  if (lastTrackCoords.at(-1)![0] === newTrackCoords[0][0] && lastTrackCoords.at(-1)![1] === newTrackCoords[0][1]) {
    connectionInfo.connectionType = 'EndStart';
    return connectionInfo;
  }

  connectionInfo.lastTrackDirection = lastTrackCoords[0][2]! - lastTrackCoords.at(-1)![2]! >= 0 ? 'Down' : 'Up';
  connectionInfo.newTrackDirection = newTrackCoords[0][2]! - newTrackCoords.at(-1)![2]! >= 0 ? 'Down' : 'Up';

  const hasConnection = lastTrackCoords.some((point1, index1) =>
    newTrackCoords.some((point2, index2) => {
      if (index1 === 0) return false;

      const hasMatch = point1[0] === point2[0] && point1[1] === point2[1];

      if (hasMatch) {
        connectionInfo.lastTrackConnectionIndex = index1;
        connectionInfo.newTrackConnectionIndex = index2;
        connectionInfo.lastTrackConnection = index1 === lastTrackCoords.length - 1 ? 'End' : 'Middle';
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

        return usedConnection.geometry.coordinates.some((point2, index) => {
          const hasMatch = point2[0] === point1[0] && point2[1] === point1[1];

          if (hasMatch) {
            lastTrackConnectionIndex = index1;
            lastTrackConnection = index1 === lastTrackCoords.length - 1 ? 'End' : 'Middle';
            usedConnection.geometry.coordinates = usedConnection.geometry.coordinates.slice(index);
          }

          return hasMatch;
        });
      });

      if (!hasMatchLastTrack) return false;

      const hasMatchNewTrack = newTrackCoords.some((point3, index2) => {
        if (index2 === newTrackCoords.length - 1) return false;

        return usedConnection.geometry.coordinates.some((point4, index) => {
          const hasMatch = point4[0] === point3[0] && point4[1] === point3[1];

          if (hasMatch) {
            newTrackConnectionIndex = index2;
            newTrackConnection = index2 === 0 ? 'Start' : 'Middle';
            usedConnection.geometry.coordinates = usedConnection.geometry.coordinates.slice(0, index + 1);
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
  connectorTrack?: Run;
  trackSettings: TrackSettingsState;
}

export const addNewTrack = ({ currentTrack, newTrack, connectorTrack, trackSettings }: AddNewTrackProps): Track => {
  const newTrackCoords = newTrack.geometry.coordinates;
  const connectorTrackCoords = connectorTrack?.geometry.coordinates;
  const isDownhill = newTrack.properties.uses ? true : false;
  const lastTrack = currentTrack.trackSteps.at(-1);
  const islastTrackDownhill = lastTrack && lastTrack.properties.uses ? true : false;

  const newTrackDistance = obtainDistance({
    track: newTrackCoords,
    turn: trackSettings.turn,
    runType: newTrack.properties.difficulty as RunTypes,
  });
  const connectorTrackDistance = connectorTrack
    ? obtainDistance({
        track: connectorTrackCoords!,
        turn: trackSettings.turn,
        runType:
          connectorTrack.properties.uses !== 'connection'
            ? (connectorTrack.properties.difficulty as RunTypes)
            : 'novice',
      })
    : 0;
  const newTrackTime = obtainSeconds({
    distance: newTrackDistance,
    track: newTrack,
    speed: trackSettings.speed,
    stops: trackSettings.stops,
  });
  const connectorTrackTime = connectorTrack
    ? obtainSeconds({
        distance: connectorTrackDistance,
        track: connectorTrack,
        speed: trackSettings.speed,
        stops: trackSettings.stops,
      })
    : 0;
  const newTrackElevation = Math.abs(newTrackCoords[0][2]! - newTrackCoords.at(-1)![2]!);
  const connectorTrackElevation = connectorTrack
    ? Math.abs(connectorTrackCoords![0][2]! - connectorTrackCoords!.at(-1)![2]!)
    : 0;

  const newTrackSteps = connectorTrack ? [connectorTrack, newTrack] : [newTrack];

  return {
    trackSteps: [...currentTrack.trackSteps, ...newTrackSteps],
    downhillDistance: currentTrack.downhillDistance + (isDownhill ? connectorTrackDistance + newTrackDistance : 0),
    uphillDistance: currentTrack.uphillDistance + (!isDownhill ? connectorTrackDistance + newTrackDistance : 0),
    totalDistance: currentTrack.totalDistance + connectorTrackDistance + newTrackDistance,
    totalTime: currentTrack.totalTime + connectorTrackTime + newTrackTime,
    descentElevation: currentTrack.descentElevation + (isDownhill ? connectorTrackElevation + newTrackElevation : 0),
    climbElevation: currentTrack.climbElevation + (!isDownhill ? connectorTrackElevation + newTrackElevation : 0),
    downhills: !islastTrackDownhill && isDownhill ? currentTrack.downhills + 1 : currentTrack.downhills,
  };
};

interface ClipCurrentTrackProps {
  currentTrack: Track;
  cutIndex: number;
  trackSettings: TrackSettingsState;
}

export const clipCurrentTrack = ({ currentTrack, cutIndex, trackSettings }: ClipCurrentTrackProps): Track => {
  const lastTrack = currentTrack.trackSteps.at(-1)!;

  const coordsToRemove = lastTrack.geometry.coordinates.slice(cutIndex);

  const isDownhill = lastTrack.properties.uses ? true : false;

  const removeDistance = obtainDistance({
    track: lastTrack.geometry.coordinates,
    turn: trackSettings.turn,
    runType: lastTrack.properties.difficulty as RunTypes,
  });
  const removeElevation = Math.abs(coordsToRemove.at(-1)![2]! - coordsToRemove[0][2]!);
  const removeTime = obtainSeconds({
    distance: removeDistance,
    speed: trackSettings.speed,
    stops: trackSettings.stops,
    track: lastTrack,
  });

  const newTrackStep: Run | Lift = {
    ...lastTrack,
    geometry: {
      coordinates: [...lastTrack.geometry.coordinates.slice(0, cutIndex)],
      type: lastTrack.geometry.type,
    },
  };

  return {
    trackSteps: [...currentTrack.trackSteps.slice(0, currentTrack.trackSteps.length - 2), newTrackStep],
    downhillDistance: currentTrack.downhillDistance - (isDownhill ? removeDistance : 0),
    uphillDistance: currentTrack.uphillDistance - (!isDownhill ? removeDistance : 0),
    totalDistance: currentTrack.totalDistance - removeDistance,
    totalTime: currentTrack.totalTime - removeTime,
    descentElevation: currentTrack.descentElevation - (isDownhill ? removeElevation : 0),
    climbElevation: currentTrack.climbElevation - (!isDownhill ? removeElevation : 0),
    downhills: currentTrack.downhills,
  };
};

export const removeLastTrack = (currentTrack: Track, trackSettings: TrackSettingsState): Track => {
  const lastTrack = currentTrack.trackSteps.at(-1)!;

  const coordsToRemove = lastTrack.geometry.coordinates;

  const isDownhill = lastTrack.properties.uses ? true : false;
  const previousTrack = currentTrack.trackSteps.at(-2);
  const isPreviousTrackDownhill = previousTrack && previousTrack.properties.uses ? true : false;

  const removeDistance = obtainDistance({
    track: coordsToRemove,
    turn: trackSettings.turn,
    runType: lastTrack.properties.difficulty as RunTypes,
  });
  const removeElevation = Math.abs(coordsToRemove.at(-1)![2]! - coordsToRemove[0][2]!);
  const removeTime = obtainSeconds({
    distance: removeDistance,
    speed: trackSettings.speed,
    stops: trackSettings.stops,
    track: lastTrack,
  });

  return {
    trackSteps: [...currentTrack.trackSteps.slice(0, currentTrack.trackSteps.length - 1)],
    downhillDistance: currentTrack.downhillDistance - (isDownhill ? removeDistance : 0),
    uphillDistance: currentTrack.uphillDistance - (!isDownhill ? removeDistance : 0),
    totalDistance: currentTrack.totalDistance - removeDistance,
    totalTime: currentTrack.totalTime - removeTime,
    descentElevation: currentTrack.descentElevation - (isDownhill ? removeElevation : 0),
    climbElevation: currentTrack.climbElevation - (!isDownhill ? removeElevation : 0),
    downhills: !isPreviousTrackDownhill && isDownhill ? currentTrack.downhills - 1 : currentTrack.downhills,
  };
};
