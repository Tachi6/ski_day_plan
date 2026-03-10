export type Difficulty =
  | 'novice'
  | 'easy'
  | 'intermediate'
  | 'advanced'
  | 'expert'
  | 'freeride'
  | 'extreme';

export type LiftType =
  | 'cable_car' // Teleférico
  | 'gondola' // Telecabina
  | 'funicular' // Funicular
  | 'chair_lift' // Telesilla
  | 'chair_lift_detachable' // Telesilla desembragable
  | 't-bar' // Telearrastre biplaza (T)
  | 'j-bar' // Telearrastre monoplaza (J)
  | 'drag_lift' // Telearrastre genérico
  | 'platter' // Telearrastre de plato
  | 'rope_tow' // Telecuerda
  | 'magic_carpet' // Cinta transportadora
  | 'mixed_lift' // TSD + TC
  | 'railway'; // Tren de montaña

export type LiftAcronym = 'TC' | 'TSD' | 'TK' | 'TMX' | 'TS' | 'CT' | 'TPV' | 'TR' | 'FUN' | 'RRY';

export type Grooming =
  | 'classic'
  | 'classic+skating'
  | 'backcountry'
  | 'skating'
  | 'scooter'
  | 'mogul';
