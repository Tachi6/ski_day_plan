declare module 'catmull-rom' {
  export function catmullRom(
    points: LatLngTuple,
    options?: {
      samples?: number;
      parametrization?: 'uniform' | 'chordal' | 'centripetal';
      dimension?: number;
      endpointMode?: 'duplicate' | 'extrapolate';
      includeOriginal?: boolean;
    },
  ): LatLngTuple;
}
