import { CustomPolyline } from './CustomPolyline';
import { useObtainData } from '../hooks/useObtainData';
import { useMap } from 'react-leaflet';
import { useEffect, useRef } from 'react';
import { MapLoadingSpinner } from './MapLoadingSpinner';

export const RunsAndLifts = () => {
  const { runs, lifts, isLoading } = useObtainData();

  const map = useMap();

  const isPanesCreated = useRef(false);

  useEffect(() => {
    if (!isPanesCreated.current) {
      map.createPane('runs');
      map.createPane('lifts');
      map.createPane('arrows');
      map.getPane('lifts')!.style.zIndex = '400';
      map.getPane('runs')!.style.zIndex = '401';
      map.getPane('arrows')!.style.zIndex = '403';

      isPanesCreated.current = true;
    }
  }, [map]);

  if (isLoading) {
    return <MapLoadingSpinner />;
  }

  // TODO: error!!!

  return (
    <>
      {runs.map((run) => (
        <CustomPolyline key={run.id} track={run} />
      ))}
      {lifts.map((lift) => (
        <CustomPolyline key={lift.id} track={lift} />
      ))}
    </>
  );
};
