import { use, useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { HighlightablePolyline } from 'leaflet-highlightable-layers';
import L from 'leaflet';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';

export const PolylineArrows = (): null => {
  const map = useMap();

  const { currentTrack } = use(CurrentTrackContext);

  useEffect(() => {
    if (!map) return;

    const polyline = new HighlightablePolyline(currentTrack.coordinates, {
      color: '#ff00ff',
      weight: 6,
      raised: false,
      outlineWeight: 10,
      interactive: false,
      outlineColor: '#400040',
      pane: 'current-track',
    });

    const icon = L.divIcon({
      className: 'custom-circle-icon',
      html: `<div>${currentTrack.trackSteps.length}</div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    const markerCoordinates = currentTrack.trackSteps.at(-1)!.geometry.coordinates[0];

    const marker = L.marker(markerCoordinates, {
      icon: icon,
      pane: 'current-number',
    });

    polyline.addTo(map);
    marker.addTo(map);

    return () => {
      polyline.remove();
    };
  }, [map, currentTrack]);

  return null;
};
