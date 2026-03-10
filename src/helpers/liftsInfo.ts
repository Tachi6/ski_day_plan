import type { LiftType, LiftAcronym } from '../types/types';

interface LiftsInfo {
  abbreviation: LiftAcronym;
  speed: number;
  wait: number;
  prepare: number;
}

export const LIFTS_INFO: Record<LiftType, LiftsInfo> = {
  chair_lift_detachable: {
    abbreviation: 'TSD',
    speed: 5.0,
    wait: 120,
    prepare: 30,
  },
  mixed_lift: {
    abbreviation: 'TMX',
    speed: 5.0,
    wait: 135,
    prepare: 45,
  },
  chair_lift: {
    abbreviation: 'TS',
    speed: 2.5,
    wait: 180,
    prepare: 50,
  },
  't-bar': {
    abbreviation: 'TK',
    speed: 3.0,
    wait: 40,
    prepare: 5,
  },
  'j-bar': {
    abbreviation: 'TK',
    speed: 3.0,
    wait: 40,
    prepare: 5,
  },
  drag_lift: {
    abbreviation: 'TK',
    speed: 3.0,
    wait: 40,
    prepare: 5,
  },
  platter: {
    abbreviation: 'TK',
    speed: 3.0,
    wait: 40,
    prepare: 5,
  },
  gondola: {
    abbreviation: 'TC',
    speed: 6.0,
    wait: 150,
    prepare: 90,
  },
  rope_tow: {
    abbreviation: 'TR',
    speed: 1.5,
    wait: 90,
    prepare: 60,
  },
  magic_carpet: {
    abbreviation: 'CT',
    speed: 0.85,
    wait: 60,
    prepare: 20,
  },
  cable_car: {
    abbreviation: 'TPV',
    speed: 10.0,
    wait: 600,
    prepare: 120,
  },
  funicular: {
    abbreviation: 'FUN',
    speed: 8.0,
    wait: 480,
    prepare: 90,
  },
  railway: {
    abbreviation: 'RRY',
    speed: 4.5,
    wait: 600,
    prepare: 120,
  },
};
