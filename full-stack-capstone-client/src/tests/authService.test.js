import axios from 'axios';

// Import after mocks are set up
import authService from '../utils/auth';

// Unmock auth service from setupTests.js - we want to test the real implementation
jest.unmock('../utils/auth');

// Mock axios before importing authService
jest.mock('axios', () => ({
  defaults: { withCredentials: true },
  interceptors: {
    response: {
      use: jest.fn(),
    },
  },
  get: jest.fn(),
  post: jest.fn(),
}));

// Mock config
jest.mock('../config', () => ({
  API_BASE_URL: 'http://localhost:8080',
}));

describe('AuthService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset auth state between tests
    authService.handleAuthFailure();
  });

  describe('isAuthenticated', () => {
    it('Should return false initially after reset', () => {
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('Should return true after handleAuthSuccess', () => {
      authService.handleAuthSuccess({ email: 'test@test.com' });
      expect(authService.isAuthenticated()).toBe(true);
    });
  });

  describe('getCurrentUser', () => {
    it('Should return null initially', () => {
      expect(authService.getCurrentUser()).toBe(null);
    });

    it('Should return user after handleAuthSuccess', () => {
      const user = { email: 'test@test.com', name: 'Test User' };
      authService.handleAuthSuccess(user);
      expect(authService.getCurrentUser()).toEqual(user);
    });
  });

  describe('handleAuthSuccess', () => {
    it('Should set authenticated state and user', () => {
      const user = { email: 'test@test.com', name: 'Test User' };
      authService.handleAuthSuccess(user);

      expect(authService.isAuthenticated()).toBe(true);
      expect(authService.getCurrentUser()).toEqual(user);
    });
  });

  describe('handleAuthFailure', () => {
    it('Should clear authenticated state and user', () => {
      // First set authenticated
      authService.handleAuthSuccess({ email: 'test@test.com' });
      expect(authService.isAuthenticated()).toBe(true);

      // Then handle failure
      authService.handleAuthFailure();

      expect(authService.isAuthenticated()).toBe(false);
      expect(authService.getCurrentUser()).toBe(null);
    });
  });

  describe('checkAuthStatus', () => {
    it('Should return authenticated true when whoami succeeds', async () => {
      const mockUser = { email: 'test@test.com', name: 'Test' };
      axios.get.mockResolvedValueOnce({ data: mockUser });

      const result = await authService.checkAuthStatus();

      expect(axios.get).toHaveBeenCalledWith('http://localhost:8080/whoami');
      expect(result).toEqual({ authenticated: true, user: mockUser });
      expect(authService.isAuthenticated()).toBe(true);
    });

    it('Should return authenticated false when whoami fails', async () => {
      axios.get.mockRejectedValueOnce(new Error('Unauthorized'));

      const result = await authService.checkAuthStatus();

      expect(result).toEqual({ authenticated: false, user: null });
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('signout', () => {
    it('Should call signout endpoint and clear auth state', async () => {
      axios.post.mockResolvedValueOnce({});
      authService.handleAuthSuccess({ email: 'test@test.com' });

      await authService.signout();

      expect(axios.post).toHaveBeenCalledWith('http://localhost:8080/signout');
      expect(authService.isAuthenticated()).toBe(false);
    });

    it('Should clear auth state even if signout request fails', async () => {
      axios.post.mockRejectedValueOnce(new Error('Network error'));
      authService.handleAuthSuccess({ email: 'test@test.com' });

      await authService.signout();

      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('signoutAll', () => {
    it('Should call signout-all endpoint', async () => {
      axios.post.mockResolvedValueOnce({});

      await authService.signoutAll();

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/signout-all'
      );
      expect(authService.isAuthenticated()).toBe(false);
    });
  });

  describe('clearLegacyTokens', () => {
    it('Should remove tokens from localStorage and sessionStorage', () => {
      // Set some tokens
      localStorage.setItem('jwtToken', 'test-token');
      localStorage.setItem('refreshToken', 'test-refresh');
      sessionStorage.setItem('jwtToken', 'test-token');
      sessionStorage.setItem('refreshToken', 'test-refresh');

      authService.clearLegacyTokens();

      expect(localStorage.getItem('jwtToken')).toBe(null);
      expect(localStorage.getItem('refreshToken')).toBe(null);
      expect(sessionStorage.getItem('jwtToken')).toBe(null);
      expect(sessionStorage.getItem('refreshToken')).toBe(null);
    });
  });

  describe('deprecated methods', () => {
    it('getToken should return null', () => {
      expect(authService.getToken()).toBe(null);
    });

    it('getRefreshToken should return null', () => {
      expect(authService.getRefreshToken()).toBe(null);
    });

    it('clearTokens should call clearLegacyTokens', () => {
      localStorage.setItem('jwtToken', 'test');
      authService.clearTokens();
      expect(localStorage.getItem('jwtToken')).toBe(null);
    });
  });

  describe('getCSRFToken', () => {
    afterEach(() => {
      // Clean up any meta tags
      const meta = document.querySelector('meta[name="csrf-token"]');
      if (meta) {
        document.head.removeChild(meta);
      }
    });

    it('Should return null when no meta tag exists', () => {
      expect(authService.getCSRFToken()).toBe(null);
    });

    it('Should return token from meta tag when present', () => {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'csrf-token');
      meta.setAttribute('content', 'test-csrf-token');
      document.head.appendChild(meta);

      expect(authService.getCSRFToken()).toBe('test-csrf-token');
    });
  });

  describe('migrateLegacyAuth', () => {
    it('Should call clearLegacyTokens', () => {
      localStorage.setItem('jwtToken', 'old-token');

      authService.migrateLegacyAuth();

      expect(localStorage.getItem('jwtToken')).toBe(null);
    });
  });
});
