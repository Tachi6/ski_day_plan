import type { LatLngTuple } from 'leaflet';
import type { Turn } from '../context/trackSettings/TrackSettingsContext';
import type { RunTypes } from '../components/PolylineCustom';

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

const distanceToIncrement: Record<Turn, Record<RunTypes, number>> = {
  xsmall: {
    novice: 10,
    easy: 14,
    intermediate: 18,
    advanced: 22,
    expert: 22,
    freeride: 25,
  },
  small: {
    novice: 7,
    easy: 10,
    intermediate: 13,
    advanced: 16,
    expert: 16,
    freeride: 18,
  },
  medium: {
    novice: 4,
    easy: 6,
    intermediate: 8,
    advanced: 11,
    expert: 11,
    freeride: 13,
  },
  large: {
    novice: 2,
    easy: 3,
    intermediate: 5,
    advanced: 7,
    expert: 7,
    freeride: 9,
  },
};

interface TrackDistanceProps {
  track: LatLngTuple[];
  turn: Turn;
  runType?: RunTypes;
}

export const trackDistance = ({ track, turn, runType }: TrackDistanceProps) => {
  let lastCoordinates: LatLngTuple;
  const straightDistance = track.reduce((accumulator: number, currentValue: LatLngTuple) => {
    if (lastCoordinates === undefined) {
      lastCoordinates = currentValue;
      return 0;
    }

    const distance = distanceHaversine(lastCoordinates, currentValue);

    lastCoordinates = currentValue;

    return accumulator + distance;
  }, 0);

  if (runType) {
    return straightDistance + straightDistance * (distanceToIncrement[turn][runType] / 100);
  }
  return straightDistance;
};
