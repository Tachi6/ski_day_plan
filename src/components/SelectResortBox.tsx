import { useContext } from 'react';
import { resorts, type Resort } from '../data/resorts';
import { SelectResortContext } from '../context/selectResortContext/SelectResortContext';
import { ViewSelectResortContext } from '../context/viewSelectResortContext/ViewSelectResortContext';
import { CloseIcon } from '../assets/icons/CloseIcon';

export const SelectResortBox = () => {
  const { selectedResort, changeResort } = useContext(SelectResortContext);
  const { view, emptySelection, hideSelectedResort } = useContext(ViewSelectResortContext);

  const handleSelectResort = (resort: Resort) => {
    changeResort(resort);
    hideSelectedResort(true);
  };

  return (
    <div className={`box resort-box ${view ? 'show' : 'hide'}`}>
      <button className="stats-box-button close-button" onClick={() => hideSelectedResort()}>
        <CloseIcon />
      </button>
      <h3>Selecciona estación de esquí</h3>
      <div className="box-line">
        {Object.values(resorts).map((resort: Resort) => (
          <div
            key={resort.name}
            className={`resort-button-container ${selectedResort?.name === resort.name ? 'selected' : ''}`}
          >
            <button className="resort-button" onClick={() => handleSelectResort(resort)}>
              <img src={resort.image} alt={resort.name} />
            </button>
            <p className="resort-button-text">{resort.name}</p>
          </div>
        ))}
      </div>
      <p className={`empty-resort ${emptySelection ? '' : 'hide'}`}>
        Debes seleccionar al menos una estación de esquí.
      </p>
    </div>
  );
};
