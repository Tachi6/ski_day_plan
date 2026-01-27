import { useState, useEffect, useEffectEvent } from 'react';

export const useCSSVariable = (name: string) => {
  const [value, setValue] = useState('');

  const handleValue = useEffectEvent((data: string) => setValue(data));

  useEffect(() => {
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const data = style.getPropertyValue(name).trim();

    handleValue(data);
  }, [name]);

  return value;
};
