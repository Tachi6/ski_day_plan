import xsmall from '../assets/images/xsmall.png';
import small from '../assets/images/small.png';
import large from '../assets/images/large.png';
import medium from '../assets/images/medium.png';
import xlow from '../assets/images/ski-green.png';
import low from '../assets/images/ski-blue.png';
import mid from '../assets/images/ski-red.png';
import high from '../assets/images/ski-black.png';
import none from '../assets/images/0-stops.png';
import few from '../assets/images/1-stops.png';
import some from '../assets/images/2-stops.png';
import many from '../assets/images/3-stops.png';
import coffee from '../assets/images/coffee.png';
import coke from '../assets/images/coke.png';
import dinner from '../assets/images/dinner.png';
import breakfast from '../assets/images/breakfast.png';
import { Fragment, use } from 'react';
import { ViewSettingsContext } from '../context/viewSettings/ViewSettingsContext';
import {
  TrackSettingsContext,
  type Speed,
  type Turn,
  type Stops,
  type Pauses,
  type TrackSettingsState,
} from '../context/trackSettings/TrackSettingsContext';

interface ButtonLine {
  id: keyof TrackSettingsState;
  label: string;
  options: [Turn | Speed | Stops | Pauses, string, string][];
}
const settingsButtons: ButtonLine[] = [
  {
    id: 'turn',
    label: 'Giro preferido',
    options: [
      ['xsmall', xsmall, 'Muy Corto'],
      ['small', small, 'Corto'],
      ['medium', medium, 'Medio'],
      ['large', large, 'Largo'],
    ],
  },
  {
    id: 'speed',
    label: 'Velocidad habitual',
    options: [
      ['xlow', xlow, 'Muy baja'],
      ['low', low, 'Baja'],
      ['mid', mid, 'Media'],
      ['high', high, 'Alta'],
    ],
  },
  {
    id: 'stops',
    label: 'Paradas en pista',
    options: [
      ['none', none, 'Ninguna'],
      ['few', few, 'Pocas'],
      ['some', some, 'Varias'],
      ['many', many, 'Muchas'],
    ],
  },
  {
    id: 'pauses',
    label: 'Descansos y comidas',
    options: [
      ['breakfast', breakfast, 'Desayuno'],
      ['coffee', coffee, 'Cafe'],
      ['dinner', dinner, 'Comida'],
      ['coke', coke, 'Refresco'],
    ],
  },
];

export const SettingsBox = () => {
  const { view } = use(ViewSettingsContext);
  const { trackSettings, changeSettings } = use(TrackSettingsContext);

  return (
    <div className={`box settings-box ${view ? 'show' : 'hide'}`}>
      {settingsButtons.map((buttonLine) => (
        <Fragment key={buttonLine.id + buttonLine.label}>
          <h3>{buttonLine.label}</h3>
          <div className="box-line">
            {buttonLine.options.map((option) => {
              const isSelected =
                buttonLine.id === 'pauses'
                  ? trackSettings[buttonLine.id].includes(option[0] as Pauses)
                  : trackSettings[buttonLine.id] === option[0];

              return (
                <button
                  key={buttonLine.label + option[0]}
                  id={buttonLine.label + option[0]}
                  className={`box-button ${isSelected ? 'selected' : ''}`}
                  onClick={() =>
                    changeSettings({
                      [buttonLine.id]: buttonLine.id === 'pauses' ? [option[0]] : option[0],
                    })
                  }
                >
                  <img className="turn-image" src={option[1]} alt={`${buttonLine.id}-${option[0]}`} />
                  <p className="settings-button-text">{option[2]}</p>
                </button>
              );
            })}
          </div>
        </Fragment>
      ))}
    </div>
  );
};
