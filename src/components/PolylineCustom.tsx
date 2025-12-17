import type { LatLngTuple } from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

const runColor = (type: string | undefined) => {
  switch (type) {
    case 'novice':
      return '#00FF00';
    case 'easy':
      return '#0000FF';
    case 'intermediate':
      return '#FF0000';
    case 'advanced':
      return '#000000';
    case 'expert':
      return '#000000';
    case 'freeride':
      return '#FF8000';
    case undefined:
      return '#808080';
    default:
      return '#0000FF';
  }
};

interface Props {
  positions: LatLngTuple[];
  difficulty: string | undefined;
  onClick: () => void;
}

export const PolylineCustom = ({ positions, difficulty, onClick }: Props): null => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const polylineEvents = L.polyline(positions, {
      color: 'transparent',
      weight: 16,
      interactive: true,
    });

    const polyline = L.polyline(positions, {
      color: runColor(difficulty),
      weight: 6,
      interactive: false,
    });

    polylineEvents.on('click', onClick);

    polylineEvents.addTo(map);
    polyline.addTo(map);

    return () => {
      polylineEvents.remove();
      polyline.remove();
    };
  }, [map, positions, difficulty, onClick]);

  return null;
};
