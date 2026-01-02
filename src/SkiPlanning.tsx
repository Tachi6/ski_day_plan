import { StatsBox } from './components/StatsBox';
import { Map } from './components/Map';
import { CurrentTrackContextProvider } from './context/currentTrack/CurrentTrackProvider';
import { SettingsBox } from './components/SettingsBox';
import { ViewSettingsProvider } from './context/viewSettings/ViewSettingsProvider';

export const SkiPlanning = () => {
  return (
    <CurrentTrackContextProvider>
      <div className="leaflet-container">
        <Map />
        <ViewSettingsProvider>
          <StatsBox />
          <SettingsBox />
        </ViewSettingsProvider>
      </div>
    </CurrentTrackContextProvider>
  );
};
