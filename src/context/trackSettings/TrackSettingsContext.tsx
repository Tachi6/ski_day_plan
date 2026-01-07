import { createContext } from 'react';

type Turn = 'xsmall' | 'small' | 'medium' | 'large';
type Speed = 'xlow' | 'low' | 'medium' | 'high';
type Stops = 'none' | 'some' | 'few' | 'many';
type Pause = 'breakfast' | 'coffee' | 'lunch' | 'coke';

export interface TrackSettingsState {
  turn: Turn;
  speed: Speed;
  stops: Stops;
  pauses: Pause[];
}

export interface ChangeSettingsProps {
  turn?: Turn;
  speed?: Speed;
  stops?: Stops;
  pauses?: Pause[];
}

interface TrackSettingsContextProps {
  trackSettings: TrackSettingsState;
  changeSettings: (setting: ChangeSettingsProps) => void;
}

export const TrackSettingsContext = createContext({} as TrackSettingsContextProps);
