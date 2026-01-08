import { type PropsWithChildren, use, useState } from 'react';
import { type LatLngTuple } from 'leaflet';
import { distanceHaversine } from '../../helpers/distances';
import { CurrentTrackContext } from './CurrentTrackContext';
import { addNewTrack, clipCurrentTrack, getConnectionInfo, removeLastTrack } from './CurrentTrackHelpers';
import { useObtainData, type Lift, type Run } from '../../hooks/UseObtainData';
import { TrackSettingsContext } from '../trackSettings/TrackSettingsContext';

export interface Track {
  coordinates: LatLngTuple[];
  trackSteps: (Run | Lift)[];
  downhillDistance: number;
  uphillDistance: number;
  totalDistance: number;
  totalTime: number;
  descentElevation: number;
  climbElevation: number;
  downhills: number;
}

const initTrackState: Track = {
  coordinates: [],
  trackSteps: [],
  downhillDistance: 0,
  uphillDistance: 0,
  totalDistance: 0,
  totalTime: 0,
  climbElevation: 0,
  descentElevation: 0,
  downhills: 0,
};

const UP_UP_DISTANCE: number = 250;
const UP_UP_HEIGHT: number = 7.5;
const UP_DOWN_DISTANCE: number = 250;
const UP_DOWN_HEIGHT: number = 0;
const DOWN_DOWN_DISTANCE: number = 125;
const DOWN_DOWN_HEIGHT: number = 2.5;
const DOWN_UP_DISTANCE: number = 250;
const DOWN_UP_HEIGHT: number = 2.5;

export const CurrentTrackContextProvider = ({ children }: PropsWithChildren) => {
  const [currentTrack, setCurrentTrack] = useState<Track>(initTrackState);

  const { trackSettings } = use(TrackSettingsContext);

  const { connections } = useObtainData();

  const addRunToTrack = (newTrack: Run | Lift): void => {
    const newTrackCoords: LatLngTuple[] = newTrack.geometry.coordinates;
    // Last added track
    // const lastTrackStepInit = currentTrack.trackSteps.at(-1)!.geometry.coordinates[0];
    // const lastTrackStepEnd = currentTrack.trackSteps.at(-1)?.geometry.coordinates.at(-1);
    // const lastTrack = currentTrack.coordinates.slice(lastTrackStepInit, lastTrackStepEnd);
    const lastTrackCoords: LatLngTuple[] = currentTrack.trackSteps.at(-1)?.geometry.coordinates ?? [];

    const newTrackInit = newTrackCoords[0];
    const lastTrackEnd = lastTrackCoords.at(-1)!;

    const connectionType = getConnectionInfo({
      lastTrackCoords,
      newTrackCoords,
      connections,
    });

    const connect = connectionType.connectionType ?? connectionType.directions;

    console.log(connect);

    switch (connect) {
      case null:
      case 'EndStart':
        setCurrentTrack(
          addNewTrack({
            currentTrack,
            newTrack: newTrack,
            trackSettings: trackSettings,
          })
        );
        return;

      case 'EndMiddle':
        setCurrentTrack(
          addNewTrack({
            currentTrack,
            newTrack: {
              ...newTrack,
              geometry: {
                coordinates: newTrackCoords.slice(connectionType.newTrackConnectionIndex),
                type: newTrack.geometry.type,
              },
            },
            trackSettings: trackSettings,
          })
          // newTrack: newTrackCoords.slice(connectionType.newTrackConnectionIndex) })
        );
        return;

      case 'MiddleStart': {
        const cutIndex =
          currentTrack.coordinates.length - lastTrackCoords.length + connectionType.lastTrackConnectionIndex + 1;
        const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex, trackSettings });

        setCurrentTrack(
          addNewTrack({
            currentTrack: editedCurrentTrack,
            newTrack,
            trackSettings: trackSettings,
          })
        );
        return;
      }

      case 'MiddleMiddle': {
        if (connectionType.lastTrackDirection === 'Down') {
          const cutIndex =
            currentTrack.coordinates.length - lastTrackCoords.length + connectionType.lastTrackConnectionIndex + 1;
          const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex, trackSettings });

          setCurrentTrack(
            addNewTrack({
              currentTrack: editedCurrentTrack,
              newTrack: {
                ...newTrack,
                geometry: {
                  coordinates: newTrackCoords.slice(connectionType.newTrackConnectionIndex),
                  type: newTrack.geometry.type,
                },
              },
              trackSettings: trackSettings,
            })
          );
        }

        return;
      }

      case 'EndConexStart':
        setCurrentTrack(
          addNewTrack({
            currentTrack,
            newTrack: {
              ...newTrack,
              geometry: {
                coordinates: [
                  ...connectionType.connectorTrack!.slice(0, connectionType.connectorTrackIndex),
                  ...newTrackCoords,
                ],
                type: newTrack.geometry.type,
              },
            },
            trackSettings: trackSettings,
          })
        );
        return;

      case 'EndConexMiddle':
        setCurrentTrack(
          addNewTrack({
            currentTrack,
            newTrack: {
              ...newTrack,
              geometry: {
                coordinates: [
                  ...connectionType.connectorTrack!.slice(0, -1),
                  ...newTrackCoords.slice(connectionType.newTrackConnectionIndex),
                ],
                type: newTrack.geometry.type,
              },
            },
            trackSettings: trackSettings,
          })
        );
        return;

      case 'MiddleConexMiddle': {
        if (connectionType.lastTrackDirection === 'Down') {
          const cutIndex =
            currentTrack.coordinates.length - lastTrackCoords.length + connectionType.lastTrackConnectionIndex + 1;
          const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex, trackSettings });

          setCurrentTrack(
            addNewTrack({
              currentTrack: editedCurrentTrack,
              newTrack: {
                ...newTrack,
                geometry: {
                  coordinates: [
                    ...connectionType.connectorTrack!.slice(0, -1),
                    ...newTrackCoords.slice(connectionType.newTrackConnectionIndex),
                  ],
                  type: newTrack.geometry.type,
                },
              },
              trackSettings: trackSettings,
            })
          );
        }
        return;
      }

      case 'MiddleConexStart': {
        if (connectionType.lastTrackDirection === 'Down') {
          const cutIndex =
            currentTrack.coordinates.length - lastTrackCoords.length + connectionType.lastTrackConnectionIndex + 1;
          const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex, trackSettings });

          setCurrentTrack(
            addNewTrack({
              currentTrack: editedCurrentTrack,
              newTrack: {
                ...newTrack,
                geometry: {
                  coordinates: [
                    ...connectionType.connectorTrack!.slice(0, connectionType.connectorTrackIndex),
                    ...newTrackCoords,
                  ],
                  type: newTrack.geometry.type,
                },
              },
              trackSettings: trackSettings,
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
          setCurrentTrack(
            addNewTrack({
              currentTrack,
              newTrack: {
                ...newTrack,
                geometry: {
                  coordinates: [lastTrackEnd, ...newTrackCoords],
                  type: newTrack.geometry.type,
                },
              },
              trackSettings: trackSettings,
            })
          );
        }

        break;
      }

      case 'UpDown': {
        newTrackCoords.find((trackPoint, index) => {
          const hasPoint =
            distanceHaversine(lastTrackEnd, trackPoint) <= UP_DOWN_DISTANCE &&
            trackPoint[2]! - lastTrackEnd[2]! <= UP_DOWN_HEIGHT;

          if (hasPoint) {
            setCurrentTrack(
              addNewTrack({
                currentTrack,
                newTrack: {
                  ...newTrack,
                  geometry: {
                    coordinates: [lastTrackEnd, ...newTrackCoords.slice(index)],
                    type: newTrack.geometry.type,
                  },
                },
                trackSettings: trackSettings,
              })
            );
          }
          return hasPoint;
        });

        break;
      }
      case 'DownDown': {
        newTrackCoords.find((trackPoint, index) => {
          const hasPoint =
            distanceHaversine(lastTrackEnd, trackPoint) <= DOWN_DOWN_DISTANCE &&
            lastTrackEnd[2]! - trackPoint[2]! >= DOWN_DOWN_HEIGHT;

          if (hasPoint) {
            setCurrentTrack(
              addNewTrack({
                currentTrack,
                newTrack: {
                  ...newTrack,
                  geometry: {
                    coordinates: [lastTrackEnd, ...newTrackCoords.slice(index)],
                    type: newTrack.geometry.type,
                  },
                },
                trackSettings: trackSettings,
              })
            );
          }
          return hasPoint;
        });

        break;
      }
      case 'DownUp': {
        lastTrackCoords.findLast((trackPoint, index) => {
          const hasPoint =
            distanceHaversine(trackPoint, newTrackInit) <= DOWN_UP_DISTANCE &&
            Math.abs(trackPoint[2]! - newTrackInit[2]!) <= DOWN_UP_HEIGHT;

          if (hasPoint) {
            const cutIndex = currentTrack.coordinates.length - lastTrackCoords.length + index + 1;
            const editedCurrentTrack = clipCurrentTrack({ currentTrack, cutIndex, trackSettings });
            const editedTrackEnd = editedCurrentTrack.coordinates[editedCurrentTrack.coordinates.length - 1];

            setCurrentTrack(
              addNewTrack({
                currentTrack: editedCurrentTrack,
                newTrack: {
                  ...newTrack,
                  geometry: {
                    coordinates: [editedTrackEnd, ...newTrackCoords],
                    type: newTrack.geometry.type,
                  },
                },
                trackSettings: trackSettings,
              })
            );
          }
          return hasPoint;
        });

        break;
      }

      default:
        return;
    }
  };

  const undoLastTrack = () => {
    if (currentTrack.trackSteps.length === 0) return;

    if (currentTrack.trackSteps.length === 1) {
      setCurrentTrack(initTrackState);
      return;
    }

    const editedCurrentTrack = removeLastTrack(currentTrack, trackSettings);

    setCurrentTrack(editedCurrentTrack);
  };

  const clearTrack = () => setCurrentTrack(initTrackState);

  return (
    <CurrentTrackContext value={{ currentTrack, addRunToTrack, undoLastTrack, clearTrack }}>
      {children}
    </CurrentTrackContext>
  );
};
