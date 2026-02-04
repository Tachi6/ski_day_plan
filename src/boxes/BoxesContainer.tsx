import { useContext } from 'react';
import { SettingsBox } from './SettingsBox';
import { HideTutorialContext } from '../context/hideTutorialContext/HideTutorialContext';
import { SelectResortBox } from './SelectResortBox';
import { StatsBox } from './StatsBox';
import { StepsBox } from './StepsBox';
import { TutorialBox } from './TutorialBox';

export const BoxesContainer = () => {
  const { hideTutorial } = useContext(HideTutorialContext);

  return (
    <>
      {!hideTutorial && <TutorialBox />}
      {hideTutorial && <SelectResortBox />}
      <StatsBox />
      <SettingsBox />
      <StepsBox />
    </>
  );
};
