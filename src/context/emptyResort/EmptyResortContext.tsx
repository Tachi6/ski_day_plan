import { createContext } from 'react';

interface EmptyResort {
  showEmptyResort: boolean;
  handleEmptyResort: () => boolean;
}

export const EmptyResortContext = createContext({} as EmptyResort);
