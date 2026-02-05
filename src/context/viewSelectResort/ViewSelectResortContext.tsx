import { createContext } from 'react';

interface ViewSelectResort {
  view: boolean;
  emptySelection: boolean;
  showSelectedResort: () => void;
  hideSelectedResort: (forzeClose?: boolean) => void;
}

export const ViewSelectResortContext = createContext({} as ViewSelectResort);
