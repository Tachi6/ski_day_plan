import { InfoBox, SelectResortBox, SettingsBox, StatsBox, StepsBox, TutorialBox } from '../boxes';
import { EmptyResortProvider } from '../context/emptyResort/EmptyResortProvider';

export const BoxesContainer = () => {
  return (
    <>
      <TutorialBox />
      <EmptyResortProvider>
        <SelectResortBox />
        <StatsBox />
      </EmptyResortProvider>
      <SettingsBox />
      <StepsBox />
      <InfoBox />
    </>
  );
};
