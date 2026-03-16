import type { LatLngTuple } from 'leaflet';
import type { Turn } from '../context/trackSettings/TrackSettingsContext';
import type { Difficulty } from '../types/types';

const distanceToIncrement: Record<Turn, Record<Difficulty, number>> = {
  xsmall: {
    novice: 1.1,
    easy: 1.14,
    intermediate: 1.18,
    advanced: 1.22,
    expert: 1.22,
    extreme: 1.25,
    freeride: 1.25,
  },
  small: {
    novice: 1.07,
    easy: 1.1,
    intermediate: 1.13,
    advanced: 1.16,
    expert: 1.16,
    extreme: 1.18,
    freeride: 1.18,
  },
  medium: {
    novice: 1.04,
    easy: 1.06,
    intermediate: 1.08,
    advanced: 1.11,
    expert: 1.11,
    extreme: 1.13,
    freeride: 1.13,
  },
  large: {
    novice: 1.02,
    easy: 1.03,
    intermediate: 1.05,
    advanced: 1.07,
    expert: 1.07,
    extreme: 1.09,
    freeride: 1.09,
  },
};

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

export const obtainStraightDistance = (coordinates: LatLngTuple[]) => {
  const result = coordinates.reduce((acc, curr, i) => {
    if (i === 0) return acc;

    const distance = distanceHaversine(coordinates[i - 1], curr);

    return acc + distance;
  }, 0);

  return Math.round(result);
};

export const obtainRunDistance = (coordinates: LatLngTuple[]) => {
  const straightDistance = distanceHaversine(coordinates[0], coordinates.at(-1)!);
  const pointsDistance = obtainStraightDistance(coordinates);

  // Validate distance if points are near
  if (straightDistance < 10) {
    return Math.round(pointsDistance * 1.02);
  }

  const sinuosity = pointsDistance / straightDistance;

  return Math.round(pointsDistance * Math.min(1.1, 1 + sinuosity * 0.02));
};

interface ObtainSkiDistance {
  distance: number;
  turn: Turn;
  runType?: Difficulty;
}

export const obtainSkiDistance = ({ distance, turn, runType }: ObtainSkiDistance): number => {
  if (runType) {
    return Math.round(distance * distanceToIncrement[turn][runType]);
  }
  return distance;
};
