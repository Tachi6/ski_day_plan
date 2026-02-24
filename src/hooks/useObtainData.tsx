import { useEffect, useState } from 'react';
import type { LatLngTuple } from 'leaflet';
import { get, getDatabase, ref } from 'firebase/database';
import { app } from '../firebase/firebaseConfig';
import { smoothSkiSlopeHermite, parseCoordinates } from '../helpers/curvedPolylines';

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
  name: string | null;
  status: string;
  sources: string;
  websites: string;
  wikidata_id?: string;
  country_codes: string;
  region_codes: string;
  countries: string;
  regions: string;
  localities?: string;
  uses?: string;
  ref?: string;
  description?: string;
  difficulty?: string;
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
  uses?: string;
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

type Status = 'idle' | 'loading' | 'success' | 'error';

export const useObtainData = (dbName?: string, specialTag?: string) => {
  const [runs, setRuns] = useState<Run[]>([]);
  const [lifts, setLifts] = useState<Lift[]>([]);
  const [allRuns, setAllRuns] = useState<Run[]>([]);
  const [status, setStatus] = useState<Status>('idle');

  useEffect(() => {
    const obtainData = async () => {
      if (!dbName) return;

      setStatus('loading');

      try {
        const runsLiftsDB = ref(getDatabase(app), dbName);
        const snapshot = await get(runsLiftsDB);
        const data = snapshot.val();

        const loadedRuns: Run[] = data.runs.map((run: Run) => ({
          ...run,
          geometry: {
            type: run.geometry.type,
            coordinates: smoothSkiSlopeHermite(parseCoordinates(run.geometry.coordinates)),
          },
        }));
        const loadedLifts: Lift[] = data.lifts.map((lift: Lift) => ({
          ...lift,
          geometry: {
            type: lift.geometry.type,
            coordinates: parseCoordinates(lift.geometry.coordinates),
          },
        }));

        const filteredRuns = specialTag
          ? loadedRuns.filter((run) => run.properties.ski_area_names.includes(specialTag))
          : loadedRuns;
        const filteredLifts = specialTag
          ? loadedLifts.filter((lift) => lift.properties.ski_area_names.includes(specialTag))
          : loadedLifts;

        setRuns(filteredRuns.filter((run) => run.properties.uses === 'downhill'));
        setAllRuns(
          filteredRuns.filter((run) => run.properties.uses === 'downhill' || run.properties.uses === 'connection'),
        );
        setLifts(filteredLifts);
        setStatus('success');
      } catch (_) {
        setStatus('error');
      }
    };

    obtainData();
  }, [dbName, specialTag]);

  return {
    runs,
    lifts,
    allRuns,
    status,
  };
};
