import 'leaflet-arrowheads';
import { use } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import { PolylineArrows } from './PolylineArrows';
import { ZoomControlLayer } from './ZoomControlLayer';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';
import { PolylineCustom } from './PolylineCustom';
import { useObtainData } from '../hooks/useObtainData';
import { useIsPortrait } from '../hooks/useIsPortrait';

export const Map = () => {
  const { currentTrack, addRunToTrack } = use(CurrentTrackContext);

  const { runs, lifts } = useObtainData();
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
      {runs.length > 0 &&
        runs.map((track) => {
          // const time = track.properties.difficulty

          return (
            <PolylineCustom
              key={track.id}
              positions={track.geometry.coordinates}
              difficulty={track.properties.difficulty}
              name={track.properties.name}
              onClick={() => addRunToTrack(track)}
            />
          );
        })}
      {lifts.length > 0 &&
        lifts.map((track) => (
          <PolylineCustom
            key={track.id}
            positions={track.geometry.coordinates}
            difficulty={track.properties.difficulty}
            name={track.properties.name}
            onClick={() => addRunToTrack(track)}
          />
        ))}
      {currentTrack.coordinates.length > 0 && (
        <PolylineArrows
          positions={currentTrack.coordinates}
          difficulty={currentTrack.trackSteps.at(-1)?.properties.difficulty}
        />
      )}
    </MapContainer>
  );
};
