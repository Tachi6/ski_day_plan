import { use, useEffect, useEffectEvent, useLayoutEffect, useState } from 'react';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';
import { CirclePosition } from '../components/CirclePosition';
import { useCSSVariable } from '../hooks/useCSSVariable';

export const StepsBox = () => {
  const { currentTrack } = use(CurrentTrackContext);

  const [height, setHeight] = useState(0);
  const [maxRows, setMaxRows] = useState(0);
  const [scrollStep, setScrollStep] = useState(0);

  const stepsBoxHeight = Number(useCSSVariable('--steps-box-height').replace('px', ''));
  const stepsBoxGap = Number(useCSSVariable('--steps-box-gap').replace('px', ''));
  const stepsBoxUnit = stepsBoxHeight + stepsBoxGap;

  useLayoutEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight;
      // TODO: Globalizar 270px!!!
      const innerRows = Math.floor((windowHeight - 270) / stepsBoxUnit);

      setMaxRows(innerRows);
      setHeight(innerRows * stepsBoxUnit);
    };

    updateHeight();

    window.addEventListener('resize', updateHeight);

    return () => window.removeEventListener('resize', updateHeight);
  }, [stepsBoxUnit]);

  const handleTopPosition = useEffectEvent(() => {
    if (height >= currentTrack.trackSteps.length * stepsBoxUnit) {
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
        style={{ top: `${scrollStep * stepsBoxUnit}px` }}
        onWheel={handleMouseWheel}
      >
        {currentTrack.trackSteps.length > 0 &&
          currentTrack.trackSteps.map((track, index) => {
            const trackName = track.name && track.name.length > 0 ? track.name : 'Conexión';

            return (
              <div key={`${track.id}-${index}-steps`} className="animation-wrapper">
                <div className="steps-box">
                  <CirclePosition difficulty={track.difficulty} position={index + 1} />
                  <p>{trackName}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
