import { CurrentTrackContextProvider } from './context/currentTrack/CurrentTrackProvider';
import { ViewSettingsProvider } from './context/viewSettings/ViewSettingsProvider';
import { TrackSettingsProvider } from './context/trackSettings/TrackSettingsProvider';
import { BoxesContainer } from './boxes/BoxesContainer';
import { HideTutorialProvider } from './context/hideTutorialContext/HideTutorialProvider';
import { SelectResortProvider } from './context/selectResort/SelectResortProvider';
import { ViewSelectResortProvider } from './context/viewSelectResort/ViewSelectResortProvider';
import { MapView } from './views/MapView';
import { ViewInfoProvider } from './context/viewInfo/ViewInfoProvider';

export const SkiPlanning = () => {
  return (
    <SelectResortProvider>
      <TrackSettingsProvider>
        <CurrentTrackContextProvider>
          <div className="leaflet-container">
            <MapView />
            <ViewSettingsProvider>
              <HideTutorialProvider>
                <ViewInfoProvider>
                  <ViewSelectResortProvider>
                    <BoxesContainer />
                  </ViewSelectResortProvider>
                </ViewInfoProvider>
              </HideTutorialProvider>
            </ViewSettingsProvider>
          </div>
        </CurrentTrackContextProvider>
      </TrackSettingsProvider>
    </SelectResortProvider>
  );
};
