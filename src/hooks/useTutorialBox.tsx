import { useContext, useState } from 'react';
import { HideTutorialContext } from '../context/hideTutorialContext/HideTutorialContext';
import { lastStep } from '../data/tutorialBoxData';

interface UseTutorialBox {
  step: number;
  hide: boolean;
  display: 'flex' | 'none';
  handleButton: (isChecked: boolean) => void;
  changeStep: (index: number) => void;
  handleTransitionEnd: () => void;
}

export const useTutorialBox = (): UseTutorialBox => {
  const [step, setStep] = useState(0);
  const [hide, setHide] = useState(false);
  const [display, setDisplay] = useState<'flex' | 'none'>('flex');
  const { changeVisibility } = useContext(HideTutorialContext);

  const handleButton = (isChecked: boolean) => {
    if (step === lastStep) {
      setHide(true);
      changeVisibility(isChecked);

      return;
    }
    setStep(step + 1);
  };

  const changeStep = (index: number) => setStep(index);

  const handleTransitionEnd = () => {
    if (hide) setDisplay('none');
  };

  return {
    step,
    hide,
    display,
    handleButton,
    changeStep,
    handleTransitionEnd,
  };
};
