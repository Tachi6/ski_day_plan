import { useContext } from 'react';
import { resorts, type Resort } from '../data/resorts';
import { SelectResortContext } from '../context/selectResort/SelectResortContext';
import { CloseIcon } from '../assets/icons/CloseIcon';
import { CurrentTrackContext } from '../context/currentTrack/CurrentTrackContext';
import { IconButton } from '../components/IconButton';
import { ViewBoxesContext } from '../context/viewBoxes/ViewBoxesContext';
import { EmptyResortContext } from '../context/emptyResort/EmptyResortContext';

export const SelectResortBox = () => {
  const { selectedResort, changeResort } = useContext(SelectResortContext);
  const { state, handleDispatch } = useContext(ViewBoxesContext);
  const { clearTrack } = useContext(CurrentTrackContext);
  const { showEmptyResort, handleEmptyResort } = useContext(EmptyResortContext);

  const handleSelectResort = (resort: Resort) => {
    clearTrack();
    changeResort(resort);
    handleDispatch({ type: 'SELECT_RESORT_BOX' });
  };

  const handleCloseButton = () => {
    if (!handleEmptyResort()) {
      handleDispatch({ type: 'SELECT_RESORT_BOX' });
    }
  };

  return (
    <div className={`box resort-box ${state.selectResortBox ? 'show' : 'hide'}`}>
      <IconButton icon={<CloseIcon />} closeClass="close-button" onClick={handleCloseButton} />
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
      <p className={`empty-resort ${showEmptyResort ? '' : 'hide'}`}>
        Debes seleccionar al menos una estación de esquí.
      </p>
    </div>
  );
};
