type LiftsTypes = 'TC' | 'TSD' | 'TQ' | 'TS' | 'CT' | 'TCD';

export const liftSpeed: Record<LiftsTypes, number> = {
  TC: 6.0,
  TSD: 5.0,
  TQ: 3.0,
  TS: 2.5,
  TCD: 1.5,
  CT: 0.65,
};
