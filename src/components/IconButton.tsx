import type { JSX } from 'react';

type CloseClass = 'close-button' | undefined;

interface Props {
  icon: JSX.Element;
  closeClass?: CloseClass;
  onClick: () => void;
}

export const IconButton = ({ icon, closeClass, onClick }: Props) => {
  return (
    <button className={`icon-button ${closeClass}`} onClick={onClick}>
      {icon}
    </button>
  );
};
