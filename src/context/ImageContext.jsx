import React, { createContext, useContext, useState, useEffect } from 'react';
import { useImagePreloader } from '../hooks/useImagePreloader';

const ImageContext = createContext();

export const ImageContextProvider = ({ children, imageUrls = [] }) => {
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const { isLoading, error } = useImagePreloader(imageUrls);

  useEffect(() => {
    if (!isLoading && !error) {
      setIsInitialLoad(false);
    }
  }, [isLoading, error]);

  return (
    <ImageContext.Provider value={{ isLoading, error, isInitialLoad }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImageContext = () => {
  const context = useContext(ImageContext);
  if (context === undefined) {
    throw new Error('useImageContext must be used within an ImageContextProvider');
  }
  return context;
};
