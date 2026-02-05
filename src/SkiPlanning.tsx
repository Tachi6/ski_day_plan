import { CurrentTrackContextProvider } from './context/currentTrack/CurrentTrackProvider';
import { ViewSettingsProvider } from './context/viewSettings/ViewSettingsProvider';
import { TrackSettingsProvider } from './context/trackSettings/TrackSettingsProvider';
import { BoxesContainer } from './boxes/BoxesContainer';
import { HideTutorialProvider } from './context/hideTutorialContext/HideTutorialProvider';
import { SelectResortProvider } from './context/selectResortContext/SelectResortProvider';
import { ViewSelectResortProvider } from './context/viewSelectResortContext/ViewSelectResortProvider';
import { MapView } from './views/MapView';

export const SkiPlanning = () => {
  return (
    <SelectResortProvider>
      <TrackSettingsProvider>
        <CurrentTrackContextProvider>
          <div className="leaflet-container">
            <MapView />
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
