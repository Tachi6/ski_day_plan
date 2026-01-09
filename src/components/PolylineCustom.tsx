import type { LatLngTuple } from 'leaflet';
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-textpath';
import { HighlightablePolyline } from 'leaflet-highlightable-layers';
import { arrowColor, borderColor, runColor } from '../helpers/colors';
import L from 'leaflet';

export type RunTypes = 'novice' | 'easy' | 'intermediate' | 'advanced' | 'expert' | 'freeride';

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

    const polyline = new HighlightablePolyline(positions, {
      color: runColor(difficulty as RunTypes),
      weight: 6,
      raised: false,
      outlineWeight: 10,
      outlineColor: borderColor(difficulty as RunTypes),
      lhlZIndex: 0,
    });

    polyline.setText(name, {
      center: true,
      offset: -7,
      orientation: positions[positions.length - 1][1] > positions[0][1] ? 0 : 180,
    });

    const polylineArrows = L.polyline(positions, {
      color: 'transparent',
      weight: 6,
      interactive: false,
    }).arrowheads({
      yawn: 45,
      frequency: '100m',
      fill: true,
      color: arrowColor(difficulty as RunTypes),
      weight: 1,
      size: '6px',
    });

    polyline.on('click', onClick);

    polyline.addTo(map);
    polylineArrows.addTo(map);

    return () => {
      polyline.remove();
      polylineArrows.remove();
    };
  }, [map, positions, difficulty, name, onClick]);

  return null;
};
