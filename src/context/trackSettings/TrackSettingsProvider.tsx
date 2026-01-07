import { useState, type PropsWithChildren } from 'react';
import { TrackSettingsContext, type ChangeSettingsProps, type TrackSettingsState } from './TrackSettingsContext';

const trackSettingsInitialState: TrackSettingsState = {
  turn: 'small',
  speed: 'low',
  stops: 'few',
  pauses: ['lunch', 'coke'],
};

export const TrackSettingsProvider = ({ children }: PropsWithChildren) => {
  const [trackSettings, setTrackSettings] = useState(trackSettingsInitialState);

  const changeSettings = (settings: ChangeSettingsProps) =>
    setTrackSettings({
      turn: settings.turn ?? trackSettings.turn,
      speed: settings.speed ?? trackSettings.speed,
      stops: settings.stops ?? trackSettings.stops,
      pauses: settings.pauses ?? trackSettings.pauses,
    });

  return (
    <TrackSettingsContext
      value={{
        trackSettings,
        changeSettings,
      }}
    >
      {children}
    </TrackSettingsContext>
  );
};
