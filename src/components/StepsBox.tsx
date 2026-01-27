import { use, useEffect, useEffectEvent, useLayoutEffect, useState } from 'react';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';
import { CirclePosition } from './CirclePosition';

const STEPS_BOX_HEIGHT = 30;
const STEPS_BOX_GAP = 10;
const STEPS_BOX_FULL = STEPS_BOX_HEIGHT + STEPS_BOX_GAP;

export const StepsBox = () => {
  const { currentTrack } = use(CurrentTrackContext);

  const [height, setHeight] = useState(0);
  const [maxRows, setMaxRows] = useState(0);
  const [scrollStep, setScrollStep] = useState(0);

  useLayoutEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight;
      // TODO: Globalizar 270px!!!
      const innerRows = Math.floor((windowHeight - 270) / STEPS_BOX_FULL);

      setMaxRows(innerRows);
      setHeight(innerRows * STEPS_BOX_FULL);
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const handleTopPosition = useEffectEvent(() => {
    if (height >= currentTrack.trackSteps.length * STEPS_BOX_FULL) {
      return;
    }
    setScrollStep(maxRows - currentTrack.trackSteps.length);
  });

  useEffect(() => {
    handleTopPosition();
  }, [currentTrack.trackSteps.length, height, maxRows]);

  const handleMouseWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0 && scrollStep > maxRows - currentTrack.trackSteps.length) {
      setScrollStep((prev) => prev - 1);
      return;
    }
    if (e.deltaY > 0 && scrollStep < 0) {
      setScrollStep((prev) => prev + 1);
      return;
    }
  };

  return (
    <div className="steps-box-container" style={{ height: `${height}px` }}>
      <div
        className="steps-box-scroll"
        style={{ top: `${scrollStep * STEPS_BOX_FULL}px`, gap: `${STEPS_BOX_GAP}px` }}
        onWheel={handleMouseWheel}
      >
        {currentTrack.trackSteps.length > 0 &&
          currentTrack.trackSteps.map((track, index) => (
            <div key={`${track.id}-${index}`} className="steps-box" style={{ height: `${STEPS_BOX_HEIGHT}px` }}>
              <CirclePosition difficulty={track.properties.difficulty} position={index + 1} />
              <p>{track.properties.name ?? 'Conexión'}</p>
            </div>
          ))}
      </div>
    </div>
  );
};
