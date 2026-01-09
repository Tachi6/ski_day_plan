import type { LatLngTuple } from 'leaflet';
import { memo, useEffect, useEffectEvent, useRef } from 'react';
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
// TODO: MEMO
export const PolylineCustom = memo(({ positions, difficulty, name, onClick }: Props): null => {
  const map = useMap();

  const isPanesCreated = useRef(false);

  const handleClick = useEffectEvent(onClick);

  useEffect(() => {
    if (!map) return;

    // Panes to manage layers positions
    if (!isPanesCreated.current) {
      map.createPane('runs-lifts');
      map.createPane('arrows');
      map.getPane('runs-lifts')!.style.zIndex = '400';
      map.getPane('arrows')!.style.zIndex = '401';

      isPanesCreated.current = true;
    }

    const polyline = new HighlightablePolyline(positions, {
      color: runColor(difficulty as RunTypes),
      weight: 6,
      raised: false,
      outlineWeight: 10,
      outlineColor: borderColor(difficulty as RunTypes),
      pane: 'runs-lifts',
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
      pane: 'arrows',
    });

    polyline.on('click', handleClick);

    polyline.addTo(map);
    polylineArrows.addTo(map);

    return () => {
      polyline.remove();
      polylineArrows.remove();
    };
  }, [map, positions, difficulty, name]);

  return null;
});
