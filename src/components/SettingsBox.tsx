import large from '../assets/images/large.png';
import medium from '../assets/images/medium.png';
import small from '../assets/images/small.png';
import xsmall from '../assets/images/xsmall.png';
import skiGreen from '../assets/images/ski-green.png';
import skiBlue from '../assets/images/ski-blue.png';
import skiRed from '../assets/images/ski-red.png';
import skiBlack from '../assets/images/ski-black.png';
import coffee from '../assets/images/coffee.png';
import coke from '../assets/images/coke.png';
import dinner from '../assets/images/dinner.png';
import breakfast from '../assets/images/breakfast.png';
import none from '../assets/images/0-stops.png';
import some from '../assets/images/1-stops.png';
import few from '../assets/images/2-stops.png';
import many from '../assets/images/3-stops.png';
import { use } from 'react';
import { ViewSettingsContext } from '../context/viewSettings/ViewSettingsContext';

export const SettingsBox = () => {
  // const distanceToString = (distance: number): string => {
  //   return `${(distance / 1000).toFixed(1)}`;
  // };
  const { view } = use(ViewSettingsContext);

  return (
    <div className={`box settings-box ${view ? 'show' : 'hide'}`}>
      <h3>Giro preferido</h3>
      <div className="box-line">
        <button className="box-button">
          <img className="turn-image" src={xsmall} alt="turn-xsmall" />
          <p className="settings-button-text">Muy corto</p>
        </button>
        <button className="box-button selected">
          <img className="turn-image" src={small} alt="turn-small" />
          <p className="settings-button-text">Corto</p>
        </button>
        <button className="box-button">
          <img className="turn-image" src={medium} alt="turn-medium" />
          <p className="settings-button-text">Medio</p>
        </button>
        <button className="box-button">
          <img className="turn-image" src={large} alt="turn-large" />
          <p className="settings-button-text">Largo</p>
        </button>
      </div>
      <h3>Velocidad habitual</h3>
      <div className="box-line">
        <button className="box-button">
          <img className="speed-image" src={skiGreen} alt="speed-xlow" />
          <p className="settings-button-text">Muy baja</p>
        </button>
        <button className="box-button selected">
          <img className="speed-image" src={skiBlue} alt="speed-low" />
          <p className="settings-button-text">Baja</p>
        </button>
        <button className="box-button">
          <img className="speed-image" src={skiRed} alt="speed-mid" />
          <p className="settings-button-text">Media</p>
        </button>
        <button className="box-button">
          <img className="speed-image" src={skiBlack} alt="speed-high" />
          <p className="settings-button-text">Alta</p>
        </button>
      </div>
      <h3>Paradas en pista</h3>
      <div className="box-line">
        <button className="box-button">
          <img className="speed-image" src={none} alt="0-stops" />
          <p className="settings-button-text">Ninguna</p>
        </button>
        <button className="box-button selected">
          <img className="speed-image" src={some} alt="1-stops" />
          <p className="settings-button-text">Pocas</p>
        </button>
        <button className="box-button">
          <img className="speed-image" src={few} alt="2-stops" />
          <p className="settings-button-text">Varias</p>
        </button>
        <button className="box-button">
          <img className="speed-image" src={many} alt="3-stops" />
          <p className="settings-button-text">Muchas</p>
        </button>
      </div>
      <h3>Descansos y comidas</h3>
      <div className="box-line">
        <button className="box-button">
          <img className="speed-image" src={breakfast} alt="speed-xlow" />
          <p className="settings-button-text">Desayuno</p>
        </button>
        <button className="box-button">
          <img className="speed-image" src={coffee} alt="speed-low" />
          <p className="settings-button-text">Cafe</p>
        </button>
        <button className="box-button selected">
          <img className="speed-image" src={dinner} alt="speed-mid" />
          <p className="settings-button-text">Comida</p>
        </button>
        <button className="box-button selected">
          <img className="speed-image" src={coke} alt="speed-high" />
          <p className="settings-button-text">Refresco</p>
        </button>
      </div>
    </div>
  );
};
