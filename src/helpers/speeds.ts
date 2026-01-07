const parseKmHToMS = (speedKmH: number) => speedKmH / 3.6;

export type LiftsTypes = 'TC' | 'TSD' | 'TQ' | 'TS' | 'CT' | 'TCD';

export const liftSpeed: Record<LiftsTypes, number> = {
  TC: 6.0,
  TSD: 5.0,
  TQ: 3.0,
  TS: 2.5,
  TCD: 1.5,
  CT: 0.65,
};

export type RunTypes = 'novice' | 'easy' | 'intermediate' | 'advanced' | 'expert' | 'freeride';

export const runSpeed: Record<RunTypes, number> = {
  novice: parseKmHToMS(20),
  easy: parseKmHToMS(30),
  intermediate: parseKmHToMS(20),
  advanced: parseKmHToMS(10),
  expert: parseKmHToMS(10),
  freeride: parseKmHToMS(10),
};
