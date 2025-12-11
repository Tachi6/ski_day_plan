import type { LatLngTuple } from 'leaflet';
import { useState } from 'react';
import { distanceHaversine, trackDistance } from '../helpers/distances';

interface Track {
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

interface emptyLink {
  isDownhill: boolean;
  isLastTrackDownhill: boolean;
}

type EmptyLink = 'up+up' | 'up+down' | 'down+down' | 'down+up';

const obtainEmptyLink = ({ isDownhill, isLastTrackDownhill }: emptyLink): EmptyLink => {
  if (!isLastTrackDownhill && !isDownhill) {
    return 'up+up';
  }
  if (!isLastTrackDownhill && isDownhill) {
    return 'up+down';
  }
  if (isLastTrackDownhill && isDownhill) {
    return 'down+down';
  }
  return 'down+up';
};

const UP_UP_DISTANCE: number = 250;
const UP_UP_HEIGHT: number = 2;
const UP_DOWN_DISTANCE: number = 250;
const UP_DOWN_HEIGHT: number = -10;
const DOWN_DOWN_DISTANCE: number = 100;
const DOWN_DOWN_HEIGHT_UP: number = 2;
const DOWN_DOWN_HEIGHT_DOWN: number = -10;
const DOWN_UP_DISTANCE: number = 250;
const DOWN_UP_HEIGHT: number = 5;

export const useCurrentTrack = () => {
  const [currentTrack, setCurrentTrack] = useState<Track>(initTrackState);

  console.log(currentTrack);

  const initEqualEnd = (newTrack: LatLngTuple[], editedTrack?: Track): Track => {
    const oldTrack = editedTrack ?? currentTrack;
    const isDownHill = newTrack[0][2]! - newTrack[newTrack.length - 1][2]! >= 0;

    const newTrackStep = oldTrack.coordinates.length + newTrack.length;
    const newTrackDistance = trackDistance(newTrack);
    const newTrackElevation = Math.abs(newTrack[0][2]! - newTrack[newTrack.length - 1][2]!);

    return {
      coordinates: [...oldTrack.coordinates, ...newTrack],
      trackSteps: [...oldTrack.trackSteps, newTrackStep],
      downhillDistance: oldTrack.downhillDistance + (isDownHill ? newTrackDistance : 0),
      uphillDistance: oldTrack.uphillDistance + (!isDownHill ? newTrackDistance : 0),
      totalDistance: oldTrack.totalDistance + newTrackDistance,
      totalTime: 0,
      descentElevation: oldTrack.descentElevation + (isDownHill ? newTrackElevation : 0),
      climbElevation: oldTrack.climbElevation + (!isDownHill ? newTrackElevation : 0),
      downhills: 0,
      uphills: 0,
    };
  };

  const clipCurrentTrack = (cutIndex: number): Track => {
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

  const addRunToTrack = (newTrack: LatLngTuple[]): void => {
    console.log('click');

    const runTrackInit = newTrack[0];
    const runTrackEnd = newTrack[newTrack.length - 1];
    const currentTrackEnd = currentTrack.coordinates[currentTrack.coordinates.length - 1];
    const isDownhill = newTrack[0][2]! - newTrack[newTrack.length - 1][2]! >= 0;

    // End of currentTrack is the same as init of newTrack
    const isInitEqualEnd =
      currentTrack.coordinates.length === 0 ||
      (runTrackInit[0] === currentTrackEnd[0] &&
        runTrackInit[1] === currentTrackEnd[1] &&
        runTrackInit[2] === currentTrackEnd[2]);

    if (isInitEqualEnd) {
      console.log(1);

      setCurrentTrack(initEqualEnd(newTrack));
      return;
    }

    // End of currentTrack is the same as end of newTrack
    const isEndEqualEnd =
      runTrackEnd[0] === currentTrackEnd[0] &&
      runTrackEnd[1] === currentTrackEnd[1] &&
      runTrackEnd[2] === currentTrackEnd[2];

    if (isEndEqualEnd) {
      console.log(3);

      return;
    }

    // If end of current track is in the middle of a newTrack
    const crossIndex: number = newTrack.findIndex(
      (latLong) => latLong[0] === currentTrackEnd[0] && latLong[1] === currentTrackEnd[1]
    );

    if (crossIndex !== -1) {
      console.log(2);

      setCurrentTrack(initEqualEnd(newTrack.slice(crossIndex)));
      return;
    }

    // Last added track
    const lastTrackStepInit = currentTrack.trackSteps[currentTrack.trackSteps.length - 2];
    const lastTrackStepEnd = currentTrack.trackSteps[currentTrack.trackSteps.length - 1];
    const lastTrack = currentTrack.coordinates.slice(lastTrackStepInit, lastTrackStepEnd);
    const lastTrackEnd = lastTrack[lastTrack.length - 1];
    const isLastTrackDownhill = lastTrack[0][2]! - lastTrack[lastTrack.length - 1][2]! >= 0;

    const noLinkTracks = obtainEmptyLink({ isLastTrackDownhill, isDownhill });
    console.log(noLinkTracks);

    // If newTrack inits in the middle of last added track
    const insideIndex = lastTrack.findIndex((track) => track[0] === newTrack[0][0] && track[1] === newTrack[0][1]);
    const crossEndIndex: number = newTrack.findIndex(
      (latLong) => latLong[0] === currentTrackEnd[0] && latLong[1] === currentTrackEnd[1]
    );

    if (insideIndex !== -1 && crossEndIndex !== -1) {
      console.log(4);

      const cutIndex = currentTrack.coordinates.length - lastTrack.length + insideIndex + 1;
      const editedCurrentTrack = clipCurrentTrack(cutIndex);
      setCurrentTrack(initEqualEnd(newTrack, editedCurrentTrack));

      return;
    }

    // If end of currentTrack is diferent to init of newTrack
    switch (noLinkTracks) {
      case 'up+up': {
        if (
          distanceHaversine(lastTrackEnd, runTrackInit) < UP_UP_DISTANCE &&
          Math.abs(lastTrackEnd[2]! - runTrackInit[2]!) < UP_UP_HEIGHT
        ) {
          console.log('up + up');
          setCurrentTrack(initEqualEnd([currentTrackEnd, ...newTrack]));
          return;
        }

        break;
      }
      case 'up+down': {
        const index = newTrack.findIndex(
          (trackPoint) =>
            distanceHaversine(currentTrackEnd, trackPoint) < UP_DOWN_DISTANCE &&
            currentTrackEnd[2]! - trackPoint[2]! > UP_DOWN_HEIGHT
        );

        if (index !== -1) {
          setCurrentTrack(initEqualEnd([currentTrackEnd, ...newTrack.slice(index)]));
          return;
        }

        break;
      }
      case 'down+down': {
        const index = newTrack.findLastIndex((trackPoint) => {
          return (
            distanceHaversine(currentTrackEnd, trackPoint) < DOWN_DOWN_DISTANCE &&
            trackPoint[2]! - currentTrackEnd[2]! <= DOWN_DOWN_HEIGHT_UP &&
            trackPoint[2]! - currentTrackEnd[2]! >= DOWN_DOWN_HEIGHT_DOWN
          );
        });

        if (index !== -1) {
          setCurrentTrack(initEqualEnd([currentTrackEnd, ...newTrack.slice(index)]));
          return;
        }

        break;
      }
      case 'down+up': {
        const index = lastTrack.findLastIndex((track) => {
          console.log(track[2]! - runTrackInit[2]!);

          return (
            distanceHaversine(track, runTrackInit) < DOWN_UP_DISTANCE && track[2]! - runTrackInit[2]! < DOWN_UP_HEIGHT
          );
        });

        if (index !== -1) {
          const cutIndex = currentTrack.coordinates.length - lastTrack.length + index + 1;
          const editedCurrentTrack = clipCurrentTrack(cutIndex);
          const editedTrackEnd = editedCurrentTrack.coordinates[editedCurrentTrack.coordinates.length - 1];
          setCurrentTrack(initEqualEnd([editedTrackEnd, ...newTrack], editedCurrentTrack));
          return;
        }

        break;
      }
    }

    // if (isDownhill && emptyIndex !== -1) {
    //   console.log('dentro');

    //   setCurrentTrack(initEqualEnd([currentTrackEnd, ...newTrack.slice(emptyIndex)]));

    //   return;
    // }

    // const emptyIndex = trackToAdd.findIndex((run: LatLngTuple) => {
    //   const endPoint = currentTrack[currentTrack.length - 1];
    //   return distanceHaversine(endPoint, run) < 300 && run[2]! < endPoint[2]!;
    // });
    // If need to link currentTrack and trackToAdd and currentTrack is diferent to init of trackToAdd
    // if (!isDownhill && emptyIndex !== -1) {
    //   console.log(distanceHaversine(lastTrack[lastTrack.length - 1], newTrack[0]));

    //   const cutIndex = currentTrack.coordinates.length - lastTrack.length + emptyIndex + 1;
    //   const editedCurrentTrack = clipCurrentTrack(cutIndex);
    //   const editedTrackEnd = editedCurrentTrack.coordinates[editedCurrentTrack.coordinates.length - 1];
    //   setCurrentTrack(initEqualEnd([editedTrackEnd, ...newTrack], editedCurrentTrack));

    //   return;
    // }
  };

  return { currentTrack, addRunToTrack };
};
