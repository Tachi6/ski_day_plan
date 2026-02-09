import { useContext, useEffect, useEffectEvent } from 'react';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';
import { obtainPausesSeconds, timeToHoursAndMinutes } from '../helpers/times';
import { TrackSettingsContext } from '../context/trackSettings/TrackSettingsContext';
import { SettingsIcon } from '../assets/icons/SettingsIcon';
import { LocationIcon } from '../assets/icons/LocationIcon';
import { RemoveIcon } from '../assets/icons/RemoveIcon';
import { UndoIcon } from '../assets/icons/UndoIcon';
import { createGPXContent, mergeTracks } from '../helpers/createGPX';
import { useDownloadGPX } from '../hooks/useDownloadGPX';
import { DownloadIcon } from '../assets/icons/DownloadIcon';
import { InfoIcon } from '../assets/icons/InfoIcon';
import { IconButton } from '../components/IconButton';
import { ViewBoxesContext } from '../context/viewBoxes/ViewBoxesContext';
import { EmptyResortContext } from '../context/emptyResort/EmptyResortContext';

export const StatsBox = () => {
  const { currentTrack, undoLastTrack, clearTrack, recalculateStats } = useContext(CurrentTrackContext);
  const { handleDispatch } = useContext(ViewBoxesContext);
  const { trackSettings } = useContext(TrackSettingsContext);
  const { handleEmptyResort } = useContext(EmptyResortContext);
  const downloadGPX = useDownloadGPX();

  const reloadStats = useEffectEvent(() => recalculateStats());

  useEffect(() => {
    reloadStats();
  }, [trackSettings]);

  const skiSeconds = currentTrack.totalTime;
  const pausesSeconds = obtainPausesSeconds(trackSettings.pauses);
  const totalSeconds = skiSeconds + pausesSeconds;

  const distanceToString = (distance: number): string => {
    return `${(distance / 1000).toFixed(1)}`;
  };

  const handleDownload = () => {
    const mergedTracks = mergeTracks(currentTrack.trackSteps);
    const fileContent = createGPXContent(mergedTracks);
    downloadGPX(fileContent);
  };

  const handleSelectResort = () => {
    if (!handleEmptyResort()) {
      handleDispatch({ type: 'SELECT_RESORT_BOX' });
    }
  };

  return (
    <div className="box stats-box">
      <div className="box-line">
        <div className="stats-box-element">
          <p>
            {distanceToString(currentTrack.downhillDistance)}
            <span>km</span>
          </p>
          <p>Distancia esqui</p>
        </div>
        <div className="stats-box-element">
          <p>
            {distanceToString(currentTrack.uphillDistance)}
            <span>km</span>
          </p>
          <p>Distancia subida</p>
        </div>
        <div className="stats-box-element">
          <p>
            {distanceToString(currentTrack.totalDistance)}
            <span>km</span>
          </p>
          <p>Distancia total</p>
        </div>
      </div>
      <div className="box-line">
        <div className="stats-box-element">
          <p>
            {currentTrack.descentElevation.toFixed(0)}
            <span>m</span>
          </p>
          <p>Descenso</p>
        </div>
        <div className="stats-box-element">
          <p>
            {currentTrack.climbElevation.toFixed(0)}
            <span>m</span>
          </p>
          <p>Ascenso</p>
        </div>
        <div className="stats-box-element">
          <p>{currentTrack.downhills}</p>
          <p>Descensos</p>
        </div>
      </div>
      <div className="box-line">
        <div className="stats-box-element">
          <p>
            {timeToHoursAndMinutes(skiSeconds).hours}
            <span>h</span>
            {timeToHoursAndMinutes(skiSeconds).minutes}
            <span>m</span>
          </p>
          <p>Tiempo esqui</p>
        </div>
        <div className="stats-box-element">
          <p>
            {timeToHoursAndMinutes(pausesSeconds).hours}
            <span>h</span>
            {timeToHoursAndMinutes(pausesSeconds).minutes}
            <span>m</span>
          </p>
          <p>Descansos</p>
        </div>
        <div className="stats-box-element">
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
        <IconButton icon={<UndoIcon />} onClick={undoLastTrack} />
        <IconButton icon={<RemoveIcon />} onClick={clearTrack} />
        <IconButton icon={<LocationIcon />} onClick={handleSelectResort} />
        <IconButton icon={<DownloadIcon />} onClick={handleDownload} />
        <IconButton icon={<SettingsIcon />} onClick={() => handleDispatch({ type: 'SETTINGS_BOX' })} />
        <IconButton icon={<InfoIcon />} onClick={() => handleDispatch({ type: 'INFO_BOX' })} />
      </div>
    </div>
  );
};
