/**
 * Get a safe profile picture URL with fallback
 * @param {string} url - The profile picture URL
 * @param {string} defaultImage - Default image to use if URL is invalid
 * @returns {string} Safe URL to use for the image source
 */
export const getSafeProfilePicture = (url, defaultImage) => {
  if (!url) return defaultImage;
  
  // If it's a blob URL, check if it's still valid
  if (url.startsWith('blob:')) {
    try {
      // Create a URL object to validate the blob URL
      new URL(url);
      return url; // If we get here, it's a valid URL
    } catch (e) {
      console.log('Invalid blob URL, using default image');
      return defaultImage;
    }
  }
  
  // For non-blob URLs, check if it's a valid HTTP/HTTPS URL
  try {
    const parsedUrl = new URL(url);
    if (['http:', 'https:'].includes(parsedUrl.protocol)) {
      return url;
    }
    return defaultImage;
  } catch (e) {
    return defaultImage;
  }
};

/**
 * Revoke a blob URL if it's a blob URL
 * @param {string} url - The URL to potentially revoke
 */
export const revokeBlobUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn('Failed to revoke blob URL:', e);
    }
  }
};
