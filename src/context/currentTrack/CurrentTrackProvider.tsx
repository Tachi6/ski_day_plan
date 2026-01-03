import { type PropsWithChildren, useState } from 'react';
import { type LatLngTuple } from 'leaflet';
import { distanceHaversine } from '../../helpers/distances';
import { CurrentTrackContext } from './CurrentTrackContext';
import { addNewTrack, clipCurrentTrack, getConnectionInfo } from './CurrentTrackHelpers';
import { useObtainData, type Lift, type Run } from '../../hooks/UseObtainData';

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
const UP_UP_HEIGHT: number = 7.5;
const UP_DOWN_DISTANCE: number = 250;
const UP_DOWN_HEIGHT: number = 0;
const DOWN_DOWN_DISTANCE: number = 125;
const DOWN_DOWN_HEIGHT: number = 2.5;
const DOWN_UP_DISTANCE: number = 250;
const DOWN_UP_HEIGHT: number = 5;

export const CurrentTrackContextProvider = ({ children }: PropsWithChildren) => {
  const [currentTrack, setCurrentTrack] = useState<Track>(initTrackState);

  const { connections } = useObtainData();

  const addRunToTrack = (track: Run | Lift): void => {
    console.log(track.properties.difficulty !== undefined);

    const newTrack: LatLngTuple[] = track.geometry.coordinates;
    // Last added track
    const lastTrackStepInit = currentTrack.trackSteps[currentTrack.trackSteps.length - 2];
    const lastTrackStepEnd = currentTrack.trackSteps[currentTrack.trackSteps.length - 1];
    const lastTrack = currentTrack.coordinates.slice(lastTrackStepInit, lastTrackStepEnd);

    const newTrackInit = newTrack[0];
    const lastTrackEnd = lastTrack[lastTrack.length - 1];

    const connectionType = getConnectionInfo({ lastTrack, newTrack, connections });

    const connect = connectionType.connectionType ?? connectionType.directions;

    console.log(connect);

    switch (connect) {
      case null:
      case 'EndStart':
        setCurrentTrack(
          addNewTrack({
            currentTrack,
            newTrack,
          })
        );
        return;

      case 'EndMiddle':
        setCurrentTrack(
          addNewTrack({ currentTrack, newTrack: newTrack.slice(connectionType.newTrackConnectionIndex) })
        );
        return;

      case 'MiddleStart': {
        const cutIndex =
          currentTrack.coordinates.length - lastTrack.length + connectionType.lastTrackConnectionIndex + 1;
        const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex });

        setCurrentTrack(addNewTrack({ currentTrack: editedCurrentTrack, newTrack }));
        return;
      }

      case 'MiddleMiddle': {
        if (connectionType.lastTrackDirection === 'Down') {
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

      case 'EndConexStart':
        setCurrentTrack(
          addNewTrack({
            currentTrack,
            newTrack: [...connectionType.connectorTrack!.slice(0, connectionType.connectorTrackIndex), ...newTrack],
          })
        );
        return;

      case 'EndConexMiddle':
        setCurrentTrack(
          addNewTrack({
            currentTrack,
            newTrack: [
              ...connectionType.connectorTrack!.slice(0, -1),
              ...newTrack.slice(connectionType.newTrackConnectionIndex),
            ],
          })
        );
        return;

      case 'MiddleConexMiddle': {
        if (connectionType.lastTrackDirection === 'Down') {
          const cutIndex =
            currentTrack.coordinates.length - lastTrack.length + connectionType.lastTrackConnectionIndex + 1;
          const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex });

          setCurrentTrack(
            addNewTrack({
              currentTrack: editedCurrentTrack,
              newTrack: [
                ...connectionType.connectorTrack!.slice(0, -1),
                ...newTrack.slice(connectionType.newTrackConnectionIndex),
              ],
            })
          );
        }
        return;
      }

      case 'MiddleConexStart': {
        if (connectionType.lastTrackDirection === 'Down') {
          const cutIndex =
            currentTrack.coordinates.length - lastTrack.length + connectionType.lastTrackConnectionIndex + 1;
          const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex });

          setCurrentTrack(
            addNewTrack({
              currentTrack: editedCurrentTrack,
              newTrack: [...connectionType.connectorTrack!.slice(0, connectionType.connectorTrackIndex), ...newTrack],
            })
          );
        }
        return;
      }

      case 'UpUp': {
        if (
          distanceHaversine(lastTrackEnd, newTrackInit) <= UP_UP_DISTANCE &&
          Math.abs(lastTrackEnd[2]! - newTrackInit[2]!) <= UP_UP_HEIGHT
        ) {
          setCurrentTrack(addNewTrack({ currentTrack, newTrack: [lastTrackEnd, ...newTrack] }));
        }

        break;
      }

      case 'UpDown': {
        newTrack.find((trackPoint, index) => {
          const hasPoint =
            distanceHaversine(lastTrackEnd, trackPoint) <= UP_DOWN_DISTANCE &&
            trackPoint[2]! - lastTrackEnd[2]! <= UP_DOWN_HEIGHT;

          if (hasPoint) {
            setCurrentTrack(addNewTrack({ currentTrack, newTrack: [lastTrackEnd, ...newTrack.slice(index)] }));
          }

          return hasPoint;
        });

        break;
      }
      case 'DownDown': {
        newTrack.find((trackPoint, index) => {
          const hasPoint =
            distanceHaversine(lastTrackEnd, trackPoint) <= DOWN_DOWN_DISTANCE &&
            lastTrackEnd[2]! - trackPoint[2]! >= DOWN_DOWN_HEIGHT;

          if (hasPoint) {
            setCurrentTrack(addNewTrack({ currentTrack, newTrack: [lastTrackEnd, ...newTrack.slice(index)] }));
          }

          return hasPoint;
        });

        break;
      }
      case 'DownUp': {
        lastTrack.findLast((trackPoint, index) => {
          const hasPoint =
            distanceHaversine(trackPoint, newTrackInit) <= DOWN_UP_DISTANCE &&
            Math.abs(trackPoint[2]! - newTrackInit[2]!) <= DOWN_UP_HEIGHT;

          if (hasPoint) {
            const cutIndex = currentTrack.coordinates.length - lastTrack.length + index + 1;
            const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex });
            const editedTrackEnd = editedCurrentTrack.coordinates[editedCurrentTrack.coordinates.length - 1];

            setCurrentTrack(addNewTrack({ currentTrack: editedCurrentTrack, newTrack: [editedTrackEnd, ...newTrack] }));
          }
        });

        break;
      }

      default:
        return;
    }
  };

  const undoLastTrack = () => {
    if (currentTrack.trackSteps.length < 2) return;

    if (currentTrack.trackSteps.length === 2) {
      setCurrentTrack(initTrackState);
      return;
    }

    const editedCurrentTrack = clipCurrentTrack({ currentTrack });
    console.log(currentTrack);

    console.log(editedCurrentTrack);

    setCurrentTrack(editedCurrentTrack);
  };

  const clearTrack = () => setCurrentTrack(initTrackState);

  return (
    <CurrentTrackContext value={{ currentTrack, addRunToTrack, undoLastTrack, clearTrack }}>
      {children}
    </CurrentTrackContext>
  );
};
