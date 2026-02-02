import { createContext } from 'react';
import type { Resort } from '../../data/resorts';

interface SelectResort {
  selectedResort: Resort | null;
  changeResort: (resort: Resort) => void;
}

export const SelectResortContext = createContext({} as SelectResort);
