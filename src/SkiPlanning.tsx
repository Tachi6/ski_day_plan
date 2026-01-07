import { StatsBox } from './components/StatsBox';
import { Map } from './components/Map';
import { CurrentTrackContextProvider } from './context/currentTrack/CurrentTrackProvider';
import { SettingsBox } from './components/SettingsBox';
import { ViewSettingsProvider } from './context/viewSettings/ViewSettingsProvider';
import { TrackSettingsProvider } from './context/trackSettings/trackSettingsProvider';

export const SkiPlanning = () => {
  return (
    <CurrentTrackContextProvider>
      <div className="leaflet-container">
        <Map />
        <ViewSettingsProvider>
          <TrackSettingsProvider>
            <StatsBox />
            <SettingsBox />
          </TrackSettingsProvider>
        </ViewSettingsProvider>
      </div>
    </CurrentTrackContextProvider>
  );
};
