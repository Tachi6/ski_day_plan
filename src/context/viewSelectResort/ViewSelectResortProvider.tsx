import { useContext, useState, type PropsWithChildren } from 'react';
import { ViewSelectResortContext } from './ViewSelectResortContext';
import { SelectResortContext } from '../selectResort/SelectResortContext';

export const ViewSelectResortProvider = ({ children }: PropsWithChildren) => {
  const [viewSelectedResort, setViewSelectedResort] = useState(true);
  const [emptySelection, setEmptySelection] = useState(false);

  const { selectedResort } = useContext(SelectResortContext);

  const showSelectedResort = () => setViewSelectedResort(true);

  const hideSelectedResort = (forzeClose?: boolean) => {
    if (selectedResort || forzeClose) {
      setViewSelectedResort(false);
      setEmptySelection(false);
    } else {
      setEmptySelection(true);
    }
  };

  return (
    <ViewSelectResortContext
      value={{
        view: viewSelectedResort,
        emptySelection,
        showSelectedResort,
        hideSelectedResort,
      }}
    >
      {children}
    </ViewSelectResortContext>
  );
};
