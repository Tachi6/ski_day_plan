import { CurrentTrackContextProvider } from './context/currentTrack/CurrentTrackProvider';
import { TrackSettingsProvider } from './context/trackSettings/TrackSettingsProvider';
import { BoxesContainer } from './boxes/BoxesContainer';
import { SelectResortProvider } from './context/selectResort/SelectResortProvider';
import { MapView } from './views/MapView';
import { ViewBoxesProvider } from './context/viewBoxes/ViewBoxesProvider';

export const SkiPlanning = () => {
  return (
    <SelectResortProvider>
      <TrackSettingsProvider>
        <CurrentTrackContextProvider>
          <div className="leaflet-container">
            <MapView />
            <ViewBoxesProvider>
              <BoxesContainer />
            </ViewBoxesProvider>
          </div>
        </CurrentTrackContextProvider>
      </TrackSettingsProvider>
    </SelectResortProvider>
  );
};
