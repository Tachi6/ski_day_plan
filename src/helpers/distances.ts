import type { LatLngTuple } from 'leaflet';

// Average radius of the Earth in kilometers
const R_METERS = 6371000;

// Convert degrees to radians
const degreesToRadians = (degrees: number): number => degrees * (Math.PI / 180);

export const distanceHaversine = (point1: LatLngTuple, point2: LatLngTuple): number => {
  // Convert to radians
  const radiuslatitudePoint1 = degreesToRadians(point1[0]);
  const radiuslatitudePoint2 = degreesToRadians(point2[0]);
  const latitudeDiference = degreesToRadians(point2[0] - point1[0]);
  const longitudeDiference = degreesToRadians(point2[1] - point1[1]);

  // Haversine Formule (part a)
  const a =
    Math.sin(latitudeDiference / 2) * Math.sin(latitudeDiference / 2) +
    Math.cos(radiuslatitudePoint1) *
      Math.cos(radiuslatitudePoint2) *
      Math.sin(longitudeDiference / 2) *
      Math.sin(longitudeDiference / 2);

  // Haversine Formule (part c)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const horitzontalDistance = R_METERS * c;
  const verticalDistance = point2[2]! - point1[2]!; // Esto puede ser positivo o negativo

  // Height correction
  const distance3D = Math.sqrt(Math.pow(horitzontalDistance, 2) + Math.pow(verticalDistance, 2));

  return distance3D;
};
export const distanceHaversine2 = (point1: LatLngTuple, point2: LatLngTuple): number => {
  // Convert to radians
  const radiuslatitudePoint1 = degreesToRadians(point1[0]);
  const radiuslatitudePoint2 = degreesToRadians(point2[0]);
  const latitudeDiference = degreesToRadians(point2[0] - point1[0]);
  const longitudeDiference = degreesToRadians(point2[1] - point1[1]);

  // Haversine Formule (part a)
  const a =
    Math.sin(latitudeDiference / 2) * Math.sin(latitudeDiference / 2) +
    Math.cos(radiuslatitudePoint1) *
      Math.cos(radiuslatitudePoint2) *
      Math.sin(longitudeDiference / 2) *
      Math.sin(longitudeDiference / 2);

  // Haversine Formule (part c)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const horitzontalDistance = R_METERS * c;

  return horitzontalDistance;
};

export const trackDistance = (track: LatLngTuple[]) => {
  let lastCoordinates: LatLngTuple;
  return track.reduce((accumulator: number, currentValue: LatLngTuple) => {
    if (lastCoordinates === undefined) {
      lastCoordinates = currentValue;
      return 0;
    }

    const distance = distanceHaversine(lastCoordinates, currentValue);

    lastCoordinates = currentValue;

    return accumulator + distance;
  }, 0);
};

type Turns = 'xSmall' | 'small' | 'medium' | 'large';

interface DistanceTurnsProps {
  distance: number;
  turns: Turns;
}

const turnsToRadius: Record<Turns, number> = {
  xSmall: 0.1,
  small: 0.2,
  medium: 0.3,
  large: 1,
};

export const distanceByTurns = ({ distance, turns }: DistanceTurnsProps) => {
  const turnDistance = turnsToRadius[turns];

  const distanceUnit = Math.PI * (turnDistance / 2);

  return distance * distanceUnit;
};
