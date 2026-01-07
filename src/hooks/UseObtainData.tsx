import { useEffect, useState } from 'react';
import type { LatLngTuple } from 'leaflet';

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
  duration?: number;
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
  duration?: number;
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

export const useObtainData = () => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [connections, setConnections] = useState<Run[]>([]);

  useEffect(() => {
    const obtainRuns = async () => {
      const resp = await fetch('baqueira_runs.json');
      const data = await resp.json();
      const loadedRuns: Run[] = data.runs.map((run: Run) => ({
        ...run,
        geometry: {
          type: run.geometry.type,
          coordinates: parseCoordinates(run.geometry.coordinates),
        },
      }));

      setRuns(loadedRuns.filter((run) => run.properties.uses === 'downhill'));
      setConnections(loadedRuns.filter((run) => run.properties.uses === 'connection'));
    };

    const obtainLifts = async () => {
      const resp = await fetch('baqueira_lifts.json');
      const data = await resp.json();
      const loadedLifts: Lift[] = data.lifts.map((lift: Lift) => ({
        ...lift,
        geometry: {
          type: lift.geometry.type,
          coordinates: parseCoordinates(lift.geometry.coordinates),
        },
      }));

      setLifts(loadedLifts);
    };

    obtainRuns();
    obtainLifts();
  }, []);

  return { runs, lifts, connections };
};
