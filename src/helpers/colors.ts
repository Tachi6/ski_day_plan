import type { RunTypes } from '../components/PolylineCustom';

export const runColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#00FF00';
    case 'easy':
      return '#0000FF';
    case 'intermediate':
      return '#FF0000';
    case 'advanced':
      return '#000000';
    case 'expert':
      return '#000000';
    case 'freeride':
      return '#FF8000';
    case undefined:
      return '#808080';
    default:
      return '#0000FF';
  }
};

export const borderColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#004000';
    case 'easy':
      return '#000040';
    case 'intermediate':
      return '#400000';
    case 'advanced':
      return '#404040';
    case 'expert':
      return '#404040';
    case 'freeride':
      return '#402000';
    case undefined:
      return '#202020';
    default:
      return '#000040';
  }
};

export const arrowColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#004000';
    case 'easy':
      return '#bfbfff';
    case 'intermediate':
      return '#ffbfbf';
    case 'advanced':
      return '#bfbfbf';
    case 'expert':
      return '#bfbfbf';
    case 'freeride':
      return '#ffdfbf';
    case undefined:
      return '#202020';
    default:
      return '#bfbfff';
  }
};
