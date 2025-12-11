import type { LatLngTuple } from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface Props {
  positions: LatLngTuple[];
}

export const PolylineArrows = ({ positions }: Props): null => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const polylineWithArrows = L.polyline(positions, {
      color: 'transparent',
      weight: 8,
      interactive: false,
    }).arrowheads({ frequency: '100m', fill: true, color: '#ffff00', weight: 1, size: '8px' });

    polylineWithArrows.addTo(map);

    return () => {
      polylineWithArrows.remove();
    };
  }, [map, positions]);

  return null;
};
