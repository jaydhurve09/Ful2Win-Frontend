/**
 * Validates and processes a profile picture URL
 * @param {string} url - The URL to validate
 * @returns {string} Processed URL or empty string if invalid
 */
export const processProfilePicture = (url) => {
  if (!url) return '';
  
  // If it's a blob URL, return it as-is (we'll validate it when used)
  if (url.startsWith('blob:')) {
    return url;
  }
  
  // If it's a data URL, return it as-is
  if (url.startsWith('data:')) {
    return url;
  }
  
  // If it's a relative path, make it absolute using the API URL
  if (url.startsWith('/')) {
    const apiUrl = process.env.REACT_APP_API_URL || 'https://api.fulboost.fun';
    return `${apiUrl}${url}`;
  }
  
  // If it's not a blob or data URL, ensure it's a valid HTTP/HTTPS URL
  try {
    const parsedUrl = new URL(url);
    if (['http:', 'https:'].includes(parsedUrl.protocol)) {
      return url;
    }
    return '';
  } catch (e) {
    // If it's not a valid URL but contains a path, try to make it absolute
    if (url && !url.match(/^[a-zA-Z]+:/)) {
      const apiUrl = process.env.REACT_APP_API_URL || 'https://api.fulboost.fun';
      return `${apiUrl}/${url.startsWith('/') ? url.substring(1) : url}`;
    }
    return '';
  }
};

/**
 * Gets a safe profile picture URL with fallback
 * @param {string} url - The profile picture URL
 * @param {string} defaultImage - Default image to use if URL is invalid
 * @returns {string} Safe URL to use for the image source
 */
export const getSafeProfilePicture = (url, defaultImage = '') => {
  const processedUrl = processProfilePicture(url);
  
  // If we have a valid URL, return it with a cache-busting parameter
  if (processedUrl) {
    const separator = processedUrl.includes('?') ? '&' : '?';
    return `${processedUrl}${separator}t=${Date.now()}`;
  }
  
  return defaultImage;
};

/**
 * Checks if a blob URL is still valid
 * @param {string} url - The blob URL to check
 * @returns {Promise<boolean>} Whether the blob URL is still valid
 */
export const isBlobUrlValid = (url) => {
  return new Promise((resolve) => {
    if (!url || !url.startsWith('blob:')) {
      resolve(false);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      resolve(true);
    };
    
    img.onerror = () => {
      resolve(false);
    };
    
    // Set a timeout to prevent hanging
    const timeout = setTimeout(() => {
      img.onload = null;
      img.onerror = null;
      resolve(false);
    }, 2000);
    
    // Clean up after load/error
    const cleanup = () => {
      clearTimeout(timeout);
      img.onload = null;
      img.onerror = null;
    };
    
    img.onload = () => {
      cleanup();
      resolve(true);
    };
    
    img.onerror = () => {
      cleanup();
      resolve(false);
    };
    
    img.src = url;
  });
};
