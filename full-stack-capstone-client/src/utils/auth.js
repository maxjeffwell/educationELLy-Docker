import axios from 'axios';
import { API_BASE_URL } from '../config';

// Configure axios to send cookies with all requests
axios.defaults.withCredentials = true;

// Track authentication state in memory (since we can't read httpOnly cookies)
let isUserAuthenticated = false;
let currentUser = null;

class AuthService {
  constructor() {
    this.setupInterceptors();
    // Check auth status on initialization
    this.checkAuthStatus();
  }

  setupInterceptors() {
    // Response interceptor to handle token expiration and auto-refresh
    axios.interceptors.response.use(
      response => response,
      async error => {
        const originalRequest = error.config;

        // Don't retry refresh endpoint itself to avoid infinite loop
        const isRefreshRequest = originalRequest.url?.includes('/refresh');

        // If 401, not a refresh request, and haven't already retried, attempt token refresh
        if (
          error.response?.status === 401 &&
          !isRefreshRequest &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true;

          try {
            // Try to refresh the access token using the refresh token cookie
            await axios.post(`${API_BASE_URL}/refresh`);
            // Retry the original request (cookies will be sent automatically)
            return axios(originalRequest);
          } catch (refreshError) {
            // Refresh failed - user needs to log in again
            this.handleAuthFailure();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Check authentication status by calling the whoami endpoint
   * This is needed because we can't read httpOnly cookies
   */
  async checkAuthStatus() {
    try {
      const response = await axios.get(`${API_BASE_URL}/whoami`);
      isUserAuthenticated = true;
      currentUser = response.data;
      return { authenticated: true, user: currentUser };
    } catch (error) {
      isUserAuthenticated = false;
      currentUser = null;
      return { authenticated: false, user: null };
    }
  }

  /**
   * Handle successful authentication
   */
  handleAuthSuccess(user) {
    isUserAuthenticated = true;
    currentUser = user;
  }

  /**
   * Handle authentication failure (logout, token expiration, etc.)
   */
  handleAuthFailure() {
    isUserAuthenticated = false;
    currentUser = null;
    // Clean up any legacy localStorage tokens
    this.clearLegacyTokens();
  }

  /**
   * Check if user is authenticated (based on in-memory state)
   * Note: This is a synchronous check; use checkAuthStatus() for server verification
   */
  isAuthenticated() {
    return isUserAuthenticated;
  }

  /**
   * Get current user info
   */
  getCurrentUser() {
    return currentUser;
  }

  /**
   * Sign out - calls server to invalidate tokens and clear cookies
   */
  async signout() {
    try {
      await axios.post(`${API_BASE_URL}/signout`);
    } catch (error) {
      console.error('Signout error:', error);
    } finally {
      this.handleAuthFailure();
    }
  }

  /**
   * Sign out from all devices
   */
  async signoutAll() {
    try {
      await axios.post(`${API_BASE_URL}/signout-all`);
    } catch (error) {
      console.error('Signout all error:', error);
    } finally {
      this.handleAuthFailure();
    }
  }

  /**
   * Clear any legacy tokens from localStorage/sessionStorage
   * (migration from old auth system)
   */
  clearLegacyTokens() {
    const TOKEN_KEY = 'jwtToken';
    const REFRESH_TOKEN_KEY = 'refreshToken';

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }

  /**
   * Migrate from old token-based auth to cookie-based auth
   * Call this once on app initialization
   */
  migrateLegacyAuth() {
    // Clear any old tokens - the server will handle auth via cookies now
    this.clearLegacyTokens();
  }

  // Deprecated methods - kept for backward compatibility
  // These will log warnings in development

  setTokens() {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'AuthService.setTokens() is deprecated. Tokens are now managed via httpOnly cookies.'
      );
    }
  }

  setToken() {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'AuthService.setToken() is deprecated. Tokens are now managed via httpOnly cookies.'
      );
    }
  }

  getToken() {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'AuthService.getToken() is deprecated. Tokens are now managed via httpOnly cookies.'
      );
    }
    return null;
  }

  getRefreshToken() {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        'AuthService.getRefreshToken() is deprecated. Tokens are now managed via httpOnly cookies.'
      );
    }
    return null;
  }

  clearTokens() {
    this.clearLegacyTokens();
  }

  getCSRFToken() {
    // Get CSRF token from meta tag or cookie (if implemented)
    const metaTag = document.querySelector('meta[name="csrf-token"]');
    if (metaTag) {
      return metaTag.getAttribute('content');
    }
    return null;
  }
}

const authService = new AuthService();

export default authService;
