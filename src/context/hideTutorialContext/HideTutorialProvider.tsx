import { useState, type PropsWithChildren } from 'react';
import { HideTutorialContext } from './HideTutorialContext';

export const HideTutorialProvider = ({ children }: PropsWithChildren) => {
  const [hideTutorial, setHideTutorial] = useState(localStorage.getItem('hideTutorial') === 'true');

  const changeVisibility = (hide: boolean) => {
    localStorage.setItem('hideTutorial', JSON.stringify(hide));
    setHideTutorial(true);
  };

  return <HideTutorialContext value={{ hideTutorial, changeVisibility }}>{children}</HideTutorialContext>;
};
