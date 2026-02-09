import { useContext, useState } from 'react';
import { useTutorialBox } from '../hooks/useTutorialBox';
import { lastStep, tutorialBoxData } from '../data/tutorialBoxData';
import arrow from '../assets/svg/double_arrow_right.svg';
import { ViewBoxesContext } from '../context/viewBoxes/ViewBoxesContext';

type ButtonClass = 'primary' | 'secondary';
type ButtonLabel = 'Comenzar' | 'Siguiente';

export const TutorialBox = () => {
  const [isChecked, setIsChecked] = useState<boolean>(true);

  const { state, handleDispatch } = useContext(ViewBoxesContext);

  const { step, display, handleNextStep, moveToStep, handleTransitionEnd } = useTutorialBox();

  const buttonClass: ButtonClass = step === lastStep ? 'primary' : 'secondary';
  const buttonLabel: ButtonLabel = step === lastStep ? 'Comenzar' : 'Siguiente';

  const handleButton = () => {
    if (step === lastStep) {
      handleDispatch({ type: 'TUTORIAL_BOX', hideTutorialForever: !isChecked });
      return;
    }
    handleNextStep();
  };

  return (
    <div
      className={`box tutorial-box ${state.tutorialBox ? '' : 'hide'}`}
      onTransitionEnd={() => handleTransitionEnd(!state.tutorialBox)}
      style={{ display }}
    >
      <h1>Ski Day Plan</h1>
      <h2>Planifica tu jornada de esqui</h2>
      <div className="tutorial-steps-container">
        <div className="tutorial-steps" style={{ left: `calc(-${step} * var(--tutorial-box-step-width))` }}>
          {tutorialBoxData.map((data) =>
            !data.image2 ? (
              <div key={data.text} className="tutorial-step">
                <div className="tutorial-first-page">
                  <p>{data.text}</p>
                  <img src={data.image1} alt={data.alt1}></img>
                </div>
              </div>
            ) : (
              <div key={data.text} className="tutorial-step">
                <p>{data.text}</p>
                <div className="tutorial-step-image">
                  <img src={data.image1} alt={data.alt1} />
                  <img src={arrow} alt="arrow" />
                  <img src={data.image2} alt={data.alt2} />
                </div>
              </div>
            ),
          )}
        </div>
      </div>
      <div className="tutorial-indicator">
        {tutorialBoxData.map((data, index) => {
          const indicatorClass: ButtonClass = index === step ? 'primary' : 'secondary';

          return (
            <div
              key={`${data.text}-${index}`}
              className={`indicator ${indicatorClass}`}
              onClick={() => moveToStep(index)}
            ></div>
          );
        })}
      </div>
      <button className={buttonClass} onClick={() => handleButton()}>
        {buttonLabel}
      </button>
      <div className="hide-tutorial">
        <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
        <label>No mostrar de nuevo</label>
      </div>
    </div>
  );
};
