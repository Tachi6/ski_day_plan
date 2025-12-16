import { use } from 'react';
import { CurrentTrackContext } from '../context/currentTrackContext';

export const Box = () => {
  const { currentTrack } = use(CurrentTrackContext);

  const distanceToString = (distance: number): string => {
    return `${(distance / 1000).toFixed(1)}`;
  };

  return (
    <div className="box">
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
            {distanceToString(currentTrack.climbElevation)}
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
    </div>
  );
};
