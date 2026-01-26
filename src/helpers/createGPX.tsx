import type { LatLngTuple } from 'leaflet';
import type { Run, Lift } from '../hooks/useObtainData';

export const mergeTracks = (tracksteps: (Run | Lift)[]): LatLngTuple[] =>
  tracksteps.reduce<LatLngTuple[]>((acc, curr) => {
    const [lat1, lon1] = curr.geometry.coordinates[0];
    const [lat2, lon2] = acc.at(-1) ?? [];

    if (lat1 === lat2 && lon1 === lon2) {
      return [...acc, ...curr.geometry.coordinates.slice(1)];
    }
    return [...acc, ...curr.geometry.coordinates];
  }, []);

export const createGPXContent = (track: LatLngTuple[]) => {
  const gpxContent = `
  <?xml version="1.0" encoding="UTF-8"?>
  <gpx version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
    <trk>
      <trkseg>
        ${track.map((point) => `
          <trkpt lat="${point[0]}" lon="${point[1]}">
            <ele>${point[2]}</ele>
          </trkpt>`,
        ).join('')}
      </trkseg>
    </trk>
  </gpx>`.trim();

  return gpxContent;
};
