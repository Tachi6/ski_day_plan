import { borderColor, runColor, textColor } from '../helpers/colors';
import type { Difficulty } from '../types/types';

interface Props {
  difficulty: string | undefined;
  position: number;
}

export const CirclePosition = ({ difficulty, position }: Props) => {
  return (
    <div
      className="track-step"
      style={{
        borderColor: borderColor(difficulty as Difficulty),
        backgroundColor: runColor(difficulty as Difficulty),
        color: textColor(difficulty as Difficulty),
      }}
    >
      {position}
    </div>
  );
};
