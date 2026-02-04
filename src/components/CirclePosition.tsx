import { borderColor, runColor, textColor } from '../helpers/colors';
import type { RunTypes } from '../map/CustomPolyline';

interface Props {
  difficulty: string | undefined;
  position: number;
}

export const CirclePosition = ({ difficulty, position }: Props) => {
  return (
    <div
      className="track-step"
      style={{
        borderColor: borderColor(difficulty as RunTypes),
        backgroundColor: runColor(difficulty as RunTypes),
        color: textColor(difficulty as RunTypes),
      }}
    >
      {position}
    </div>
  );
};
