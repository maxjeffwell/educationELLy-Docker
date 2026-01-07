// Use environment variable for production, fallback to localhost for development
// Check for undefined (not just falsy) to allow empty string for relative URLs
const getApiUrl = () => {
  if (process.env.REACT_APP_API_URL !== undefined) {
    return process.env.REACT_APP_API_URL;
  }
  if (process.env.REACT_APP_API_BASE_URL !== undefined) {
    return process.env.REACT_APP_API_BASE_URL;
  }
  // In production (when served from the same domain), use relative URL
  if (process.env.NODE_ENV === 'production') {
    return '/api';
  }
  return 'http://localhost:8080';
};

export const API_BASE_URL = getApiUrl();
