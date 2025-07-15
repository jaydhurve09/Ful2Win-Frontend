import React from 'react';

const CACHE_NAME = 'ful2win-images-v1';

const CachedImage = ({ src, alt, className, onError, fallback, ...props }) => {
  const [imageSrc, setImageSrc] = React.useState(src);
  const [isError, setIsError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const loadImage = async () => {
      try {
        setIsLoading(true);
        
        // Check if we have a cached version
        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(src);

        if (cachedResponse) {
          const blob = await cachedResponse.blob();
          const objectUrl = URL.createObjectURL(blob);
          setImageSrc(objectUrl);
          setIsLoading(false);
          return;
        }

        // If not cached, fetch and cache the image
        const response = await fetch(src, {
          headers: {
            'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch image');

        const blob = await response.blob();
        await cache.put(src, new Response(blob, {
          headers: {
            'Cache-Control': 'public, max-age=31536000', // Cache for 1 year
          }
        }));
        
        setImageSrc(URL.createObjectURL(blob));
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading image:', error);
        setIsError(true);
        if (onError) {
          onError(error);
        }
        setIsLoading(false);
      }
    };

    loadImage();
  }, [src, onError]);

  if (isError) {
    return fallback || null;
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        {...props}
      />
    </div>
  );
};

export default CachedImage;
