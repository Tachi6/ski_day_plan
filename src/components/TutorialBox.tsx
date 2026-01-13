import { tutorialImages } from '../helpers/images';
import arrow from '../assets/svg/double_arrow_right.svg';
import { useState } from 'react';

export const TutorialBox = () => {
  const [step, setStep] = useState(0);
  const [buttonLabel, setButtonLabel] = useState('Siguiente');
  const [opacity, setOpacity] = useState(1);
  const [display, setDisplay] = useState('flex');

  const handleButton = () => {
    if (step === -3) {
      setButtonLabel('Comenzar');
    }
    if (step === -4) {
      setOpacity(0);
      setTimeout(() => setDisplay('none'), 500);
      return;
    }
    setStep(step - 1);
  };

  return (
    <div className="box tutorial-box" style={{ opacity: opacity, display: display }}>
      <h1>Planifica tu jornada de esqui</h1>
      <div className="tutorial-steps-container">
        <div className="tutorial-steps" style={{ left: `calc(${step} * var(--tutorial-box-step-width))` }}>
          <div className="tutorial-step">
            <p>Pulsa encima del remonte o la pista por la que quieras comenzar y se añadirá a tu recorrido.</p>
            <div className="tutorial-step-image">
              <img src={tutorialImages.tut1a} alt="tut1a" />
              <img src={arrow} alt="arrow" />
              <img src={tutorialImages.tut1b} alt="tut1b" />
            </div>
          </div>
          <div className="tutorial-step">
            <p>Busca el remonte o la pista que conecte o esté cerca del final de tu recorrido y se enlazarán.</p>
            <div className="tutorial-step-image">
              <img src={tutorialImages.tut2a} alt="tut2a" />
              <img src={arrow} alt="arrow" />
              <img src={tutorialImages.tut2b} alt="tut2b" />
            </div>
          </div>
          <div className="tutorial-step">
            <p>Si la pista elegida comienza en otra, añade la otra primero, que se recortara y después la elegida.</p>
            <div className="tutorial-step-image">
              <img src={tutorialImages.tut3a} alt="tut3a" />
              <img src={arrow} alt="arrow" />
              <img src={tutorialImages.tut3b} alt="tut3b" />
            </div>
          </div>
          <div className="tutorial-step">
            <p>Si tu recorrido termina en medio de una pista, añádela y se añadirá solo el tramo necesario.</p>
            <div className="tutorial-step-image">
              <img src={tutorialImages.tut4a} alt="tut4a" />
              <img src={arrow} alt="arrow" />
              <img src={tutorialImages.tut4b} alt="tut4b" />
            </div>
          </div>
          <div className="tutorial-step">
            <p>Puedes seleccionar un remonte o pista mas de una vez, solo pulsa encima y se añadirá de nuevo.</p>
            <div className="tutorial-step-image">
              <img src={tutorialImages.tut5a} alt="tut4a" />
              <img src={arrow} alt="arrow" />
              <img src={tutorialImages.tut5b} alt="tut4b" />
            </div>
          </div>
        </div>
      </div>
      <div className="tutorial-indicator">
        {[0, -1, -2, -3, -4].map((currentStep) => (
          <div
            key={`tutorial-indicator-${currentStep}`}
            className={`indicator ${currentStep === step ? 'primary' : 'secondary'}`}
            onClick={() => setStep(currentStep)}
          ></div>
        ))}
      </div>
      <button className={`${step === -4 ? 'primary' : 'secondary'}`} onClick={handleButton}>
        {buttonLabel}
      </button>
    </div>
  );
};
