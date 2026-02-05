import signupReducer, {
  registerUserRequest,
  registerUserError,
  clearSignupError,
  selectSignupLoading,
  selectSignupError,
} from '../store/slices/signupSlice';

describe('signupSlice', () => {
  const initialState = {
    loading: false,
    errorMessage: '',
  };

  describe('reducer actions', () => {
    it('should return initial state', () => {
      const result = signupReducer(undefined, { type: '' });

      expect(result.loading).toBe(false);
      expect(result.errorMessage).toBe('');
    });

    it('should handle registerUserRequest', () => {
      const stateWithError = {
        loading: false,
        errorMessage: 'Previous error',
      };

      const result = signupReducer(stateWithError, registerUserRequest());

      expect(result.loading).toBe(true);
      expect(result.errorMessage).toBe('');
    });

    it('should handle registerUserError', () => {
      const loadingState = {
        loading: true,
        errorMessage: '',
      };

      const result = signupReducer(
        loadingState,
        registerUserError('Email already exists')
      );

      expect(result.loading).toBe(false);
      expect(result.errorMessage).toBe('Email already exists');
    });

    it('should handle clearSignupError', () => {
      const stateWithError = {
        loading: false,
        errorMessage: 'Some error message',
      };

      const result = signupReducer(stateWithError, clearSignupError());

      expect(result.errorMessage).toBe('');
      expect(result.loading).toBe(false);
    });

    it('should clear error while preserving loading state', () => {
      const loadingStateWithError = {
        loading: true,
        errorMessage: 'Error during loading',
      };

      const result = signupReducer(loadingStateWithError, clearSignupError());

      expect(result.errorMessage).toBe('');
      expect(result.loading).toBe(true);
    });
  });

  describe('selectors', () => {
    it('should select loading state when true', () => {
      const state = {
        signup: { loading: true, errorMessage: '' },
      };
      expect(selectSignupLoading(state)).toBe(true);
    });

    it('should select loading state when false', () => {
      const state = {
        signup: { loading: false, errorMessage: '' },
      };
      expect(selectSignupLoading(state)).toBe(false);
    });

    it('should select error message', () => {
      const state = {
        signup: { loading: false, errorMessage: 'Registration failed' },
      };
      expect(selectSignupError(state)).toBe('Registration failed');
    });

    it('should select empty error message', () => {
      const state = {
        signup: { loading: false, errorMessage: '' },
      };
      expect(selectSignupError(state)).toBe('');
    });
  });
});
