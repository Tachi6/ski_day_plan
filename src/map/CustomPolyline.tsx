import { use, useEffect, useEffectEvent, useRef } from 'react';
import { useMap } from 'react-leaflet';
import { HighlightablePolyline } from 'leaflet-highlightable-layers';
import { arrowColor, borderColor, primaryTextColor, runColor } from '../helpers/colors';
import L from 'leaflet';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';
import type { Lift, Run } from '../interfaces/interfacesRunLift';

interface Props {
  track: Run | Lift;
}

export const CustomPolyline = ({ track }: Props): null => {
  const map = useMap();

  const { addRunToTrack } = use(CurrentTrackContext);

  const polylineRef = useRef<L.Polyline | null>(null);
  const polylineArrowsRef = useRef<L.Polyline | null>(null);

  const handleClick = useEffectEvent(addRunToTrack);

  useEffect(() => {
    if (!map) return;

    const positions = track.coordinates;
    const LTRpositions =
      positions[positions.length - 1][1] > positions[0][1]
        ? positions
        : structuredClone(positions).reverse();

    const polyline = new HighlightablePolyline(LTRpositions, {
      color: runColor(track.difficulty),
      weight: 8,
      raised: false,
      outlineWeight: 10,
      outlineColor: borderColor(track.difficulty),
      pane: track.difficulty ? 'runs' : 'lifts',
      opacity: 1,
    });

    const polylineArrows = L.polyline(positions, {
      color: 'transparent',
      weight: 4,
      interactive: false,
    }).arrowheads({
      yawn: 45,
      frequency: '100m',
      fill: true,
      color: arrowColor(track.difficulty),
      weight: 1,
      size: '4px',
      pane: 'arrows',
    });

    polyline.on('click', () => handleClick(track));

    polyline.on('add', () => {
      const path = polyline._path;

      const pathId = track.id;
      path.setAttribute('id', pathId);

      const textNode = L.SVG.create('text');
      const textPathNode = L.SVG.create('textPath');

      textPathNode.setAttribute('href', '#' + pathId);
      textPathNode.setAttribute('startOffset', '50%');
      textPathNode.style.textAnchor = 'middle';
      textPathNode.textContent = track.name;
      textNode.setAttribute('fill', primaryTextColor);
      textNode.setAttribute('dominant-baseline', 'central');
      textNode.setAttribute('dy', track.type === 'run' ? '-12' : '12');
      textNode.appendChild(textPathNode);

      path.parentNode!.appendChild(textNode);
    });

    polyline.addTo(map);
    polylineArrows.addTo(map);

    polylineRef.current = polyline;
    polylineArrowsRef.current = polylineArrows;

    return () => {
      polyline.remove();
      polylineArrows.remove();
      polylineRef.current = null;
      polylineArrowsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map]);

  return null;
};
