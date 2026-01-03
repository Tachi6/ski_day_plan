import { type LatLngTuple } from 'leaflet';
import { distanceByTurns, trackDistance } from '../../helpers/distances';
import type { Track } from './CurrentTrackProvider';
import type { Run } from '../../hooks/UseObtainData';

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
  hasConnection: boolean;
  lastTrackConnection: Intersection | null;
  lastTrackConnectionIndex: number;
  lastTrackDirection: Direction | null;
  newTrackConnection: Intersection | null;
  newTrackConnectionIndex: number;
  newTrackDirection: Direction | null;
  connectionType: ConnectionType | null;
  directions: Directions | null;
  connectorTrack: LatLngTuple[] | null;
  connectorTrackIndex: number;
  connectorTrackConnection: Connection;
}

interface GetConnectionInfoProps {
  lastTrack: LatLngTuple[];
  newTrack: LatLngTuple[];
  connections: Run[];
}

export const getConnectionInfo = ({ lastTrack, newTrack, connections }: GetConnectionInfoProps): ConnectionInfo => {
  const connectionInfo: ConnectionInfo = {
    hasConnection: false,
    lastTrackConnection: null,
    lastTrackConnectionIndex: -1,
    lastTrackDirection: null,
    newTrackConnection: null,
    newTrackConnectionIndex: -1,
    newTrackDirection: null,
    connectionType: null,
    directions: null,
    connectorTrack: null,
    connectorTrackIndex: -1,
    connectorTrackConnection: '',
  };

  lastTrack.find((point1, index1) =>
    newTrack.some((point2, index2) => {
      connectionInfo.lastTrackDirection = lastTrack[0][2]! - lastTrack[lastTrack.length - 1][2]! >= 0 ? 'Down' : 'Up';
      connectionInfo.newTrackDirection = newTrack[0][2]! - newTrack[newTrack.length - 1][2]! >= 0 ? 'Down' : 'Up';

      if (index1 === 0) return false;

      const hasMatch = point1[0] === point2[0] && point1[1] === point2[1] && point1[2] === point2[2];

      if (hasMatch) {
        connectionInfo.hasConnection = true;
        connectionInfo.lastTrackConnectionIndex = index1;
        connectionInfo.newTrackConnectionIndex = index2;

        switch (index1) {
          case lastTrack.length - 1:
            connectionInfo.lastTrackConnection = 'End';
            break;
          default:
            connectionInfo.lastTrackConnection = 'Middle';
            break;
        }

        switch (index2) {
          case 0:
            connectionInfo.newTrackConnection = 'Start';
            break;
          case newTrack.length - 1:
            connectionInfo.newTrackConnection = 'End';
            break;
          default:
            connectionInfo.newTrackConnection = 'Middle';
            break;
        }
      }

      return hasMatch;
    })
  );

  if (!connectionInfo.hasConnection && lastTrack.length > 0) {
    lastTrack.find((point, index) =>
      connections.some((connection) => {
        if (index === 0) return false;

        const hasMatch =
          connection.geometry.coordinates[0][0] === point[0] &&
          connection.geometry.coordinates[0][1] === point[1] &&
          connection.geometry.coordinates[0][2] === point[2];

        if (hasMatch) {
          connectionInfo.connectorTrack = connection.geometry.coordinates;
          connectionInfo.lastTrackConnectionIndex = index;

          switch (index) {
            case lastTrack.length - 1:
              connectionInfo.lastTrackConnection = 'End';
              break;
            default:
              connectionInfo.lastTrackConnection = 'Middle';
              break;
          }
        }

        return hasMatch;
      })
    );

    if (connectionInfo.connectorTrack) {
      newTrack.find((point1, index1) =>
        connectionInfo.connectorTrack!.some((point2, index2) => {
          if (index1 === newTrack.length - 1) return false;

          const hasMatch = point1[0] === point2[0] && point1[1] === point2[1] && point1[2] === point2[2];

          if (hasMatch) {
            connectionInfo.hasConnection = true;
            connectionInfo.connectorTrackIndex = index2;
            connectionInfo.newTrackConnectionIndex = index1;
            connectionInfo.connectorTrackConnection = 'Conex';

            switch (index1) {
              case 0:
                connectionInfo.newTrackConnection = 'Start';
                break;
              default:
                connectionInfo.newTrackConnection = 'Middle';
                break;
            }
          }

          return hasMatch;
        })
      );
    }
  }

  connectionInfo.connectionType =
    connectionInfo.hasConnection || connectionInfo.connectorTrackConnection === 'Conex'
      ? `${connectionInfo.lastTrackConnection!}${connectionInfo.connectorTrackConnection!}${connectionInfo.newTrackConnection!}`
      : null;

  connectionInfo.directions = connectionInfo.lastTrackDirection
    ? `${connectionInfo.lastTrackDirection!}${connectionInfo.newTrackDirection!}`
    : null;

  return connectionInfo;
};

interface AddNewTrackProps {
  currentTrack: Track;
  newTrack: LatLngTuple[];
  time?: number;
}

export const addNewTrack = ({ currentTrack, newTrack }: AddNewTrackProps): Track => {
  const isDownHill = newTrack[0][2]! - newTrack[newTrack.length - 1][2]! >= 0;

  const newTrackStep = currentTrack.coordinates.length + newTrack.length;
  const newTrackDistance = trackDistance(newTrack);
  const newTrackElevation = Math.abs(newTrack[0][2]! - newTrack[newTrack.length - 1][2]!);

  console.log(
    distanceByTurns({
      distance: currentTrack.downhillDistance + (isDownHill ? newTrackDistance : 0),
      turns: 'large',
    })
  );

  return {
    coordinates: [...currentTrack.coordinates, ...newTrack],
    trackSteps: [...currentTrack.trackSteps, newTrackStep],
    downhillDistance: currentTrack.downhillDistance + (isDownHill ? newTrackDistance : 0),
    uphillDistance: currentTrack.uphillDistance + (!isDownHill ? newTrackDistance : 0),
    totalDistance: currentTrack.totalDistance + newTrackDistance,
    totalTime: currentTrack.totalTime,
    descentElevation: currentTrack.descentElevation + (isDownHill ? newTrackElevation : 0),
    climbElevation: currentTrack.climbElevation + (!isDownHill ? newTrackElevation : 0),
    downhills: 0,
    uphills: 0,
  };
};

interface ClipCurrentTrackProps {
  currentTrack: Track;
  cutIndex?: number;
}

export const clipCurrentTrack = ({ currentTrack, cutIndex }: ClipCurrentTrackProps): Track => {
  const usedCutIndex = cutIndex ?? currentTrack.trackSteps.at(-2)!;
  const trackToRemove = currentTrack.coordinates.slice(usedCutIndex - 1);

  const isDownhill = trackToRemove[0][2]! - trackToRemove[trackToRemove.length - 1][2]! >= 0;

  const newTrackStep = cutIndex ? [cutIndex] : [];

  const removeDistance = trackDistance(trackToRemove);
  const removeElevation = Math.abs(trackToRemove[trackToRemove.length - 1][2]! - trackToRemove[0][2]!);

  return {
    coordinates: [...currentTrack.coordinates.slice(0, usedCutIndex)],
    trackSteps: [...currentTrack.trackSteps.slice(0, currentTrack.trackSteps.length - 1), ...newTrackStep],
    downhillDistance: currentTrack.downhillDistance - (isDownhill ? removeDistance : 0),
    uphillDistance: currentTrack.uphillDistance - (!isDownhill ? removeDistance : 0),
    totalDistance: currentTrack.totalDistance - removeDistance,
    totalTime: 0,
    descentElevation: currentTrack.descentElevation - (isDownhill ? removeElevation : 0),
    climbElevation: currentTrack.climbElevation - (!isDownhill ? removeElevation : 0),
    downhills: 0,
    uphills: 0,
  };
};
