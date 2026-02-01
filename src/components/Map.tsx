import 'leaflet-arrowheads';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useIsPortrait } from '../hooks/useIsPortrait';
import { RunsAndLifts } from './RunsAndLifts';
import { CurrentTracks } from './CurrentTracks';

export const Map = () => {
  const isPortrait = useIsPortrait();

  return (
    <MapContainer
      center={isPortrait ? [42.701199, 0.937167] : [42.699522, 0.946113]}
      zoom={16}
      scrollWheelZoom={true}
      minZoom={14}
      zoomControl={false}
      className="back-layer"
      preferCanvas={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> | &copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        subdomains={['a', 'b', 'c', 'd']}
      />
      <RunsAndLifts />
      <CurrentTracks />
    </MapContainer>
  );
};
