import baqueira from '../assets/images/baqueira.png';
import alp2500 from '../assets/images/alp2500.png';
import masella from '../assets/images/masella.png';
import molina from '../assets/images/molina.png';
import type { LatLngExpression } from 'leaflet';

export const defaultCenter: LatLngExpression = [41.786389, 1.096389];

type ResortName = 'baqueira' | 'alp2500' | 'masella' | 'molina';

export interface Resort {
  name: string;
  dbName: string;
  centerLandscape: LatLngExpression;
  centerPortrait: LatLngExpression;
  specialFilter?: (tagName: string) => void;
  image: string;
}

export const resorts: Record<ResortName, Resort> = {
  baqueira: {
    name: 'Baqueira/Beret',
    dbName: 'baqueira',
    centerLandscape: [42.699522, 0.946113],
    centerPortrait: [42.701199, 0.937167],
    image: baqueira,
  },
  alp2500: {
    name: 'Alp2500',
    dbName: 'alp2500',
    centerLandscape: [42.331421899999995, 1.9124601999999993],
    // TODO:
    centerPortrait: [43.701199, 0.957167],
    image: alp2500,
  },
  masella: {
    name: 'Masella',
    dbName: 'masella',
    centerLandscape: [42.3495221, 1.9005201999999992],
    // TODO:
    centerPortrait: [43.701199, 0.957167],
    specialFilter: (tagName: string) => tagName,
    image: masella,
  },
  molina: {
    name: 'La Molina',
    dbName: 'alp2500',
    centerLandscape: [42.3349779, 1.9373790999999994],
    // TODO:
    centerPortrait: [43.701199, 0.957167],
    specialFilter: (tagName: string) => tagName,
    image: molina,
  },
};
