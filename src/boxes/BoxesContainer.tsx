import { useContext } from 'react';
import { HideTutorialContext } from '../context/hideTutorialContext/HideTutorialContext';
import { InfoBox, SelectResortBox, SettingsBox, StatsBox, StepsBox, TutorialBox } from '../boxes';

export const BoxesContainer = () => {
  const { hideTutorial } = useContext(HideTutorialContext);

  return (
    <>
      {!hideTutorial && <TutorialBox />}
      {hideTutorial && <SelectResortBox />}
      <StatsBox />
      <SettingsBox />
      <StepsBox />
      <InfoBox />
    </>
  );
};
