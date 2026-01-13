import type { RunTypes } from '../components/CustomPolyline';

export const primaryTextColor = '#1F2D3D';

export const selectedColor = '#FFEA33';

// export const runColor = (type: RunTypes | undefined) => {
//   switch (type) {
//     case 'novice':
//       return '#008040';
//     case 'easy':
//       return '#0000FF';
//     case 'intermediate':
//       return '#FF0000';
//     case 'advanced':
//       return '#000000';
//     case 'expert':
//       return '#000000';
//     case 'freeride':
//       return '#FF8000';
//     case undefined:
//       return '#404040';
//     default:
//       return '#0000FF';
//   }
// };

// export const borderColor = (type: RunTypes | undefined) => {
//   switch (type) {
//     case 'novice':
//       return '#002010';
//     case 'easy':
//       return '#000040';
//     case 'intermediate':
//       return '#400000';
//     case 'advanced':
//       return '#404040';
//     case 'expert':
//       return '#404040';
//     case 'freeride':
//       return '#402000';
//     case undefined:
//       return '#707070';
//     default:
//       return '#000040';
//   }
// };

// export const arrowColor = (type: RunTypes | undefined) => {
//   switch (type) {
//     case 'novice':
//       return '#40ff9f';
//     case 'easy':
//       return '#8080ff';
//     case 'intermediate':
//       return '#ff8080';
//     case 'advanced':
//       return '#808080';
//     case 'expert':
//       return '#808080';
//     case 'freeride':
//       return '#ffc080';
//     case undefined:
//       return '#9f9f9f';
//     default:
//       return '#8080ff';
//   }
// };

// export const textColor = (type: RunTypes | undefined) => {
//   switch (type) {
//     case 'novice':
//       return '#cdffe6';
//     case 'easy':
//       return '#dedeff';
//     case 'intermediate':
//       return '#ffdede';
//     case 'advanced':
//       return '#dedede';
//     case 'expert':
//       return '#dedede';
//     case 'freeride':
//       return '#ffeede';
//     case undefined:
//       return '#e6e6e6';
//     default:
//       return '#dedeff';
//   }
// };

export const runColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#009860'; // verde original + un toque frío
    case 'easy':
      return '#0055FF'; // azul más profundo pero vivo
    case 'intermediate':
      return '#FF3333'; // rojo vivo + ligeramente frío
    case 'advanced':
      return '#1F2933'; // grafito frío
    case 'expert':
      return '#1F2933'; // igual que advanced
    case 'freeride':
      return '#FF8800'; // naranja más integrado
    case undefined:
      return '#505050'; // gris neutral
    default:
      return '#0055FF';
  }
};

export const borderColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#006040'; // verde oscuro
    case 'easy':
      return '#000080'; // azul oscuro
    case 'intermediate':
      return '#800000'; // rojo oscuro
    case 'advanced':
      return '#404040'; // gris oscuro
    case 'expert':
      return '#404040'; // gris oscuro
    case 'freeride':
      return '#804000'; // naranja oscuro
    case undefined:
      return '#707070'; // gris neutral
    default:
      return '#000080';
  }
};

export const arrowColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#40FFA0'; // verde claro
    case 'easy':
      return '#8080FF'; // azul claro
    case 'intermediate':
      return '#FF8080'; // rojo claro
    case 'advanced':
      return '#9CA3AF'; // gris claro
    case 'expert':
      return '#9CA3AF'; // gris claro
    case 'freeride':
      return '#FFC080'; // naranja claro
    case undefined:
      return '#9F9F9F'; // gris neutral
    default:
      return '#8080FF';
  }
};

export const textColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#D4FFE8'; // verde muy claro
    case 'easy':
      return '#DEE5FF'; // azul muy claro
    case 'intermediate':
      return '#FFDADA'; // rojo muy claro
    case 'advanced':
      return '#E0E0E0'; // gris claro
    case 'expert':
      return '#E0E0E0'; // gris claro
    case 'freeride':
      return '#FFE7CC'; // naranja muy claro
    case undefined:
      return '#E5E5E5'; // gris neutral
    default:
      return '#DEE5FF';
  }
};
