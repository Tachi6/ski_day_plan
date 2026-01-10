import { PolylineCustom } from './PolylineCustom';
import { useObtainData } from '../hooks/useObtainData';
import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';

export const RunsAndLifts = () => {
  const { runs, lifts } = useObtainData();

  const map = useMap();

  const isPanesCreated = useRef(false);

  useEffect(() => {
    // Panes to manage layers positions
    if (!isPanesCreated.current) {
      map.createPane('runs-lifts');
      map.createPane('arrows');
      map.getPane('runs-lifts')!.style.zIndex = '400';
      map.getPane('arrows')!.style.zIndex = '403';

      isPanesCreated.current = true;
    }
  }, [map]);

  return (
    <>
      {runs.map((run) => (
        <PolylineCustom key={run.id} track={run} />
      ))}
      {lifts.map((lift) => (
        <PolylineCustom key={lift.id} track={lift} />
      ))}
    </>
  );
};
