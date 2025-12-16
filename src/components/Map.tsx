import type { LatLngTuple } from 'leaflet';
import 'leaflet-arrowheads';
import { use, useEffect, useState } from 'react';
import { MapContainer, Polyline, TileLayer } from 'react-leaflet';
import { PolylineArrows } from './PolylineArrows';
import { ZoomControlLayer } from './ZoomControlLayer';
import { CurrentTrackContext } from '../context/CurrentTrackContext';

export interface Run {
  id: number;
  type: string;
  properties: RunProperties;
  geometry: Geometry;
}

export interface Lift {
  id: number;
  type: string;
  properties: LiftProperties;
  geometry: Geometry;
}

interface RunProperties {
  feature_id: string;
  name: string;
  status: string;
  sources: string;
  websites: string;
  wikidata_id?: string;
  country_codes: string;
  region_codes: string;
  countries: string;
  regions: string;
  localities?: string;
  uses: string;
  ref?: string;
  description?: string;
  difficulty: string;
  difficulty_convention: string;
  oneway: number;
  lit: number;
  gladed: number;
  patrolled: number;
  grooming: string;
  elevation_profile_heights: string;
  elevation_profile_resolution: number;
  ski_area_ids: string;
  ski_area_names: string;
}

interface LiftProperties {
  feature_id: string;
  name: string;
  status: string;
  sources: string;
  websites: string;
  wikidata_id?: string;
  country_codes: string;
  region_codes: string;
  countries: string;
  regions: string;
  localities?: string;
  lift_type: string;
  ref?: string;
  ref_fr_cairn?: string;
  description?: string;
  difficulty?: string;
  oneway: number;
  occupancy: number;
  capacity: number;
  duration: number;
  detachable: number;
  bubble: number;
  heating: number;
  ski_area_ids: string;
  ski_area_names: string;
}

interface Geometry {
  type: string;
  coordinates: LatLngTuple[];
}

const parseCoordinates = (coordinates: LatLngTuple[]): LatLngTuple[] => {
  return coordinates.map((coordinate) => [coordinate[1], coordinate[0], coordinate[2]]);
};

const runColor = (type: string | undefined) => {
  switch (type) {
    case 'novice':
      return '#00FF00';
    case 'easy':
      return '#0000FF';
    case 'intermediate':
      return '#FF0000';
    case 'advanced':
      return '#000000';
    case 'expert':
      return '#000000';
    case 'freeride':
      return '#FF8000';
    case undefined:
      return '#808080';
    default:
      return '#0000FF';
  }
};

export const Map = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [lifts, setLifts] = useState<Lift[]>([]);

  const { currentTrack, addRunToTrack } = use(CurrentTrackContext);

  useEffect(() => {
    const obtainRuns = async () => {
      const resp = await fetch('baqueira_runs.json');
      const data = await resp.json();
      const loadedRuns: Run[] = data.runs;

      setRuns(loadedRuns.filter((run) => run.properties.uses === 'downhill' || run.properties.uses === 'connection'));
    };

    const obtainLifts = async () => {
      const resp = await fetch('baqueira_lifts.json');
      const data = await resp.json();

      setLifts(data.lifts);
    };

    obtainRuns();
    obtainLifts();
  }, []);

  return (
    <MapContainer
      center={[42.6988865, 0.9347175]}
      zoom={16}
      scrollWheelZoom={true}
      minZoom={14}
      zoomControl={false}
      className="back-layer theme"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // STADIA OUTDOORS
        url="https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
      />
      <ZoomControlLayer />
      {runs.length + lifts.length > 0 &&
        [...runs, ...lifts].map((track) => {
          const parsedCoordinates = parseCoordinates(track.geometry.coordinates);
          return (
            <Polyline
              key={track.id}
              eventHandlers={{ click: () => addRunToTrack(parsedCoordinates) }}
              pathOptions={{ color: runColor(track.properties.difficulty), weight: 6 }}
              positions={parsedCoordinates}
            />
          );
        })}
      {currentTrack.coordinates.length > 0 && (
        <Polyline
          pathOptions={{ color: '#ff00FF', weight: 8, interactive: false }}
          positions={currentTrack.coordinates}
        />
      )}
      {currentTrack.coordinates.length > 0 && <PolylineArrows positions={currentTrack.coordinates} />}
    </MapContainer>
  );
};
