import { createContext } from 'react';

interface ViewSettings {
  viewSettings: boolean;
  changeSettingsVisibility: () => void;
}

export const ViewSettingsContext = createContext({} as ViewSettings);
