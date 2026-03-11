import 'leaflet-arrowheads';
import { MapContainer, TileLayer } from 'react-leaflet';
import { defaultCenter } from '../data/resorts';
import { RunsAndLifts } from '../map/RunsAndLifts';
import { CurrentTracks } from '../map/CurrentTracks';

export const MapView = () => {
  return (
    <MapContainer
      center={defaultCenter}
      zoom={16}
      scrollWheelZoom={true}
      minZoom={12}
      zoomControl={false}
      preferCanvas={true}
      className="back-layer"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> | &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | &copy; <a href="https://openskimap.org">OpenSkiMap</a> | &copy; <a href="https://skimap.org">Skimap.org</a>'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        subdomains={['a', 'b', 'c', 'd']}
      />
      <RunsAndLifts />
      <CurrentTracks />
    </MapContainer>
  );
};
