import { useCallback } from 'react';

export const useDownloadGPX = () => {
  const downloadGPX = useCallback((fileContent: string) => {
    const blob = new Blob([fileContent], { type: 'application/gpx+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'ski-track.gpx';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  return downloadGPX;
};
