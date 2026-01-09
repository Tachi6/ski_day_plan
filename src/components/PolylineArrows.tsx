import type { LatLngTuple } from 'leaflet';
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import { HighlightablePolyline } from 'leaflet-highlightable-layers';
import { type RunTypes } from './PolylineCustom';
import { borderColor } from '../helpers/colors';

interface Props {
  positions: LatLngTuple[];
  difficulty: string | undefined;
}

export const PolylineArrows = ({ positions, difficulty }: Props): null => {
  const map = useMap();

  const isPanesCreated = useRef(false);

  useEffect(() => {
    if (!map) return;

    // Pane to manage layers positions
    if (!isPanesCreated.current) {
      map.createPane('current-track');
      map.createPane('current-arrows');
      map.getPane('current-track')!.style.zIndex = '402';
      map.getPane('current-arrows')!.style.zIndex = '403';

      isPanesCreated.current = true;
    }

    const polyline = new HighlightablePolyline(positions, {
      color: '#ff00FF',
      weight: 6,
      raised: false,
      outlineWeight: 10,
      interactive: false,
      outlineColor: borderColor(difficulty as RunTypes),
      pane: 'current-track',
    });

    const polylineArrows = L.polyline(positions, {
      color: 'transparent',
      weight: 6,
      interactive: false,
      pane: 'current-arrows',
    }).arrowheads({
      yawn: 45,
      frequency: '100m',
      fill: true,
      color: '#ffff00',
      weight: 1,
      size: '6px',
      lhlZIndex: 401,
    });

    polyline.addTo(map);
    polylineArrows.addTo(map);

    return () => {
      polyline.remove();
      polylineArrows.remove();
    };
  }, [map, positions, difficulty]);

  return null;
};
