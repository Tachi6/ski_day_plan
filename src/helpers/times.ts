interface ObtainTimeProps {
  distance: number;
  speedMS: number;
}

interface Time {
  hours: string;
  minutes: string;
}

export const parseKmHToMS = (speedKmH: number) => speedKmH / 3.6;

export const obtainSeconds = ({ distance, speedMS }: ObtainTimeProps): number => distance / speedMS;

export const timeToHoursAndMinutes = (seconds: number): Time => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
  };
};
