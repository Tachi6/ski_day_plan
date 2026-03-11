import { type Speed } from '../context/trackSettings/TrackSettingsContext';
import type { Difficulty } from '../types/types';

type RunSpeed = {
  [key in Speed]: {
    [key in Difficulty]: number;
  };
};

export const runSpeedTable: RunSpeed = {
  high: {
    novice: 30 / 3.6,
    easy: 35 / 3.6,
    intermediate: 45 / 3.6,
    expert: 30 / 3.6,
    advanced: 30 / 3.6,
    extreme: 25 / 3.6,
    freeride: 25 / 3.6,
  },
  mid: {
    novice: 22.5 / 3.6,
    easy: 27.5 / 3.6,
    intermediate: 37.5 / 3.6,
    expert: 22.5 / 3.6,
    advanced: 22.5 / 3.6,
    extreme: 17.5 / 3.6,
    freeride: 17.5 / 3.6,
  },
  low: {
    novice: 15 / 3.6,
    easy: 20 / 3.6,
    intermediate: 30 / 3.6,
    expert: 15 / 3.6,
    advanced: 15 / 3.6,
    extreme: 10 / 3.6,
    freeride: 10 / 3.6,
  },
  xlow: {
    novice: 7.5 / 3.6,
    easy: 12.5 / 3.6,
    intermediate: 22.5 / 3.6,
    expert: 7.5 / 3.6,
    advanced: 7.5 / 3.6,
    extreme: 2.5 / 3.6,
    freeride: 2.5 / 3.6,
  },
};
