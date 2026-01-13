import { use } from 'react';
import { SettingsBox } from './SettingsBox';
import { StatsBox } from './StatsBox';
import { TutorialBox } from './TutorialBox';
import { ShowTutorialContext } from '../context/ShowTutorialContext/ShowTutorialContext';

export const BoxesContainer = () => {
  const { showTutorial } = use(ShowTutorialContext);
  return (
    <>
      {showTutorial && <TutorialBox />}
      <StatsBox />
      <SettingsBox />
    </>
  );
};
