import { useState } from 'react';
import { lastStep } from '../data/tutorialBoxData';

interface UseTutorialBox {
  step: number;
  display: 'flex' | 'none';
  handleNextStep: () => void;
  moveToStep: (index: number) => void;
  handleTransitionEnd: (needTutotialBox: boolean) => void;
}

export const useTutorialBox = (): UseTutorialBox => {
  const [step, setStep] = useState(0);
  const [display, setDisplay] = useState<'flex' | 'none'>('flex');

  const handleNextStep = () => {
    if (step === lastStep) {
      return;
    }
    setStep(step + 1);
  };

  const moveToStep = (index: number) => setStep(index);

  const handleTransitionEnd = (needTutotialBox: boolean) => {
    if (needTutotialBox) setDisplay('none');
  };

  return {
    step,
    display,
    handleNextStep,
    moveToStep,
    handleTransitionEnd,
  };
};
