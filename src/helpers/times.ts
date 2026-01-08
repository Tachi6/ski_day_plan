import type { RunTypes } from '../components/PolylineCustom';
import type { Pauses, Speed, Stops } from '../context/trackSettings/TrackSettingsContext';
import type { Lift, Run } from '../hooks/UseObtainData';
import { liftSpeed, runSpeedTable, type LiftsTypes } from './speeds';

interface ObtainTimeProps {
  distance: number;
  track: Run | Lift;
  speed: Speed;
  stops: Stops;
}

interface Time {
  hours: string;
  minutes: string;
}

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

interface StopsSecondsProps {
  distance: number;
  stops: Stops;
}

// Stops seconds every 1000m
const obtainStopsSeconds = ({ distance, stops }: StopsSecondsProps) => (distance / 1000) * stopsValues[stops];

export const obtainSeconds = ({ distance, track, speed, stops }: ObtainTimeProps): number => {
  if (track.properties.difficulty) {
    return (
      distance / runSpeedTable[speed][track.properties.difficulty as RunTypes] + obtainStopsSeconds({ distance, stops })
    );
  }
  return distance / liftSpeed[track.properties.name.split(' ')[0] as LiftsTypes];
};

export const obtainPausesSeconds = (pauses: Pauses[]) =>
  pauses.reduce((total, pause) => total + pausesValues[pause], 0);

export const timeToHoursAndMinutes = (seconds: number): Time => {
  const hours = Math.floor(seconds / 3600);
  // Round up minutes and limit to 59 max minutes
  const minutes = Math.min(Math.ceil((seconds % 3600) / 60), 59);

  return {
    hours: hours.toString(),
    minutes: minutes.toString().padStart(2, '0'),
  };
};
