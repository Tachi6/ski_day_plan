import { Box } from './components/Box';
import { Map } from './components/Map';
import { CurrentTrackContextProvider } from './context/CurrentTrackProvider';

export const SkiPlanning = () => {
  return (
    <CurrentTrackContextProvider>
      <div className="leaflet-container">
        <Map />
        <Box />
      </div>
    </CurrentTrackContextProvider>
  );
};
