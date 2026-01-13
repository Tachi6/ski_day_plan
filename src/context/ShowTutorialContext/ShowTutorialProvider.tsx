import { useState, type PropsWithChildren } from 'react';
import { ShowTutorialContext } from './ShowTutorialContext';

export const ShowTutorialProvider = ({ children }: PropsWithChildren) => {
  const [showTutorial, setShowTutorial] = useState(localStorage.getItem('dontShow') === 'true');

  const changeVisibility = () => {
    localStorage.setItem('dontShow', JSON.stringify(!showTutorial));
    setShowTutorial(!showTutorial);
  };
  return <ShowTutorialContext value={{ showTutorial, changeVisibility }}>{children}</ShowTutorialContext>;
};
