import { type PropsWithChildren, use, useState } from 'react';
import { type LatLngTuple } from 'leaflet';
import { distanceHaversine, obtainSkiDistance } from '../../helpers/distances';
import { CurrentTrackContext } from './CurrentTrackContext';
import {
  addNewTrack,
  clipCurrentTrack,
  clipNewTrack,
  createConnectorTrack,
  getConnectionInfo,
  removeLastTrack,
} from './CurrentTrackHelpers';
import { useObtainData } from '../../hooks/useObtainData';
import { TrackSettingsContext } from '../trackSettings/TrackSettingsContext';
import { obtainSeconds } from '../../helpers/times';
import type { Lift, Run } from '../../interfaces/interfacesRunLift';

export interface Track {
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
const UP_DOWN_HEIGHT: number = 2.5;
const DOWN_DOWN_DISTANCE: number = 125;
const DOWN_DOWN_HEIGHT: number = 2.5;
const DOWN_UP_DISTANCE: number = 250;
const DOWN_UP_HEIGHT: number = 5;

export const CurrentTrackContextProvider = ({ children }: PropsWithChildren) => {
  const [currentTrack, setCurrentTrack] = useState<Track>(initTrackState);

  const { trackSettings } = use(TrackSettingsContext);

  const { allRuns } = useObtainData();

  const addRunToTrack = (newTrack: Run | Lift): void => {
    const lastTrack = currentTrack.trackSteps.at(-1);
    const newTrackCoords: LatLngTuple[] = newTrack.coordinates;
    const lastTrackCoords: LatLngTuple[] = lastTrack?.coordinates ?? [];

    const newTrackInit = newTrackCoords[0];
    const lastTrackEnd = lastTrackCoords.at(-1)!;

    if (newTrack.id === lastTrack?.id) return;

    const connectionType = getConnectionInfo({
      lastTrackCoords,
      newTrackCoords,
      allRuns,
    });

    const connect = connectionType.connectionType ?? connectionType.directions;

    console.log(connect);

    switch (connect) {
      case null:
      case 'EndStart':
        setCurrentTrack(
          addNewTrack({
            currentTrack,
            newTrack,
            trackSettings,
          }),
        );
        return;

      case 'EndMiddle':
        setCurrentTrack(
          addNewTrack({
            currentTrack,
            newTrack: clipNewTrack(newTrack, connectionType.newTrackConnectionIndex),
            trackSettings,
          }),
        );
        return;

      case 'MiddleStart': {
        const editedCurrentTrack = clipCurrentTrack({
          currentTrack,
          cutIndex: connectionType.lastTrackConnectionIndex + 1,
          trackSettings,
        });

        setCurrentTrack(
          addNewTrack({
            currentTrack: editedCurrentTrack,
            newTrack,
            trackSettings,
          }),
        );
        return;
      }

      case 'MiddleMiddle': {
        if (connectionType.lastTrackDirection === 'Down') {
          const editedCurrentTrack = clipCurrentTrack({
            currentTrack,
            cutIndex: connectionType.lastTrackConnectionIndex + 1,
            trackSettings,
          });

          setCurrentTrack(
            addNewTrack({
              currentTrack: editedCurrentTrack,
              newTrack: clipNewTrack(newTrack, connectionType.newTrackConnectionIndex),
              trackSettings,
            }),
          );
        }
        return;
      }

      case 'EndConexStart': {
        const currentTrackWithConnector = addNewTrack({
          currentTrack,
          newTrack: connectionType.connectorTrack!,
          trackSettings,
        });

        setCurrentTrack(
          addNewTrack({
            currentTrack: currentTrackWithConnector,
            newTrack,
            trackSettings,
          }),
        );
        return;
      }

      case 'EndConexMiddle': {
        const currentTrackWithConnector = addNewTrack({
          currentTrack,
          newTrack: connectionType.connectorTrack!,
          trackSettings,
        });

        setCurrentTrack(
          addNewTrack({
            currentTrack: currentTrackWithConnector,
            newTrack: clipNewTrack(newTrack, connectionType.newTrackConnectionIndex),
            trackSettings,
          }),
        );
        return;
      }
      case 'MiddleConexMiddle': {
        if (connectionType.lastTrackDirection === 'Down') {
          const editedCurrentTrack = clipCurrentTrack({
            currentTrack,
            cutIndex: connectionType.lastTrackConnectionIndex + 1,
            trackSettings,
          });

          const currentTrackWithConnector = addNewTrack({
            currentTrack: editedCurrentTrack,
            newTrack: connectionType.connectorTrack!,
            trackSettings,
          });

          setCurrentTrack(
            addNewTrack({
              currentTrack: currentTrackWithConnector,
              newTrack: clipNewTrack(newTrack, connectionType.newTrackConnectionIndex),
              trackSettings,
            }),
          );
        }
        return;
      }

      case 'MiddleConexStart': {
        if (connectionType.lastTrackDirection === 'Down') {
          const editedCurrentTrack = clipCurrentTrack({
            currentTrack,
            cutIndex: connectionType.lastTrackConnectionIndex + 1,
            trackSettings,
          });

          const currentTrackWithConnector = addNewTrack({
            currentTrack: editedCurrentTrack,
            newTrack: connectionType.connectorTrack!,
            trackSettings,
          });

          setCurrentTrack(
            addNewTrack({
              currentTrack: currentTrackWithConnector,
              newTrack,
              trackSettings,
            }),
          );
        }
        return;
      }

      case 'UpUp': {
        if (
          distanceHaversine(lastTrackEnd, newTrackInit) <= UP_UP_DISTANCE &&
          newTrackInit[2]! - lastTrackEnd[2]! <= UP_UP_HEIGHT
        ) {
          const currentTrackWithConnector = addNewTrack({
            currentTrack,
            newTrack: createConnectorTrack([lastTrackEnd, newTrackCoords[0]]),
            trackSettings,
          });

          setCurrentTrack(
            addNewTrack({
              currentTrack: currentTrackWithConnector,
              newTrack: newTrack,
              trackSettings,
            }),
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
            const currentTrackWithConnector = addNewTrack({
              currentTrack,
              newTrack: createConnectorTrack([lastTrackEnd, newTrackCoords[index]]),
              trackSettings,
            });

            setCurrentTrack(
              addNewTrack({
                currentTrack: currentTrackWithConnector,
                newTrack: clipNewTrack(newTrack, index),
                trackSettings,
              }),
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
            trackPoint[2]! - lastTrackEnd[2]! <= DOWN_DOWN_HEIGHT;

          if (hasPoint) {
            const currentTrackWithConnector = addNewTrack({
              currentTrack,
              newTrack: createConnectorTrack([lastTrackEnd, newTrackCoords[index]]),
              trackSettings,
            });

            setCurrentTrack(
              addNewTrack({
                currentTrack: currentTrackWithConnector,
                newTrack: clipNewTrack(newTrack, index),
                trackSettings,
              }),
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
            newTrackInit[2]! - trackPoint[2]! <= DOWN_UP_HEIGHT;

          if (hasPoint) {
            const editedCurrentTrack =
              index + 1 === lastTrackCoords.length
                ? currentTrack
                : clipCurrentTrack({ currentTrack, cutIndex: index, trackSettings });
            const editedTrackEnd = lastTrackCoords.at(-1)!;

            const currentTrackWithConnector = addNewTrack({
              currentTrack: editedCurrentTrack,
              newTrack: createConnectorTrack([editedTrackEnd, newTrackCoords[0]]),
              trackSettings,
            });

            setCurrentTrack(
              addNewTrack({
                currentTrack: currentTrackWithConnector,
                newTrack: newTrack,
                trackSettings,
              }),
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

  const recalculateStats = () => {
    const newCurrentTrack: Track = {
      ...currentTrack,
      downhillDistance: 0,
      uphillDistance: 0,
      totalDistance: 0,
      totalTime: 0,
    };

    currentTrack.trackSteps.forEach((track) => {
      const trackDistance = obtainSkiDistance({
        distance: track.length,
        turn: trackSettings.turn,
        runType: track.difficulty,
      });

      const trackTime = obtainSeconds({
        distance: trackDistance,
        track: track,
        speed: trackSettings.speed,
        stops: trackSettings.stops,
      });

      const isDownhill = track.type === 'run';

      newCurrentTrack.downhillDistance =
        newCurrentTrack.totalDistance + (isDownhill ? trackDistance : 0);
      newCurrentTrack.uphillDistance =
        newCurrentTrack.totalDistance + +(!isDownhill ? trackDistance : 0);
      newCurrentTrack.totalDistance = newCurrentTrack.totalDistance + trackDistance;
      newCurrentTrack.totalTime = newCurrentTrack.totalTime + trackTime;
    });

    setCurrentTrack(newCurrentTrack);
  };

  return (
    <CurrentTrackContext
      value={{
        currentTrack,
        addRunToTrack,
        undoLastTrack,
        clearTrack,
        recalculateStats,
      }}
    >
      {children}
    </CurrentTrackContext>
  );
};
