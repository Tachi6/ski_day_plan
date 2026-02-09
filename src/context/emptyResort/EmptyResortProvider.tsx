import { useContext, useState, type PropsWithChildren } from 'react';
import { EmptyResortContext } from './EmptyResortContext';
import { SelectResortContext } from '../selectResort/SelectResortContext';

export const EmptyResortProvider = ({ children }: PropsWithChildren) => {
  const [showEmptyResort, setShowEmptyResort] = useState(false);

  const { selectedResort } = useContext(SelectResortContext);

  const handleEmptyResort = () => {
    setShowEmptyResort(Boolean(!selectedResort));

    return Boolean(!selectedResort);
  };

  return (
    <EmptyResortContext
      value={{
        showEmptyResort,
        handleEmptyResort,
      }}
    >
      {children}
    </EmptyResortContext>
  );
};
