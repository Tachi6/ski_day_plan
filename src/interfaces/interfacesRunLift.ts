import type { LatLngTuple } from 'leaflet';
import type { Grooming, LiftType, Difficulty } from '../types/types';

interface BaseTrack {
  id: string;
  sources: string;
  name: string;
  ski_area_names: string;
  length: number;
  coordinates: LatLngTuple[];
}

export interface Run extends BaseTrack {
  type: 'run';
  uses: string;
  grooming: Grooming;
  difficulty: Difficulty;
}

export interface Lift extends BaseTrack {
  type: 'lift';
  lift_type: LiftType;
  duration: number;
  transitionTime: number;
  difficulty?: undefined;
  uses?: undefined;
}
