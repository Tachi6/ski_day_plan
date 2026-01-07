import type { Lift, Run } from '../hooks/UseObtainData';
import { runSpeed, type RunTypes, liftSpeed, type LiftsTypes } from './speeds';

interface ObtainTimeProps {
  distance: number;
  track: Run | Lift;
}

interface Time {
  hours: string;
  minutes: string;
}

export const obtainSeconds = ({ distance, track }: ObtainTimeProps): number => {
  if (track.properties.difficulty) {
    return distance / runSpeed[track.properties.difficulty as RunTypes];
  }
  return distance / liftSpeed[track.properties.name.split(' ')[0] as LiftsTypes];
};

export const timeToHoursAndMinutes = (seconds: number): Time => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
  };
};
