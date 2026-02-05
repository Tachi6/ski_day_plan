import { createContext } from 'react';

interface ViewInfo {
  viewInfo: boolean;
  changeInfoVisibility: () => void;
}

export const ViewInfoContext = createContext({} as ViewInfo);
