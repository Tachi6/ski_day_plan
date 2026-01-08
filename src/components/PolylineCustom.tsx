import type { LatLngTuple } from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-textpath';

export type RunTypes = 'novice' | 'easy' | 'intermediate' | 'advanced' | 'expert' | 'freeride';

const runColor = (type: RunTypes | undefined) => {
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
  name: string;
  onClick: () => void;
}

export const PolylineCustom = ({ positions, difficulty, name, onClick }: Props): null => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const polylineEvents = L.polyline(positions, {
      color: 'transparent',
      weight: 16,
      interactive: true,
    });

    const polyline = L.polyline(positions, {
      color: runColor(difficulty as RunTypes),
      weight: 6,
      interactive: false,
    });

    polylineEvents.setText(name, {
      center: true,
      offset: -5,
      orientation: positions[positions.length - 1][1] > positions[0][1] ? 0 : 180,
    });

    polylineEvents.on('click', onClick);

    polylineEvents.addTo(map);
    polyline.addTo(map);

    return () => {
      polylineEvents.remove();
      polyline.remove();
    };
  }, [map, positions, difficulty, name, onClick]);

  return null;
};
