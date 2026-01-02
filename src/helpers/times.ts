interface ObtainTimeProps {
  distance: number;
  speed: number;
}

interface Time {
  hours: string;
  minutes: string;
  totalSeconds: number;
}

export const obtainTime = ({ distance, speed }: ObtainTimeProps): Time => {
  const speedMetersSeconds = speed / 3.6;
  const totalSeconds = distance / speedMetersSeconds;

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    totalSeconds,
  };
};
