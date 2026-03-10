import type { Pauses, Speed, Stops } from '../context/trackSettings/TrackSettingsContext';
import type { Lift, Run } from '../interfaces/interfacesRunLift';
import { LIFTS_INFO } from './liftsInfo';
import { runSpeedTable } from './speeds';

// Stops in seconds
const stopsValues: Record<Stops, number> = {
  none: 0,
  few: 30,
  some: 45,
  many: 60,
};

// Pauses times in minutes to seconds
const pausesValues: Record<Pauses, number> = {
  breakfast: 40 * 60,
  coffee: 20 * 60,
  dinner: 60 * 60,
  coke: 20 * 60,
};

interface ObtainStopsSeconds {
  distance: number;
  stops: Stops;
}

// Stops seconds every 1000m
const obtainStopsSeconds = ({ distance, stops }: ObtainStopsSeconds) =>
  (distance / 1000) * stopsValues[stops];

interface ObtainSeconds {
  distance: number;
  track: Run | Lift;
  speed: Speed;
  stops: Stops;
}

export const obtainSeconds = ({ distance, track, speed, stops }: ObtainSeconds): number => {
  const difficulty = track.type === 'run' ? track.difficulty : undefined;

  if (difficulty) {
    return distance / runSpeedTable[speed][difficulty] + obtainStopsSeconds({ distance, stops });
  }
  const liftType = (track as Lift).lift_type;
  const duration = (track as Lift).duration;
  const liftSeconds = duration ?? distance / LIFTS_INFO[liftType].speed;

  return liftSeconds + LIFTS_INFO[liftType].wait + LIFTS_INFO[liftType].prepare;
};

export const obtainPausesSeconds = (pauses: Pauses[]): number =>
  pauses.reduce((total, pause) => total + pausesValues[pause], 0);

interface TimeToHoursAndMinutes {
  hours: string;
  minutes: string;
}

export const timeToHoursAndMinutes = (seconds: number): TimeToHoursAndMinutes => {
  const hours = Math.floor(seconds / 3600);
  // Round up minutes and limit to 59 max minutes
  const minutes = Math.min(Math.ceil((seconds % 3600) / 60), 59);

  return {
    hours: hours.toString(),
    minutes: minutes.toString().padStart(2, '0'),
  };
};
