import { catmullRom } from 'catmull-rom';
import type { LatLngTuple } from 'leaflet';

export const parseCoordinates = (coordinates: LatLngTuple[]): LatLngTuple[] => {
  return coordinates.map((coordinate) => [coordinate[1], coordinate[0], coordinate[2]]);
};

export const curvedPolylines = (positions: LatLngTuple[]) => {
  const curvedPoints = catmullRom(parseCoordinates(positions), {
    samples: 8,
    parametrization: 'centripetal',
    dimension: 3,
    includeOriginal: true,
    endpointMode: 'duplicate',
  });

  return curvedPoints.points;
};
