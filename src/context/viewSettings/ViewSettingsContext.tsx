import { createContext } from 'react';

interface ViewSettingsContextProps {
  view: boolean;
  changeVisibility: () => void;
}

export const ViewSettingsContext = createContext({} as ViewSettingsContextProps);
