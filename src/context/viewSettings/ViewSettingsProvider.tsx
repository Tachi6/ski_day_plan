import { useState, type PropsWithChildren } from 'react';
import { ViewSettingsContext } from './ViewSettingsContext';

export const ViewSettingsProvider = ({ children }: PropsWithChildren) => {
  const [viewSettings, setViewSettings] = useState(false);

  const changeSettingsVisibility = () => setViewSettings(!viewSettings);

  return (
    <ViewSettingsContext
      value={{
        viewSettings,
        changeSettingsVisibility,
      }}
    >
      {children}
    </ViewSettingsContext>
  );
};
