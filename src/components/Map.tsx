import 'leaflet-arrowheads';
import { MapContainer, TileLayer } from 'react-leaflet';
import { RunsAndLifts } from './RunsAndLifts';
import { CurrentTracks } from './CurrentTracks';
import { defaultCenter } from '../data/resorts';

export const Map = () => {
  return (
    <MapContainer
      center={defaultCenter}
      zoom={16}
      scrollWheelZoom={true}
      minZoom={12}
      zoomControl={false}
      className="back-layer"
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
