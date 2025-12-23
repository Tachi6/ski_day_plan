import { StatsBox } from './components/StatsBox';
import { Map } from './components/Map';
import { CurrentTrackContextProvider } from './context/currentTrack/CurrentTrackProvider';
import { SettingsBox } from './components/SettingsBox';

export const SkiPlanning = () => {
  return (
    <CurrentTrackContextProvider>
      <div className="leaflet-container">
        <Map />
        <StatsBox />
        {/* <SettingsBox /> */}
      </div>
    </CurrentTrackContextProvider>
  );
};
