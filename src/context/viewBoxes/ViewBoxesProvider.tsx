import { useContext, useReducer, type PropsWithChildren } from 'react';
import { useIsPortrait } from '../../hooks/useIsPortrait';
import { viewBoxesReducer, type ViewBoxesAction } from '../viewBoxes/ViewBoxesReducer';
import { ViewBoxesContext } from './ViewBoxesContext';
import { SelectResortContext } from '../selectResort/SelectResortContext';

export type ViewBoxesActionType = ViewBoxesAction['type'];

export interface HandleDispatch {
  type: ViewBoxesActionType;
  hideTutorialForever?: boolean;
}

export const ViewBoxesProvider = ({ children }: PropsWithChildren) => {
  const isPortrait = useIsPortrait();

  const { selectedResort } = useContext(SelectResortContext);

  const [state, dispatch] = useReducer(viewBoxesReducer, {
    infoBox: false,
    selectResortBox: localStorage.getItem('showTutorial') === 'false',
    settingsBox: false,
    tutorialBox: localStorage.getItem('showTutorial') === 'true' || localStorage.getItem('showTutorial') === null,
  });

  const handleDispatch = ({ type, hideTutorialForever }: HandleDispatch) =>
    dispatch({
      type,
      payload: {
        isPortrait,
        hideTutorialForever,
        hasSelectedResort: Boolean(selectedResort),
      },
    });

  return (
    <ViewBoxesContext
      value={{
        state,
        handleDispatch,
      }}
    >
      {children}
    </ViewBoxesContext>
  );
};
