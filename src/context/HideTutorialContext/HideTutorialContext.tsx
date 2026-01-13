import { createContext } from 'react';

interface HideTutorialContextProps {
  hideTutorial: boolean;
  changeVisibility: (hide: boolean) => void;
}

export const HideTutorialContext = createContext({} as HideTutorialContextProps);
