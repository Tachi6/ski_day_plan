import { type LatLngTuple } from 'leaflet';
import { trackDistance } from '../../helpers/distances';
import type { Track } from './CurrentTrackProvider';
import type { Lift, Run } from '../../hooks/UseObtainData';

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
  lastTrackCoords: LatLngTuple[];
  newTrackCoords: LatLngTuple[];
  connections: Run[];
}

export const getConnectionInfo = ({
  lastTrackCoords,
  newTrackCoords,
  connections,
}: GetConnectionInfoProps): ConnectionInfo => {
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

  lastTrackCoords.find((point1, index1) =>
    newTrackCoords.some((point2, index2) => {
      connectionInfo.lastTrackDirection = lastTrackCoords[0][2]! - lastTrackCoords.at(-1)![2]! >= 0 ? 'Down' : 'Up';
      connectionInfo.newTrackDirection = newTrackCoords[0][2]! - newTrackCoords.at(-1)![2]! >= 0 ? 'Down' : 'Up';

      if (index1 === 0) return false;

      const hasMatch = point1[0] === point2[0] && point1[1] === point2[1] && point1[2] === point2[2];

      if (hasMatch) {
        connectionInfo.hasConnection = true;
        connectionInfo.lastTrackConnectionIndex = index1;
        connectionInfo.newTrackConnectionIndex = index2;

        switch (index1) {
          case lastTrackCoords.length - 1:
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
          case newTrackCoords.length - 1:
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

  if (!connectionInfo.hasConnection && lastTrackCoords.length > 0) {
    lastTrackCoords.find((point, index) =>
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
            case lastTrackCoords.length - 1:
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
      newTrackCoords.find((point1, index1) =>
        connectionInfo.connectorTrack!.some((point2, index2) => {
          if (index1 === newTrackCoords.length - 1) return false;

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
  newTrack: Run | Lift;
  time?: number;
}

export const addNewTrack = ({ currentTrack, newTrack }: AddNewTrackProps): Track => {
  const newTrackCoords = newTrack.geometry.coordinates;
  const isDownHill = newTrackCoords[0][2]! - newTrackCoords[newTrackCoords.length - 1][2]! >= 0;

  const newTrackDistance = trackDistance(newTrackCoords);
  const newTrackElevation = Math.abs(newTrackCoords[0][2]! - newTrackCoords[newTrackCoords.length - 1][2]!);

  return {
    coordinates: [...currentTrack.coordinates, ...newTrackCoords],
    trackSteps: [...currentTrack.trackSteps, newTrack],
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
  cutIndex: number;
}

export const clipCurrentTrack = ({ currentTrack, cutIndex }: ClipCurrentTrackProps): Track => {
  const lastTrack = currentTrack.trackSteps.at(-1)!;

  const trackToRemove = currentTrack.coordinates.slice(cutIndex - 1);

  const isDownhill = trackToRemove[0][2]! - trackToRemove[trackToRemove.length - 1][2]! >= 0;

  const lastTrackIndex = lastTrack.geometry.coordinates.findLastIndex((coordinate) => {
    const currentTrackCoordinate = currentTrack.coordinates[cutIndex];

    return (
      coordinate[0] === currentTrackCoordinate[0] &&
      coordinate[1] === currentTrackCoordinate[1] &&
      coordinate[2] === currentTrackCoordinate[2]
    );
  });

  const newTrackStep: Run | Lift = {
    ...lastTrack,
    geometry: {
      coordinates: [...lastTrack.geometry.coordinates.slice(0, lastTrackIndex)],
      type: lastTrack.geometry.type,
    },
  };

  const removeDistance = trackDistance(trackToRemove);
  const removeElevation = Math.abs(trackToRemove[trackToRemove.length - 1][2]! - trackToRemove[0][2]!);

  return {
    coordinates: [...currentTrack.coordinates.slice(0, cutIndex)],
    trackSteps: [...currentTrack.trackSteps.slice(0, currentTrack.trackSteps.length - 1), newTrackStep],
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

export const removeLastTrack = (currentTrack: Track): Track => {
  const cutIndex = currentTrack.coordinates.findLastIndex((coordinate) => {
    const lastInitCoordinate = currentTrack.trackSteps.at(-1)!.geometry.coordinates[0];

    return (
      coordinate[0] === lastInitCoordinate[0] &&
      coordinate[1] === lastInitCoordinate[1] &&
      coordinate[2] === lastInitCoordinate[2]
    );
  });
  const trackToRemove = currentTrack.trackSteps.at(-1)!.geometry.coordinates;

  const isDownhill = trackToRemove[0][2]! - trackToRemove.at(-1)![2]! >= 0;

  const removeDistance = trackDistance(trackToRemove);
  const removeElevation = Math.abs(trackToRemove[trackToRemove.length - 1][2]! - trackToRemove[0][2]!);

  return {
    coordinates: [...currentTrack.coordinates.slice(0, cutIndex)],
    trackSteps: [...currentTrack.trackSteps.slice(0, currentTrack.trackSteps.length - 1)],
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
