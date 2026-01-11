import { useMap } from 'react-leaflet';
import { use, useEffect, useRef } from 'react';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';
import { PolylineArrows } from './PolylineArrows';

export const CurrentTracks = () => {
  const { currentTrack } = use(CurrentTrackContext);

  const map = useMap();

  const isPanesCreated = useRef(false);

  useEffect(() => {
    // Panes to manage layers positions
    if (!isPanesCreated.current) {
      map.createPane('current-track');
      map.createPane('current-number');
      map.getPane('current-track')!.style.zIndex = '401';
      map.getPane('current-number')!.style.zIndex = '403';

      isPanesCreated.current = true;
    }
  }, [map]);

  return (
    <>
      {currentTrack.trackSteps.map((track, index) => (
        <PolylineArrows key={`${track.id}${index}}`} track={track} index={index} />
      ))}
    </>
  );
};
