import { useReducer, type PropsWithChildren } from 'react';
import { useIsPortrait } from '../../hooks/useIsPortrait';
import { viewBoxesReducer, type ViewBoxesAction } from '../viewBoxes/ViewBoxesReducer';
import { ViewBoxesContext } from './ViewBoxesContext';

export type ViewBoxesActionType = ViewBoxesAction['type'];

export interface HandleDispatch {
  type: ViewBoxesActionType;
  hideTutorialForever?: boolean;
  hasSelectedResort?: boolean;
}

export const ViewBoxesProvider = ({ children }: PropsWithChildren) => {
  const isPortrait = useIsPortrait();

  const [state, dispatch] = useReducer(viewBoxesReducer, {
    infoBox: false,
    selectResortBox: localStorage.getItem('showTutorial') === 'false',
    settingsBox: false,
    tutorialBox: localStorage.getItem('showTutorial') === 'true' || localStorage.getItem('showTutorial') === null,
  });

  const handleDispatch = ({ type, hideTutorialForever, hasSelectedResort }: HandleDispatch) =>
    dispatch({
      type,
      payload: {
        isPortrait,
        hideTutorialForever,
        hasSelectedResort,
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
