import type { LatLngTuple } from 'leaflet';
import type { Grooming, LiftType, Difficulty } from '../types/types';

export interface Run {
  id: string;
  type: 'run';
  sources: string;
  name: string;
  ski_area_names: string;
  uses: string;
  length: number;
  grooming: Grooming;
  difficulty: Difficulty;
  coordinates: LatLngTuple[];
}

export interface Lift {
  id: string;
  type: 'lift';
  sources: string;
  name: string;
  ski_area_names: string;
  lift_type: LiftType;
  length: number;
  duration: number;
  transitionTime: number;
  coordinates: LatLngTuple[];
}
