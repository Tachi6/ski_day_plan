import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { useMap } from 'react-leaflet';

interface Props {
  size: number;
  renderElement: React.ReactNode;
}

export const CenterMessage = ({ size, renderElement }: Props) => {
  const map = useMap();

  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!map) return;

    map.dragging.disable();
    map.scrollWheelZoom.disable();
    map.doubleClickZoom.disable();
    map.boxZoom.disable();
    map.keyboard.disable();
    map.touchZoom.disable();

    const icon = L.divIcon({
      className: 'center-message',
      html: renderToString(renderElement),
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });

    markerRef.current = L.marker(map.getCenter(), {
      icon: icon,
    });

    markerRef.current.addTo(map);

    return () => {
      map.dragging.enable();
      map.scrollWheelZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
      map.touchZoom.enable();

      markerRef.current?.remove();
      markerRef.current = null;
    };
  }, [map, renderElement, size]);

  return null;
};
