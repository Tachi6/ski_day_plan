import { borderColor, runColor, textColor } from '../helpers/colors';
import type { Difficulty } from '../types/types';

interface Props {
  difficulty: Difficulty | undefined;
  position: number;
}

export const CirclePosition = ({ difficulty, position }: Props) => {
  return (
    <div
      className="track-step"
      style={{
        borderColor: borderColor(difficulty),
        backgroundColor: runColor(difficulty),
        color: textColor(difficulty),
      }}
    >
      {position}
    </div>
  );
};
