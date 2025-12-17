import { type PropsWithChildren, useState } from 'react';
import { type LatLngTuple } from 'leaflet';
import { distanceHaversine } from '../../helpers/distances';
import { CurrentTrackContext } from './CurrentTrackContext';
import { addNewTrack, clipCurrentTrack, getConnectionInfo } from './CurrentTrackHelpers';

export interface Track {
  coordinates: LatLngTuple[];
  trackSteps: number[];
  downhillDistance: number;
  uphillDistance: number;
  totalDistance: number;
  totalTime: number;
  descentElevation: number;
  climbElevation: number;
  downhills: number;
  uphills: number;
}

const initTrackState: Track = {
  coordinates: [],
  trackSteps: [0],
  downhillDistance: 0,
  uphillDistance: 0,
  totalDistance: 0,
  totalTime: 0,
  climbElevation: 0,
  descentElevation: 0,
  downhills: 0,
  uphills: 0,
};

const UP_UP_DISTANCE: number = 250;
const UP_UP_HEIGHT: number = 6;
const UP_DOWN_DISTANCE: number = 250;
const UP_DOWN_HEIGHT: number = 3;
const DOWN_DOWN_DISTANCE: number = 125;
const DOWN_DOWN_HEIGHT: number = 3;
const DOWN_UP_DISTANCE: number = 250;
const DOWN_UP_HEIGHT: number = 6;

export const CurrentTrackContextProvider = ({ children }: PropsWithChildren) => {
  const [currentTrack, setCurrentTrack] = useState<Track>(initTrackState);

  const addRunToTrack = (newTrack: LatLngTuple[]): void => {
    // Last added track
    const lastTrackStepInit = currentTrack.trackSteps[currentTrack.trackSteps.length - 2];
    const lastTrackStepEnd = currentTrack.trackSteps[currentTrack.trackSteps.length - 1];
    const lastTrack = currentTrack.coordinates.slice(lastTrackStepInit, lastTrackStepEnd);

    const newTrackInit = newTrack[0];
    const lastTrackEnd = lastTrack[lastTrack.length - 1];

    const connectionType = getConnectionInfo({ lastTrack, newTrack });
    console.log(connectionType);

    const connect = connectionType.connectionType ?? connectionType.directions;
    console.log(connect);

    switch (connect) {
      case null:
      case 'end+start':
        setCurrentTrack(addNewTrack({ currentTrack, newTrack }));
        return;

      case 'end+middle':
        setCurrentTrack(
          addNewTrack({ currentTrack, newTrack: newTrack.slice(connectionType.newTrackConnectionIndex) })
        );
        return;

      case 'middle+start': {
        const cutIndex =
          currentTrack.coordinates.length - lastTrack.length + connectionType.lastTrackConnectionIndex + 1;
        const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex });

        setCurrentTrack(addNewTrack({ currentTrack: editedCurrentTrack, newTrack }));
        return;
      }

      case 'middle+middle': {
        if (connectionType.lastTrackDirection === 'down') {
          const cutIndex =
            currentTrack.coordinates.length - lastTrack.length + connectionType.lastTrackConnectionIndex + 1;
          const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex });

          setCurrentTrack(
            addNewTrack({
              currentTrack: editedCurrentTrack,
              newTrack: newTrack.slice(connectionType.newTrackConnectionIndex),
            })
          );
        }

        return;
      }

      case 'up+up': {
        console.log(distanceHaversine(lastTrackEnd, newTrackInit));
        console.log(lastTrackEnd[2]! - newTrackInit[2]!);

        if (
          distanceHaversine(lastTrackEnd, newTrackInit) < UP_UP_DISTANCE &&
          Math.abs(lastTrackEnd[2]! - newTrackInit[2]!) < UP_UP_HEIGHT
        ) {
          setCurrentTrack(addNewTrack({ currentTrack, newTrack: [lastTrackEnd, ...newTrack] }));
          return;
        }

        break;
      }
      case 'up+down': {
        newTrack.find((trackPoint, index) => {
          const hasPoint =
            distanceHaversine(lastTrackEnd, trackPoint) < UP_DOWN_DISTANCE &&
            trackPoint[2]! - lastTrackEnd[2]! >= UP_DOWN_HEIGHT;

          if (hasPoint) {
            setCurrentTrack(addNewTrack({ currentTrack, newTrack: [lastTrackEnd, ...newTrack.slice(index)] }));
            return;
          }

          return hasPoint;
        });

        break;
      }
      case 'down+down': {
        newTrack.find((trackPoint, index) => {
          const hasPoint =
            distanceHaversine(lastTrackEnd, trackPoint) < DOWN_DOWN_DISTANCE &&
            lastTrackEnd[2]! - trackPoint[2]! >= DOWN_DOWN_HEIGHT;

          if (hasPoint) {
            setCurrentTrack(addNewTrack({ currentTrack, newTrack: [lastTrackEnd, ...newTrack.slice(index)] }));
            return;
          }

          return hasPoint;
        });

        break;
      }
      case 'down+up': {
        lastTrack.findLast((trackPoint, index) => {
          const hasPoint =
            distanceHaversine(trackPoint, newTrackInit) < DOWN_UP_DISTANCE &&
            Math.abs(trackPoint[2]! - newTrackInit[2]!) < DOWN_UP_HEIGHT;

          if (hasPoint) {
            const cutIndex = currentTrack.coordinates.length - lastTrack.length + index + 1;
            const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex });
            const editedTrackEnd = editedCurrentTrack.coordinates[editedCurrentTrack.coordinates.length - 1];

            setCurrentTrack(addNewTrack({ currentTrack: editedCurrentTrack, newTrack: [editedTrackEnd, ...newTrack] }));
            return;
          }
        });

        break;
      }

      default:
        return;
    }
  };

  return <CurrentTrackContext value={{ currentTrack, addRunToTrack }}>{children}</CurrentTrackContext>;
};
