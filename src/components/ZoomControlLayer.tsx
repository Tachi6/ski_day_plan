import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export const ZoomControlLayer = (): null => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const zoomControl = L.control.zoom({
      position: 'bottomright',
    });

    zoomControl.addTo(map);

    return () => {
      zoomControl.remove();
    };
  }, [map]);

  return null;
};
