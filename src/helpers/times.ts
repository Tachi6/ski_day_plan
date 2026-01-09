import type { RunTypes } from '../components/PolylineCustom';
import type { Pauses, Speed, Stops } from '../context/trackSettings/TrackSettingsContext';
import type { Lift, Run } from '../hooks/useObtainData';
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

interface Waiting {
  wait: number;
  prepare: number;
}

const liftsWaitingTime: Record<LiftsTypes, Waiting> = {
  TSD: {
    wait: 120,
    prepare: 30,
  },
  TS: {
    wait: 180,
    prepare: 45,
  },
  TQ: {
    wait: 40,
    prepare: 5,
  },
  TCD: {
    wait: 90,
    prepare: 60,
  },
  CT: {
    wait: 60,
    prepare: 20,
  },
  TC: {
    wait: 240,
    prepare: 90,
  },
  TPV: {
    wait: 600,
    prepare: 120,
  },
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
  const liftType = track.properties.name.split(' ')[0] as LiftsTypes;
  const liftSeconds = track.properties.duration ?? distance / liftSpeed[liftType];

  return liftSeconds + liftsWaitingTime[liftType].wait + liftsWaitingTime[liftType].prepare;
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
