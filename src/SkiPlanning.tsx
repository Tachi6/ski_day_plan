import { StatsBox } from './components/StatsBox';
import { Map } from './components/Map';
import { CurrentTrackContextProvider } from './context/currentTrack/CurrentTrackProvider';
import { SettingsBox } from './components/SettingsBox';
import { ViewSettingsProvider } from './context/viewSettings/ViewSettingsProvider';
import { TrackSettingsProvider } from './context/trackSettings/TrackSettingsProvider';

export const SkiPlanning = () => {
  return (
    <TrackSettingsProvider>
      <CurrentTrackContextProvider>
        <div className="leaflet-container">
          <Map />
          <ViewSettingsProvider>
            <StatsBox />
            <SettingsBox />
          </ViewSettingsProvider>
        </div>
      </CurrentTrackContextProvider>
    </TrackSettingsProvider>
  );
};
