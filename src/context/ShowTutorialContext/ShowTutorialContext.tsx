import { createContext } from 'react';

interface ShowTutorialContextProps {
  showTutorial: boolean;
  changeVisibility: () => void;
}

export const ShowTutorialContext = createContext({} as ShowTutorialContextProps);
