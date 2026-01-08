import { use } from 'react';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';
import undo from '../assets/svg/undo.svg';
import remove from '../assets/svg/remove.svg';
import location from '../assets/svg/location.svg';
import settings from '../assets/svg/settings.svg';
import { ViewSettingsContext } from '../context/viewSettings/ViewSettingsContext';
import { obtainPausesSeconds, timeToHoursAndMinutes } from '../helpers/times';
import { TrackSettingsContext } from '../context/trackSettings/TrackSettingsContext';

export const StatsBox = () => {
  const { currentTrack, undoLastTrack, clearTrack } = use(CurrentTrackContext);
  const { changeVisibility } = use(ViewSettingsContext);
  const { trackSettings } = use(TrackSettingsContext);

  const skiSeconds = currentTrack.totalTime;
  const pausesSeconds = obtainPausesSeconds(trackSettings.pauses);
  const totalSeconds = skiSeconds + pausesSeconds;

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
          <p>{currentTrack.downhills}</p>
          <p>Descensos</p>
        </div>
      </div>
      <div className="box-line">
        <div className="box-element">
          <p>
            {timeToHoursAndMinutes(skiSeconds).hours}
            <span>h</span>
            {timeToHoursAndMinutes(skiSeconds).minutes}
            <span>m</span>
          </p>
          <p>Tiempo esqui</p>
        </div>
        <div className="box-element">
          <p>
            {timeToHoursAndMinutes(pausesSeconds).hours}
            <span>h</span>
            {timeToHoursAndMinutes(pausesSeconds).minutes}
            <span>m</span>
          </p>
          <p>Descansos</p>
        </div>
        <div className="box-element">
          <p>
            {timeToHoursAndMinutes(totalSeconds).hours}
            <span>h</span>
            {timeToHoursAndMinutes(totalSeconds).minutes}
            <span>m</span>
          </p>
          <p>Tiempo total</p>
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
