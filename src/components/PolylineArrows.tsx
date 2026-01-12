import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { HighlightablePolyline } from 'leaflet-highlightable-layers';
import type { Lift, Run } from '../hooks/useObtainData';
import L from 'leaflet';
import { borderColor, runColor, selectedColor, textColor } from '../helpers/colors';
import type { RunTypes } from './PolylineCustom';
import { renderToString } from 'react-dom/server';

interface Props {
  track: Run | Lift;
  index: number;
}

export const PolylineArrows = ({ track, index }: Props): null => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const basePolyline = L.polyline(track.geometry.coordinates, {
      weight: 10,
      color: borderColor(track.properties.difficulty as RunTypes),
      interactive: false,
    });

    const polyline = new HighlightablePolyline(track.geometry.coordinates, {
      color: runColor(track.properties.difficulty as RunTypes),
      weight: 4,
      raised: false,
      outlineWeight: 6,
      interactive: false,
      outlineColor: selectedColor,
      pane: 'current-track',
    });

    const icon = L.divIcon({
      className: 'circle-marker',
      html: renderToString(
        <div
          className="track-step"
          style={{
            borderColor: borderColor(track.properties.difficulty as RunTypes),
            backgroundColor: runColor(track.properties.difficulty as RunTypes),
            color: textColor(track.properties.difficulty as RunTypes),
          }}
        >
          {index}
        </div>
      ),
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const marker = L.marker(track.geometry.coordinates[0], {
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
  }, [map, track, index]);

  return null;
};
