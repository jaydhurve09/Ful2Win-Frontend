const CACHE_NAME = 'ful2win-images-v1';
const CLOUDINARY_DOMAIN = 'res.cloudinary.com';

// Function to check if URL is from Cloudinary
const isCloudinaryUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.hostname.includes(CLOUDINARY_DOMAIN);
  } catch (error) {
    return false;
  }
};

// Function to cache an image
const cacheImage = async (cache, url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`Failed to fetch ${url}: ${response.status}`);
      return;
    }
    
    // Clone and cache the response
    const responseToCache = response.clone();
    await cache.put(url, responseToCache);
    console.log(`Cached image: ${url}`);
  } catch (error) {
    console.error(`Error caching image ${url}:`, error);
  }
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        // Cache static assets
        return Promise.all([
          '/logo.png',
          '/favicon.ico',
          '/index.html',
          '/manifest.json'
        ].map(url => {
          return fetch(url)
            .then(response => {
              if (!response.ok) {
                console.warn(`Failed to fetch ${url}: ${response.status}`);
                return null;
              }
              return cache.put(url, response);
            })
            .catch(error => {
              console.warn(`Failed to cache ${url}: ${error}`);
              return null;
            });
        }));
      })
      .catch((error) => {
        console.error('Error installing service worker:', error);
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method === 'GET' && event.request.headers.get('accept')?.includes('image/')) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }
          
          // Only cache images from Cloudinary
          if (isCloudinaryUrl(event.request.url)) {
            return fetch(event.request)
              .then((response) => {
                if (!response.ok) {
                  return response;
                }
                
                // Cache the image
                caches.open(CACHE_NAME)
                  .then(cache => {
                    cacheImage(cache, event.request.url);
                    return response;
                  })
                  .catch(error => {
                    console.error('Error opening cache:', error);
                    return response;
                  });
              })
              .catch(error => {
                console.error('Error fetching image:', error);
                return response;
              });
          }
          
          return fetch(event.request);
        })
    );
  }
});
