// Use environment variable for production, fallback to localhost for development
// Check for undefined (not just falsy) to allow empty string for relative URLs
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL !== undefined
    ? process.env.REACT_APP_API_BASE_URL
    : 'http://localhost:8080';
