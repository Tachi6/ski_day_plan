import type { RunTypes } from '../map/CustomPolyline';

export const primaryTextColor = '#1F2D3D';

export const selectedColor = '#FFDD00';

export const runColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#008040'; // verde clásico
    case 'easy':
      return '#0047FF'; // azul un poco menos puro
    case 'intermediate':
      return '#E60000'; // rojo ligeramente suavizado
    case 'advanced':
      return '#1F1F1F'; // NO negro puro
    case 'expert':
      return '#1F1F1F';
    case 'freeride':
      return '#FF8A00'; // naranja un pelín más frío
    case undefined:
      return '#505050';
    default:
      return '#0047FF';
  }
};

export const borderColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#003820';
    case 'easy':
      return '#002060';
    case 'intermediate':
      return '#600000';
    case 'advanced':
      return '#3A3A3A';
    case 'expert':
      return '#3A3A3A';
    case 'freeride':
      return '#5C2E00';
    case undefined:
      return '#6B6B6B';
    default:
      return '#002060';
  }
};

export const arrowColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#4DFFB0';
    case 'easy':
      return '#8FA2FF';
    case 'intermediate':
      return '#FF9A9A';
    case 'advanced':
      return '#9A9A9A';
    case 'expert':
      return '#9A9A9A';
    case 'freeride':
      return '#FFD19A';
    case undefined:
      return '#A0A0A0';
    default:
      return '#8FA2FF';
  }
};

export const textColor = (type: RunTypes | undefined) => {
  switch (type) {
    case 'novice':
      return '#D6FFEB';
    case 'easy':
      return '#E3E8FF';
    case 'intermediate':
      return '#FFE3E3';
    case 'advanced':
      return '#E0E0E0';
    case 'expert':
      return '#E0E0E0';
    case 'freeride':
      return '#FFF0DE';
    case undefined:
      return '#E6E6E6';
    default:
      return '#E3E8FF';
  }
};
