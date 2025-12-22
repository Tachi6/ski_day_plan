import { type LatLngTuple } from 'leaflet';
import { trackDistance } from '../../helpers/distances';
import type { Track } from './CurrentTrackProvider';
import type { Run } from '../../hooks/UseObtainData';

type ConnectionType =
  | 'end+start'
  | 'end+middle'
  | 'end+end'
  | 'end+conex'
  | 'middle+start'
  | 'middle+middle'
  | 'middle+end'
  | 'middle+conex'
  | 'start+start'
  | 'start+end'
  | 'start+middle'
  | 'start+conex'
  | 'conex+start'
  | 'conex+end'
  | 'conex+middle'
  | 'conex+conex';

type Directions = 'up+up' | 'up+down' | 'down+down' | 'down+up';

type Intersection = 'start' | 'middle' | 'end' | 'conex';

type Direction = 'down' | 'up';

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
  connectionTrack: LatLngTuple[] | null;
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
    connectionTrack: null,
  };

  lastTrack.find((point1, index1) =>
    newTrack.some((point2, index2) => {
      connectionInfo.lastTrackDirection = lastTrack[0][2]! - lastTrack[lastTrack.length - 1][2]! >= 0 ? 'down' : 'up';
      connectionInfo.newTrackDirection = newTrack[0][2]! - newTrack[newTrack.length - 1][2]! >= 0 ? 'down' : 'up';

      if (index1 === 0) return false;

      const hasMatch = point1[0] === point2[0] && point1[1] === point2[1] && point1[2] === point2[2];

      if (hasMatch) {
        connectionInfo.hasConnection = true;
        connectionInfo.lastTrackConnectionIndex = index1;
        connectionInfo.newTrackConnectionIndex = index2;

        switch (index1) {
          case lastTrack.length - 1:
            connectionInfo.lastTrackConnection = 'end';
            break;
          default:
            connectionInfo.lastTrackConnection = 'middle';
            break;
        }

        switch (index2) {
          case 0:
            connectionInfo.newTrackConnection = 'start';
            break;
          case newTrack.length - 1:
            connectionInfo.newTrackConnection = 'end';
            break;
          default:
            connectionInfo.newTrackConnection = 'middle';
            break;
        }
      }

      return hasMatch;
    })
  );

  if (!connectionInfo.hasConnection && lastTrack.length > 0) {
    const connection = connections.find(
      (connection) =>
        connection.geometry.coordinates[0][0] === lastTrack[lastTrack.length - 1][0] &&
        connection.geometry.coordinates[0][1] === lastTrack[lastTrack.length - 1][1] &&
        connection.geometry.coordinates[0][2] === lastTrack[lastTrack.length - 1][2]
    );

    if (connection) {
      const connectionTrack = connection.geometry.coordinates;

      newTrack.find((point1, index1) =>
        connectionTrack.some((point2, index2) => {
          if (index1 === newTrack.length - 1) return false;

          const hasMatch = point1[0] === point2[0] && point1[1] === point2[1] && point1[2] === point2[2];

          if (hasMatch) {
            connectionInfo.hasConnection = true;
            connectionInfo.connectionTrack = connectionTrack;
            connectionInfo.lastTrackConnectionIndex = index2;
            connectionInfo.newTrackConnectionIndex = index1;

            connectionInfo.lastTrackConnection = 'conex';

            switch (index1) {
              case 0:
                connectionInfo.newTrackConnection = 'start';
                break;
              default:
                connectionInfo.newTrackConnection = 'middle';
                break;
            }
          }

          return hasMatch;
        })
      );
    }
  }

  connectionInfo.connectionType = connectionInfo.hasConnection
    ? `${connectionInfo.lastTrackConnection!}+${connectionInfo.newTrackConnection!}`
    : null;

  connectionInfo.directions = connectionInfo.lastTrackDirection
    ? `${connectionInfo.lastTrackDirection!}+${connectionInfo.newTrackDirection!}`
    : null;

  return connectionInfo;
};

interface AddNewTrackProps {
  currentTrack: Track;
  newTrack: LatLngTuple[];
}

export const addNewTrack = ({ currentTrack, newTrack }: AddNewTrackProps): Track => {
  const isDownHill = newTrack[0][2]! - newTrack[newTrack.length - 1][2]! >= 0;

  const newTrackStep = currentTrack.coordinates.length + newTrack.length;
  const newTrackDistance = trackDistance(newTrack);
  const newTrackElevation = Math.abs(newTrack[0][2]! - newTrack[newTrack.length - 1][2]!);

  return {
    coordinates: [...currentTrack.coordinates, ...newTrack],
    trackSteps: [...currentTrack.trackSteps, newTrackStep],
    downhillDistance: currentTrack.downhillDistance + (isDownHill ? newTrackDistance : 0),
    uphillDistance: currentTrack.uphillDistance + (!isDownHill ? newTrackDistance : 0),
    totalDistance: currentTrack.totalDistance + newTrackDistance,
    totalTime: 0,
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
  const trackToRemove = currentTrack.coordinates.slice(cutIndex - 1);
  const isDownhill = trackToRemove[0][2]! - trackToRemove[trackToRemove.length - 1][2]! >= 0;

  const removeDistance = trackDistance(trackToRemove);
  const removeElevation = Math.abs(trackToRemove[trackToRemove.length - 1][2]! - trackToRemove[0][2]!);

  return {
    coordinates: [...currentTrack.coordinates.slice(0, cutIndex)],
    trackSteps: [...currentTrack.trackSteps.slice(0, currentTrack.trackSteps.length - 1), cutIndex],
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
