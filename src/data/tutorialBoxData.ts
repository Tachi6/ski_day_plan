import tut1a from '../assets/images/tut_1a.png';
import tut1b from '../assets/images/tut_1b.png';
import tut2a from '../assets/images/tut_2a.png';
import tut2b from '../assets/images/tut_2b.png';
import tut3a from '../assets/images/tut_3a.png';
import tut3b from '../assets/images/tut_3b.png';
import tut4a from '../assets/images/tut_4a.png';
import tut4b from '../assets/images/tut_4b.png';
import tut5a from '../assets/images/tut_5a.png';
import tut5b from '../assets/images/tut_5b.png';

interface TutorialBoxData {
  text: string;
  image1: string;
  image2: string;
  alt1: string;
  alt2: string;
}

export const tutorialBoxData: TutorialBoxData[] = [
  {
    text: 'Pulsa encima del remonte o la pista por la que quieras comenzar y se añadirá a tu recorrido.',
    image1: tut1a,
    image2: tut1b,
    alt1: 'tut1a',
    alt2: 'tut1b',
  },
  {
    text: 'Busca el remonte o la pista que conecte o esté cerca del final de tu recorrido y se enlazarán.',
    image1: tut2a,
    image2: tut2b,
    alt1: 'tut2a',
    alt2: 'tut2b',
  },
  {
    text: 'Si la pista elegida comienza en otra, añade la otra primero, que se recortara y después la elegid',
    image1: tut3a,
    image2: tut3b,
    alt1: 'tut3a',
    alt2: 'tut3b',
  },
  {
    text: 'Si tu recorrido termina en medio de una pista, añádela y se añadirá solo el tramo necesario.',
    image1: tut4a,
    image2: tut4b,
    alt1: 'tut4a',
    alt2: 'tut4b',
  },
  {
    text: 'Puedes seleccionar un remonte o pista mas de una vez, solo pulsa encima y se añadirá de nuevo.',
    image1: tut5a,
    image2: tut5b,
    alt1: 'tut5a',
    alt2: 'tut5b',
  },
];

export const lastStep = tutorialBoxData.length - 1;
