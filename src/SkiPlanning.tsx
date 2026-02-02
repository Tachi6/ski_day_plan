import { Map } from './components/Map';
import { CurrentTrackContextProvider } from './context/currentTrack/CurrentTrackProvider';
import { ViewSettingsProvider } from './context/viewSettings/ViewSettingsProvider';
import { TrackSettingsProvider } from './context/trackSettings/TrackSettingsProvider';
import { BoxesContainer } from './components/BoxesContainer';
import { HideTutorialProvider } from './context/hideTutorialContext/HideTutorialProvider';
import { SelectResortProvider } from './context/selectResortContext/SelectResortProvider';
import { ViewSelectResortProvider } from './context/viewSelectResortContext/ViewSelectResortProvider';

export const SkiPlanning = () => {
  return (
    <SelectResortProvider>
      <TrackSettingsProvider>
        <CurrentTrackContextProvider>
          <div className="leaflet-container">
            <Map />
            <ViewSettingsProvider>
              <HideTutorialProvider>
                <ViewSelectResortProvider>
                  <BoxesContainer />
                </ViewSelectResortProvider>
              </HideTutorialProvider>
            </ViewSettingsProvider>
          </div>
        </CurrentTrackContextProvider>
      </TrackSettingsProvider>
    </SelectResortProvider>
  );
};
