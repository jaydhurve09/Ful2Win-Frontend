import { useState, useCallback } from 'react';

const CACHE_NAME = 'ful2win-images-v1';

const useImageCache = () => {
  const [cachedImages, setCachedImages] = useState(new Set());

  const cacheImage = useCallback(async (imageUrl) => {
    try {
      // Check if image is already cached
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(imageUrl);
      
      if (cachedResponse) {
        return;
      }

      // Fetch and cache the image
      const response = await fetch(imageUrl, {
        headers: {
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();
      await cache.put(imageUrl, new Response(blob, {
        headers: {
          'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
        }
      }));

      // Update cached images state
      setCachedImages(prev => {
        const newSet = new Set(prev);
        newSet.add(imageUrl);
        return newSet;
      });

    } catch (error) {
      console.error('Error caching image:', error);
      throw error;
    }
  }, []);

  const isImageCached = useCallback(async (imageUrl) => {
    try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(imageUrl);
      return !!cachedResponse;
    } catch (error) {
      console.error('Error checking cache:', error);
      return false;
    }
  }, []);

  const clearImageCache = useCallback(async () => {
    try {
      const cache = await caches.open(CACHE_NAME);
      await cache.keys().then(keys => 
        Promise.all(keys.map(key => cache.delete(key))));
      setCachedImages(new Set());
    } catch (error) {
      console.error('Error clearing image cache:', error);
    }
  }, []);

  return {
    cacheImage,
    isImageCached,
    clearImageCache,
    cachedImages,
  };
};

export default useImageCache;
