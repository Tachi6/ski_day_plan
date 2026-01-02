import { use } from 'react';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';
import undo from '../assets/svg/undo.svg';
import remove from '../assets/svg/remove.svg';
import location from '../assets/svg/location.svg';
import settings from '../assets/svg/settings.svg';
import { ViewSettingsContext } from '../context/viewSettings/ViewSettingsContext';

export const StatsBox = () => {
  const { currentTrack, undoLastTrack, clearTrack } = use(CurrentTrackContext);
  const { changeVisibility } = use(ViewSettingsContext);

  const distanceToString = (distance: number): string => {
    return `${(distance / 1000).toFixed(1)}`;
  };

  return (
    <div className="box stats-box">
      <div className="box-line">
        <div className="box-element">
          <p>
            {distanceToString(currentTrack.downhillDistance)}
            <span>km</span>
          </p>
          <p>Distancia esqui</p>
        </div>
        <div className="box-element">
          <p>
            {distanceToString(currentTrack.uphillDistance)}
            <span>km</span>
          </p>
          <p>Distancia subida</p>
        </div>
        <div className="box-element">
          <p>
            {distanceToString(currentTrack.totalDistance)}
            <span>km</span>
          </p>
          <p>Distancia total</p>
        </div>
      </div>
      <div className="box-line">
        <div className="box-element">
          <p>
            {currentTrack.descentElevation.toFixed(0)}
            <span>m</span>
          </p>
          <p>Descenso</p>
        </div>
        <div className="box-element">
          <p>
            {currentTrack.climbElevation.toFixed(0)}
            <span>m</span>
          </p>
          <p>Ascenso</p>
        </div>
        <div className="box-element">
          <p>
            0<span>h</span>00<span>m</span>
          </p>
          <p>Tiempo</p>
        </div>
      </div>
      <div className="box-line buttons">
        <button className="stats-box-button" onClick={undoLastTrack}>
          <img src={undo} alt="settings-icon" />
        </button>
        <button className="stats-box-button" onClick={clearTrack}>
          <img src={remove} alt="settings-icon" />
        </button>
        <button className="stats-box-button">
          <img src={location} alt="settings-icon" />
        </button>
        <button className="stats-box-button" onClick={changeVisibility}>
          <img src={settings} alt="settings-icon" />
        </button>
      </div>
    </div>
  );
};
