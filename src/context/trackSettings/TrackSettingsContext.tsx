import { createContext } from 'react';

export type Turn = 'xsmall' | 'small' | 'medium' | 'large';
export type Speed = 'xlow' | 'low' | 'mid' | 'high';
export type Stops = 'none' | 'some' | 'few' | 'many';
export type Pauses = 'breakfast' | 'coffee' | 'dinner' | 'coke';

export interface TrackSettingsState {
  turn: Turn;
  speed: Speed;
  stops: Stops;
  pauses: Pauses[];
}

export interface ChangeSettingsProps {
  turn?: Turn;
  speed?: Speed;
  stops?: Stops;
  pauses?: Pauses[];
}

interface TrackSettingsContextProps {
  trackSettings: TrackSettingsState;
  changeSettings: (setting: ChangeSettingsProps) => void;
}

export const TrackSettingsContext = createContext({} as TrackSettingsContextProps);
