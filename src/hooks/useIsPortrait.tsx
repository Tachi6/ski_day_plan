import { useEffect, useState } from 'react';

export const useIsPortrait = () => {
  const [isPortrait, setIsPortrait] = useState(window.matchMedia('(orientation: portrait)').matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(orientation: portrait)');
    const handleChange = () => setIsPortrait(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isPortrait;
};
