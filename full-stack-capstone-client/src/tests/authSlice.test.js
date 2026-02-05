import authReducer, {
  signout,
  clearError,
  setError,
  selectAuth,
  selectAuthUser,
  selectAuthError,
  selectAuthLoading,
} from '../features/auth/authSlice';

// Mock the auth service to avoid side effects
jest.mock('../utils/auth', () => ({
  handleAuthFailure: jest.fn(),
  handleAuthSuccess: jest.fn(),
  checkAuthStatus: jest.fn(),
  signout: jest.fn(),
  signoutAll: jest.fn(),
}));

describe('authSlice', () => {
  const initialState = {
    authenticated: false,
    user: null,
    errorMessage: '',
    loading: true,
  };

  describe('synchronous actions', () => {
    it('should return the initial state when passed an empty action', () => {
      const result = authReducer(undefined, { type: '' });

      expect(result.authenticated).toBe(false);
      expect(result.user).toBe(null);
      expect(result.errorMessage).toBe('');
      expect(result.loading).toBe(true);
    });

    it('should handle signout action', () => {
      const authenticatedState = {
        authenticated: true,
        user: { email: 'test@example.com' },
        errorMessage: '',
        loading: false,
      };

      const result = authReducer(authenticatedState, signout());

      expect(result.authenticated).toBe(false);
      expect(result.user).toBe(null);
      expect(result.errorMessage).toBe('');
    });

    it('should handle clearError action', () => {
      const stateWithError = {
        ...initialState,
        errorMessage: 'Something went wrong',
      };

      const result = authReducer(stateWithError, clearError());

      expect(result.errorMessage).toBe('');
    });

    it('should handle setError action on clean state', () => {
      const result = authReducer(initialState, setError('Invalid credentials'));

      expect(result.errorMessage).toBe('Invalid credentials');
    });

    it('should overwrite existing error with setError action', () => {
      const stateWithError = {
        ...initialState,
        errorMessage: 'Old error message',
      };

      const result = authReducer(stateWithError, setError('New error message'));

      expect(result.errorMessage).toBe('New error message');
    });
  });

  describe('selectors', () => {
    const mockState = {
      auth: {
        authenticated: true,
        user: { email: 'user@test.com', name: 'Test User' },
        errorMessage: 'Test error',
        loading: false,
      },
    };

    it('should select authenticated status', () => {
      expect(selectAuth(mockState)).toBe(true);
    });

    it('should select user', () => {
      expect(selectAuthUser(mockState)).toEqual({
        email: 'user@test.com',
        name: 'Test User',
      });
    });

    it('should select error message', () => {
      expect(selectAuthError(mockState)).toBe('Test error');
    });

    it('should select loading status', () => {
      expect(selectAuthLoading(mockState)).toBe(false);
    });
  });
});
