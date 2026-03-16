import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { HighlightablePolyline } from 'leaflet-highlightable-layers';
import L from 'leaflet';
import { borderColor, runColor, selectedColor } from '../helpers/colors';
import { renderToString } from 'react-dom/server';
import { CirclePosition } from '../components/CirclePosition';
import type { Lift, Run } from '../interfaces/interfacesRunLift';

interface Props {
  track: Run | Lift;
  index: number;
  markerIndex: number;
}

export const CurrentTrackPolyline = ({ track, index, markerIndex }: Props): null => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const positions = track.coordinates;

    const basePolyline = L.polyline(positions, {
      weight: 10,
      color: borderColor(track.difficulty),
      interactive: false,
    });

    const polyline = new HighlightablePolyline(positions, {
      color: runColor(track.difficulty),
      weight: 6,
      raised: false,
      outlineWeight: 8,
      interactive: false,
      outlineColor: selectedColor,
      pane: 'current-track',
      opacity: 1,
    });

    const icon = L.divIcon({
      className: 'circle-marker',
      html: renderToString(<CirclePosition difficulty={track.difficulty} position={index + 1} />),
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker(positions[markerIndex], {
      icon: icon,
      pane: 'current-number',
    });

    basePolyline.addTo(map);
    polyline.addTo(map);
    marker.addTo(map);

    return () => {
      basePolyline.remove();
      polyline.remove();
      marker.remove();
    };
  }, [map, track, index, markerIndex]);

  return null;
};
