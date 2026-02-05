import { useState, type PropsWithChildren } from 'react';
import { SelectResortContext } from './SelectResortContext';
import { type Resort } from '../../data/resorts';

export const SelectResortProvider = ({ children }: PropsWithChildren) => {
  const [selectedResort, setSelectedResort] = useState<Resort | null>(null);

  const changeResort = (resort: Resort) => setSelectedResort(resort);

  return <SelectResortContext value={{ selectedResort, changeResort }}>{children}</SelectResortContext>;
};
