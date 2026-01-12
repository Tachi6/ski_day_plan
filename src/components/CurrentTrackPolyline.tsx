import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { HighlightablePolyline } from 'leaflet-highlightable-layers';
import type { Lift, Run } from '../hooks/useObtainData';
import L from 'leaflet';
import { borderColor, runColor, selectedColor, textColor } from '../helpers/colors';
import type { RunTypes } from './CustomPolyline';
import { renderToString } from 'react-dom/server';

interface Props {
  track: Run | Lift;
  index: number;
  markerIndex: number;
}

export const CurrentTrackPolyline = ({ track, index, markerIndex }: Props): null => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const positions = track.geometry.coordinates;
    const difficulty = track.properties.difficulty;

    const basePolyline = L.polyline(positions, {
      weight: 10,
      color: borderColor(difficulty as RunTypes),
      interactive: false,
    });

    const polyline = new HighlightablePolyline(positions, {
      color: runColor(difficulty as RunTypes),
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
            borderColor: borderColor(difficulty as RunTypes),
            backgroundColor: runColor(difficulty as RunTypes),
            color: textColor(difficulty as RunTypes),
          }}
        >
          {index + 1}
        </div>
      ),
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
