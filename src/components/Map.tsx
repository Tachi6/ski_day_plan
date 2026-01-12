import 'leaflet-arrowheads';
import { MapContainer, Pane, Rectangle, TileLayer } from 'react-leaflet';
import { useIsPortrait } from '../hooks/useIsPortrait';
import { RunsAndLifts } from './RunsAndLifts';
import { CurrentTracks } from './CurrentTracks';

export const Map = () => {
  const isPortrait = useIsPortrait();

  return (
    <MapContainer
      center={isPortrait ? [42.701199, 0.937167] : [42.699522, 0.946113]}
      zoom={16}
      scrollWheelZoom={true}
      minZoom={14}
      zoomControl={false}
      className="back-layer"
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a> | &copy; OpenStreetMap contributors'
        url="https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png"
        subdomains={['a', 'b', 'c', 'd']}
        className="snow-filter"
      />
      {/* Overlays blue-snow */}
      <Pane name="snow-overlay" style={{ zIndex: 350 }}>
        <Rectangle
          bounds={[
            [-90, -180],
            [90, 180],
          ]}
          pathOptions={{ fillColor: '#EAF4FB', fillOpacity: 0.4, stroke: false, interactive: false }}
          pane="snow-overlay"
        />
        <Rectangle
          bounds={[
            [-90, -180],
            [90, 180],
          ]}
          pathOptions={{ fillColor: '#D6EAF8', fillOpacity: 0.12, stroke: false, interactive: false }}
          pane="snow-overlay"
        />
        <Rectangle
          bounds={[
            [-90, -180],
            [90, 180],
          ]}
          pathOptions={{ fillColor: '#FFFFFF', fillOpacity: 0.06, stroke: false, interactive: false }}
          pane="snow-overlay"
        />
      </Pane>
      <RunsAndLifts />
      <CurrentTracks />
    </MapContainer>
  );
};
