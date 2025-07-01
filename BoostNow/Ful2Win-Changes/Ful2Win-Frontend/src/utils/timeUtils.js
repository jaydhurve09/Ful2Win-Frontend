/**
 * Formats a date into a relative time string (e.g., "5s ago", "10m ago", "1h ago", "2d ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const targetDate = new Date(date);
  const seconds = Math.floor((now - targetDate) / 1000);
  
  // Less than a minute
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  // Less than an hour
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `${minutes}m`;
  }
  
  // Less than a day
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  
  // Less than a month
  const days = Math.floor(hours / 24);
  if (days < 30) {
    return `${days}d`;
  }
  
  // Less than a year
  const months = Math.floor(days / 30);
  if (months < 12) {
    return `${months}mo`;
  }
  
  // Years
  const years = Math.floor(months / 12);
  return `${years}y`;
};

/**
 * Formats a date into a relative time string with "ago" (e.g., "5s ago", "10m ago")
 * @param {string|Date} date - The date to format
 * @returns {string} Formatted relative time string with "ago"
 */
export const formatTimeAgo = (date) => {
  const relativeTime = formatRelativeTime(date);
  return relativeTime ? `${relativeTime} ago` : '';
};
