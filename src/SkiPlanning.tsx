import { Map } from './components/Map';
import { CurrentTrackContextProvider } from './context/currentTrack/CurrentTrackProvider';
import { ViewSettingsProvider } from './context/viewSettings/ViewSettingsProvider';
import { TrackSettingsProvider } from './context/trackSettings/TrackSettingsProvider';
import { BoxesContainer } from './components/BoxesContainer';
import { HideTutorialProvider } from './context/HideTutorialContext/HideTutorialProvider';

export const SkiPlanning = () => {
  return (
    <TrackSettingsProvider>
      <CurrentTrackContextProvider>
        <div className="leaflet-container">
          <Map />
          <ViewSettingsProvider>
            <HideTutorialProvider>
              <BoxesContainer />
            </HideTutorialProvider>
          </ViewSettingsProvider>
        </div>
      </CurrentTrackContextProvider>
    </TrackSettingsProvider>
  );
};
