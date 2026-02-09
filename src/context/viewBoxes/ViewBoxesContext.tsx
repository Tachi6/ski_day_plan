import { createContext } from 'react';
import type { ViewBoxesState } from './ViewBoxesReducer';
import type { HandleDispatch } from './ViewBoxesProvider';

interface ViewBoxes {
  state: ViewBoxesState;
  handleDispatch: ({ type, hideTutorialForever }: HandleDispatch) => void;
}

export const ViewBoxesContext = createContext({} as ViewBoxes);
