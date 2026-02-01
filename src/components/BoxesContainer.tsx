import { use } from 'react';
import { SettingsBox } from './SettingsBox';
import { StatsBox } from './StatsBox';
import { TutorialBox } from './TutorialBox';
import { HideTutorialContext } from '../context/HideTutorialContext/HideTutorialContext';
import { StepsBox } from './StepsBox';

export const BoxesContainer = () => {
  const { hideTutorial } = use(HideTutorialContext);

  return (
    <>
      {!hideTutorial && <TutorialBox />}
      <StatsBox />
      <SettingsBox />
      <StepsBox />
    </>
  );
};
