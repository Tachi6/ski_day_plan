import { useState, type PropsWithChildren } from 'react';
import { ViewInfoContext } from './ViewInfoContext';

export const ViewInfoProvider = ({ children }: PropsWithChildren) => {
  const [viewInfo, setViewInfo] = useState(false);

  const changeInfoVisibility = () => setViewInfo(!viewInfo);

  return (
    <ViewInfoContext
      value={{
        viewInfo,
        changeInfoVisibility,
      }}
    >
      {children}
    </ViewInfoContext>
  );
};
