import { useEffect, useState } from 'react';
import { preloadImages } from '../utils/imageOptimization.jsx';

export const useImagePreloader = (imageUrls) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const preload = async () => {
      try {
        await preloadImages(imageUrls);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    preload();
  }, [imageUrls]);

  return { isLoading, error };
};
