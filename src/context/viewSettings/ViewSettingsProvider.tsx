import { useState, type PropsWithChildren } from 'react';
import { ViewSettingsContext } from './ViewSettingsContext';

export const ViewSettingsProvider = ({ children }: PropsWithChildren) => {
  const [viewSettings, setViewSettings] = useState(false);

  const changeVisibility = () => setViewSettings(!viewSettings);

  return (
    <ViewSettingsContext
      value={{
        view: viewSettings,
        changeVisibility: changeVisibility,
      }}
    >
      {children}
    </ViewSettingsContext>
  );
};
