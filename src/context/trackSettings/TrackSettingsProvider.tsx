import { useState, type PropsWithChildren } from 'react';
import { TrackSettingsContext, type ChangeSettingsProps, type TrackSettingsState } from './TrackSettingsContext';

const trackSettingsInitialState: TrackSettingsState = {
  turn: 'small',
  speed: 'low',
  stops: 'few',
  pauses: ['dinner', 'coke'],
};

export const TrackSettingsProvider = ({ children }: PropsWithChildren) => {
  const [trackSettings, setTrackSettings] = useState(trackSettingsInitialState);

  const changeSettings = (settings: ChangeSettingsProps) =>
    setTrackSettings({
      turn: settings.turn ?? trackSettings.turn,
      speed: settings.speed ?? trackSettings.speed,
      stops: settings.stops ?? trackSettings.stops,
      // TODO: refactor pauses???
      pauses: settings.pauses
        ? trackSettings.pauses.includes(settings.pauses[0])
          ? trackSettings.pauses.filter((pause) => pause !== settings.pauses![0])
          : [...trackSettings.pauses, ...settings.pauses]
        : trackSettings.pauses,
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
