import { useEffect } from 'react';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { LoadingSpiner } from '../assets/spiners/LoadingSpiner';
import { useMap } from 'react-leaflet';

export const MapLoadingSpinner = () => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const icon = L.divIcon({
      className: `spinner-container`,
      html: renderToString(<LoadingSpiner />),
      iconSize: [120, 120],
      iconAnchor: [60, 60],
    });

    const marker = L.marker([42.699522, 0.946113], {
      icon: icon,
    });

    marker.addTo(map);

    return () => {
      marker.remove();
    };
  }, [map]);

  return null;
};
