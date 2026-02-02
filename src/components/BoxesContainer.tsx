import { useContext } from 'react';
import { SettingsBox } from './SettingsBox';
import { StatsBox } from './StatsBox';
import { TutorialBox } from './TutorialBox';
import { HideTutorialContext } from '../context/hideTutorialContext/HideTutorialContext';
import { StepsBox } from './StepsBox';
import { SelectResortBox } from './SelectResortBox';

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
