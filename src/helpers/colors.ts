import type { RunTypes } from '../components/PolylineCustom';

export const runColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#008040';
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
      return '#404040';
    default:
      return '#0000FF';
  }
};

export const borderColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#002010';
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
      return '#707070';
    default:
      return '#000040';
  }
};

export const arrowColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#40ff9f';
    case 'easy':
      return '#8080ff';
    case 'intermediate':
      return '#ff8080';
    case 'advanced':
      return '#808080';
    case 'expert':
      return '#808080';
    case 'freeride':
      return '#ffc080';
    case undefined:
      return '#9f9f9f';
    default:
      return '#8080ff';
  }
};

export const textColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#cdffe6';
    case 'easy':
      return '#dedeff';
    case 'intermediate':
      return '#ffdede';
    case 'advanced':
      return '#dedede';
    case 'expert':
      return '#dedede';
    case 'freeride':
      return '#ffeede';
    case undefined:
      return '#e6e6e6';
    default:
      return '#dedeff';
  }
};
