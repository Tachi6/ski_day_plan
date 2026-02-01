type ResortName = 'baqueira' | 'alp2500' | 'masella' | 'molina';

interface Resort {
  name: string;
  dbName: string;
  centerLandscape: number[];
  centerPortrait: number[];
}

export const resorts: Record<ResortName, Resort> = {
  baqueira: {
    name: 'Baqueira/Beret',
    dbName: 'baqueira',
    centerLandscape: [42.699522, 0.946113],
    centerPortrait: [42.701199, 0.937167],
  },
  alp2500: {
    name: 'Alp2500',
    dbName: 'alp2500',
    centerLandscape: [43.699522, 0.956113],
    centerPortrait: [43.701199, 0.957167],
  },
  masella: {
    name: 'Masella',
    dbName: 'alp2500',
    centerLandscape: [43.699522, 0.956113],
    centerPortrait: [43.701199, 0.957167],
  },
  molina: {
    name: 'La Molina',
    dbName: 'alp2500',
    centerLandscape: [43.699522, 0.956113],
    centerPortrait: [43.701199, 0.957167],
  },
};
