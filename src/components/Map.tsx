import 'leaflet-arrowheads';
import { MapContainer, TileLayer } from 'react-leaflet';
import { ZoomControlLayer } from './ZoomControlLayer';
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
      className="back-layer theme"
    >
      <TileLayer
        // BASE OSM
        // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // STADIA OUTDOORS
        attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png?api_key=$1c941a16-e805-4d4d-b32d-77401f1754f9"
      />
      <ZoomControlLayer />
      <RunsAndLifts />
      <CurrentTracks />
    </MapContainer>
  );
};
