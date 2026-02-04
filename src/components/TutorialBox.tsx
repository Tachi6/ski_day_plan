import { useState } from 'react';
import { useTutorialBox } from '../hooks/useTutorialBox';
import { lastStep, tutorialBoxData } from '../data/tutorialBoxData';
import arrow from '../assets/svg/double_arrow_right.svg';

type ButtonClass = 'primary' | 'secondary';
type ButtonLabel = 'Comenzar' | 'Siguiente';

export const TutorialBox = () => {
  const [isChecked, setIsChecked] = useState<boolean>(true);

  const { step, hide, display, handleButton, changeStep, handleTransitionEnd } = useTutorialBox();

  const buttonClass: ButtonClass = step === lastStep ? 'primary' : 'secondary';
  const buttonLabel: ButtonLabel = step === lastStep ? 'Comenzar' : 'Siguiente';

  return (
    <div className={`box tutorial-box ${hide ? 'hide' : ''}`} onTransitionEnd={handleTransitionEnd} style={{ display }}>
      <h1>Ski Day Plan</h1>
      <h2>Planifica tu jornada de esqui</h2>
      <div className="tutorial-steps-container">
        <div className="tutorial-steps" style={{ left: `calc(-${step} * var(--tutorial-box-step-width))` }}>
          {tutorialBoxData.map((data) =>
            !data.image2 ? (
              <div key={data.text} className="tutorial-step">
                <div className="tutorial-first-page">
                  <p>
                    Planifica paso a paso tu jornada de esqui para recorrer los lugares preferidos de tu estación.
                    Selecciona las pistas y remontes de tu recorrido y estimaremos el tiempo necesario para realizarlo
                    en base a tus preferencias de esqui. Selecciona tu estación de esqui preferida de nuestra base de
                    datos real. Exporta tu ruta en un fichero .gpx para utilizarlo en tu dispositivo habitual.
                  </p>
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
              onClick={() => changeStep(index)}
            ></div>
          );
        })}
      </div>
      <button className={buttonClass} onClick={() => handleButton(isChecked)}>
        {buttonLabel}
      </button>
      <div className="hide-tutorial">
        <input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
        <label>No mostrar de nuevo</label>
      </div>
    </div>
  );
};
