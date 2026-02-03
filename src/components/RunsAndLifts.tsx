import { CustomPolyline } from './CustomPolyline';
import { useObtainData } from '../hooks/useObtainData';
import { useMap } from 'react-leaflet';
import { useContext, useEffect, useEffectEvent, useRef } from 'react';
import { CenterMessage } from './CenterMessage';
import { ErrorMessage } from './ErrorMessage';
import { LoadingSpiner } from '../assets/spiners/LoadingSpiner';
import { SelectResortContext } from '../context/selectResortContext/SelectResortContext';
import { useIsPortrait } from '../hooks/useIsPortrait';

export const RunsAndLifts = () => {
  const map = useMap();

  const isPortrait = useIsPortrait();

  const { selectedResort } = useContext(SelectResortContext);

  const { runs, lifts, status } = useObtainData(selectedResort?.dbName, selectedResort?.specialFilter);

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

  const centerMap = useEffectEvent(() => {
    if (selectedResort) {
      map.setView(isPortrait ? selectedResort.centerPortrait : selectedResort.centerLandscape);
    }
  });

  useEffect(() => {
    centerMap();
  }, [selectedResort]);

  if (status === 'idle') {
    return null;
  }

  if (status === 'loading') {
    return <CenterMessage size={100} renderElement={<LoadingSpiner />} />;
  }

  if (status === 'error') {
    return <CenterMessage size={250} renderElement={<ErrorMessage />} />;
  }

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
