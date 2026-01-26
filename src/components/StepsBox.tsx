import { use } from 'react';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';
import { CirclePosition } from './CirclePosition';

export const StepsBox = () => {
  const { currentTrack } = use(CurrentTrackContext);
  return (
    <div className="steps-box-container">
      {currentTrack.trackSteps.length > 0 &&
        currentTrack.trackSteps.map((track, index) => (
          <div key={track.id} className="steps-box">
            <CirclePosition difficulty={track.properties.difficulty} position={index + 1} />
            <p>{track.properties.name ?? 'Conexión'}</p>
          </div>
        ))}
    </div>
  );
};
