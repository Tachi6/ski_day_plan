import { Map } from './components/Map';
import { CurrentTrackContextProvider } from './context/currentTrack/CurrentTrackProvider';
import { ViewSettingsProvider } from './context/viewSettings/ViewSettingsProvider';
import { TrackSettingsProvider } from './context/trackSettings/TrackSettingsProvider';
import { ShowTutorialProvider } from './context/ShowTutorialContext/ShowTutorialProvider';
import { BoxesContainer } from './components/BoxesContainer';

export const SkiPlanning = () => {
  return (
    <TrackSettingsProvider>
      <CurrentTrackContextProvider>
        <div className="leaflet-container">
          <Map />
          <ViewSettingsProvider>
            <ShowTutorialProvider>
              <BoxesContainer />
            </ShowTutorialProvider>
          </ViewSettingsProvider>
        </div>
      </CurrentTrackContextProvider>
    </TrackSettingsProvider>
  );
};
