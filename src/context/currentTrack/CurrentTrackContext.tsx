import { createContext } from 'react';
import type { Track } from './CurrentTrackProvider';
import type { Lift, Run } from '../../hooks/useObtainData';

interface CurrentTrackContextProps {
  currentTrack: Track;
  addRunToTrack: (track: Run | Lift) => void;
  undoLastTrack: () => void;
  clearTrack: () => void;
}

export const CurrentTrackContext = createContext({} as CurrentTrackContextProps);
