import { useEffect, useState } from 'react';

export const preloadImages = async (imageUrls) => {
  const promises = imageUrls.map(url => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Cache the image in localStorage
        localStorage.setItem(`image:${url}`, 'cached');
        resolve();
      };
      img.onerror = reject;
      img.src = url;
    });
  });
  
  try {
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error preloading images:', error);
    return false;
  }
};

export const useImageCache = () => {
  const [cachedImages, setCachedImages] = useState(() => {
    const initialCache = {};
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('image:')) {
        initialCache[key.replace('image:', '')] = true;
      }
    });
    return initialCache;
  });

  const isCached = (url) => {
    return cachedImages[url] || false;
  };

  const addToCache = (url) => {
    setCachedImages(prev => ({
      ...prev,
      [url]: true
    }));
  };

  return { isCached, addToCache };
};

export const ProgressiveImage = ({ src, placeholder, className, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <img
        src={placeholder}
        alt={alt}
        className={`absolute inset-0 w-full h-full object-cover ${loaded ? 'opacity-0' : 'opacity-100'}`}
      />
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
};

export const LazyImage = ({ src, className, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
      />
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
};
