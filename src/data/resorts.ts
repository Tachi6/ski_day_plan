import baqueira from '../assets/images/baqueira.png';
import alp2500 from '../assets/images/alp2500.png';
import masella from '../assets/images/masella.png';
import molina from '../assets/images/molina.png';
import boitaull from '../assets/images/boitaull.png';
import espot from '../assets/images/espot.png';
import portaine from '../assets/images/portaine.png';
import portdelcomte from '../assets/images/portdelcomte.png';
import tavascan from '../assets/images/tavascan.png';
import valldenuria from '../assets/images/valldenuria.png';
import vallter2000 from '../assets/images/vallter2000.png';
import sellaronda from '../assets/images/sellaronda.png';
import type { LatLngExpression } from 'leaflet';

export const defaultCenter: LatLngExpression = [41.786389, 1.096389];

type ResortName =
  | 'alp2500'
  | 'baqueira'
  | 'boitaull'
  | 'espot'
  | 'masella'
  | 'molina'
  | 'portaine'
  | 'portdelcomte'
  | 'tavascan'
  | 'valldenuria'
  | 'vallter2000'
  | 'sellaronda';

export interface Resort {
  name: string;
  dbName: string;
  centerLandscape: LatLngExpression;
  centerPortrait: LatLngExpression;
  specialFilter?: string;
  image: string;
}

export const resorts: Record<ResortName, Resort> = {
  alp2500: {
    name: 'Alp2500',
    dbName: 'alp2500',
    centerLandscape: [42.331421899999995, 1.9124601999999993],
    // TODO:
    centerPortrait: [42.331421899999995, 1.9124601999999993],
    image: alp2500,
  },
  baqueira: {
    name: 'Baqueira/Beret',
    dbName: 'baqueira',
    centerLandscape: [42.699522, 0.946113],
    centerPortrait: [42.701199, 0.937167],
    image: baqueira,
  },
  boitaull: {
    name: 'Boí Taüll',
    dbName: 'boitaull',
    centerLandscape: [42.4782032, 0.8704658000000003],
    // TODO:
    centerPortrait: [42.4782032, 0.8704658000000003],
    image: boitaull,
  },
  espot: {
    name: 'Espot',
    dbName: 'espot',
    centerLandscape: [42.5636134, 1.0938145999999993],
    // TODO:
    centerPortrait: [42.5636134, 1.0938145999999993],
    image: espot,
  },
  masella: {
    name: 'Masella',
    dbName: 'alp2500',
    centerLandscape: [42.3495221, 1.9005201999999992],
    // TODO:
    centerPortrait: [42.3495221, 1.9005201999999992],
    specialFilter: 'Masella',
    image: masella,
  },
  molina: {
    name: 'La Molina',
    dbName: 'alp2500',
    centerLandscape: [42.3349779, 1.9373790999999994],
    // TODO:
    centerPortrait: [42.3349779, 1.9373790999999994],
    specialFilter: 'Molina',
    image: molina,
  },
  portaine: {
    name: 'Port Ainé',
    dbName: 'portaine',
    centerLandscape: [42.42841820000003, 1.2138406999999993],
    // TODO:
    centerPortrait: [42.42841820000003, 1.2138406999999993],
    image: portaine,
  },
  portdelcomte: {
    name: 'Port del Comte',
    dbName: 'portdelcomte',
    centerLandscape: [42.172285, 1.5612702999999994],
    // TODO:
    centerPortrait: [42.172285, 1.5612702999999994],
    image: portdelcomte,
  },
  tavascan: {
    name: 'Tavascan',
    dbName: 'tavascan',
    centerLandscape: [42.6778398, 1.2193353999999994],
    // TODO:
    centerPortrait: [42.6778398, 1.2193353999999994],
    image: tavascan,
  },
  valldenuria: {
    name: 'Vall de Núria',
    dbName: 'valldenuria',
    centerLandscape: [42.397583499999996, 2.1550727],
    // TODO:
    centerPortrait: [42.397583499999996, 2.1550727],
    image: valldenuria,
  },
  vallter2000: {
    name: 'Vallter 2000',
    dbName: 'vallter2000',
    centerLandscape: [42.426464499999994, 2.2635059],
    // TODO:
    centerPortrait: [42.426464499999994, 2.2635059],
    image: vallter2000,
  },
  sellaronda: {
    name: 'Sella Ronda',
    dbName: 'sellaronda',
    centerLandscape: [46.510082499999996, 11.757369699999998],
    // TODO:
    centerPortrait: [46.510082499999996, 11.757369699999998],
    image: sellaronda,
  },
};
