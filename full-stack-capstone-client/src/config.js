// Use environment variable for production, fallback to localhost for development
export const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
