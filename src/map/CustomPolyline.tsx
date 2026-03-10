import { use, useEffect, useEffectEvent, useRef } from 'react';
import { useMap } from 'react-leaflet';
import 'leaflet-textpath';
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
    const difficulty = track.type === 'run' ? track.difficulty : undefined;

    const polyline = new HighlightablePolyline(positions, {
      color: runColor(difficulty),
      weight: 6,
      raised: false,
      outlineWeight: 10,
      outlineColor: borderColor(difficulty),
      pane: difficulty ? 'runs' : 'lifts',
      opacity: 0.95,
    });

    polyline.setText(track.name, {
      center: true,
      offset: -7,
      orientation: positions[positions.length - 1][1] > positions[0][1] ? 0 : 180,
      attributes: { fill: primaryTextColor },
    });

    polyline.on('click', () => handleClick(track));

    const polylineArrows = L.polyline(positions, {
      color: 'transparent',
      weight: 4,
      interactive: false,
    }).arrowheads({
      yawn: 45,
      frequency: '100m',
      fill: true,
      color: arrowColor(difficulty),
      weight: 1,
      size: '4px',
      pane: 'arrows',
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
