import type { LatLngTuple } from 'leaflet';
import { createContext } from 'react';
import type { Track } from './CurrentTrackProvider';

interface CurrentTrackContextProps {
  currentTrack: Track;
  addRunToTrack: (newTrack: LatLngTuple[]) => void;
}

export const CurrentTrackContext = createContext({} as CurrentTrackContextProps);
