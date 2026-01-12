import { useMap } from 'react-leaflet';
import { use, useEffect, useRef } from 'react';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';
import { CurrentTrackPolyline } from './CurrentTrackPolyline';

export const CurrentTracks = () => {
  const { currentTrack } = use(CurrentTrackContext);

  const map = useMap();

  const isPanesCreated = useRef(false);

  useEffect(() => {
    // Panes to manage layers positions
    if (!isPanesCreated.current) {
      map.createPane('current-track');
      map.createPane('current-number');
      map.getPane('current-track')!.style.zIndex = '402';
      map.getPane('current-number')!.style.zIndex = '404';

      isPanesCreated.current = true;
    }
  }, [map]);

  const getCenterIndex = (length: number, selectedIndex: number): number => {
    const midIndex = Math.floor(length / 2);

    if (selectedIndex === 0) return midIndex;

    const offset = Math.ceil(selectedIndex / 2);

    return selectedIndex % 2 === 1 ? Math.min(midIndex + offset, length - 1) : Math.max(midIndex - offset, 0);
  };

  return (
    <>
      {currentTrack.trackSteps.map((track, index) => {
        const markerIndex = getCenterIndex(track.geometry.coordinates.length, index);

        return (
          <CurrentTrackPolyline key={`${track.id}-${index}`} track={track} index={index} markerIndex={markerIndex} />
        );
      })}
    </>
  );
};
