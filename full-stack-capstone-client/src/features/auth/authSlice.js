import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import authService from '../../utils/auth';

// Initial state - we'll verify auth status asynchronously
const initialState = {
  authenticated: false,
  user: null,
  errorMessage: '',
  loading: true, // Start as loading until we verify auth status
};

// Check authentication status on app load
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.checkAuthStatus();
      if (result.authenticated) {
        return { user: result.user };
      }
      return rejectWithValue('Not authenticated');
    } catch (error) {
      return rejectWithValue('Not authenticated');
    }
  }
);

// Signin - credentials sent to server, cookies set by server
export const signin = createAsyncThunk(
  'auth/signin',
  async ({ formData, callback } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signin`, formData);
      const { user } = response.data;

      // Update auth service state
      authService.handleAuthSuccess(user);

      // Execute callback if provided
      if (callback) callback();

      return { user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'Invalid login email or password. Please try logging in again.'
      );
    }
  }
);

// Signup - creates account and sets auth cookies
export const signup = createAsyncThunk(
  'auth/signup',
  async ({ formData, callback } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/signup`, formData);
      const { user } = response.data;

      // Update auth service state
      authService.handleAuthSuccess(user);

      // Execute callback if provided
      if (callback) callback();

      return { user };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error ||
          error.response?.data?.message ||
          'This email is in use. Please register using a different email.'
      );
    }
  }
);

// Signout - invalidates tokens on server and clears cookies
export const signoutAsync = createAsyncThunk(
  'auth/signoutAsync',
  async (_, { rejectWithValue }) => {
    try {
      await authService.signout();
      return {};
    } catch (error) {
      // Even if server signout fails, clear local state
      authService.handleAuthFailure();
      return rejectWithValue(error.message);
    }
  }
);

// Signout from all devices
export const signoutAllDevices = createAsyncThunk(
  'auth/signoutAllDevices',
  async (_, { rejectWithValue }) => {
    try {
      await authService.signoutAll();
      return {};
    } catch (error) {
      authService.handleAuthFailure();
      return rejectWithValue(error.message);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Synchronous signout (for immediate UI updates)
    signout: state => {
      authService.handleAuthFailure();
      state.authenticated = false;
      state.user = null;
      state.errorMessage = '';
    },
    clearError: state => {
      state.errorMessage = '';
    },
    setError: (state, action) => {
      state.errorMessage = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // Check auth status
      .addCase(checkAuth.pending, state => {
        state.loading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.authenticated = true;
        state.user = action.payload.user;
      })
      .addCase(checkAuth.rejected, state => {
        state.loading = false;
        state.authenticated = false;
        state.user = null;
      })
      // Signin cases
      .addCase(signin.pending, state => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.authenticated = true;
        state.user = action.payload.user;
        state.errorMessage = '';
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.authenticated = false;
        state.errorMessage = action.payload;
      })
      // Signup cases
      .addCase(signup.pending, state => {
        state.loading = true;
        state.errorMessage = '';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.loading = false;
        state.authenticated = true;
        state.user = action.payload.user;
        state.errorMessage = '';
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.authenticated = false;
        state.errorMessage = action.payload;
      })
      // Async signout
      .addCase(signoutAsync.fulfilled, state => {
        state.authenticated = false;
        state.user = null;
        state.errorMessage = '';
      })
      .addCase(signoutAsync.rejected, state => {
        // Still clear auth state even if server request failed
        state.authenticated = false;
        state.user = null;
      })
      // Signout all devices
      .addCase(signoutAllDevices.fulfilled, state => {
        state.authenticated = false;
        state.user = null;
        state.errorMessage = '';
      })
      .addCase(signoutAllDevices.rejected, state => {
        state.authenticated = false;
        state.user = null;
      });
  },
});

// Export actions
export const { signout, clearError, setError } = authSlice.actions;

// Export reducer
export default authSlice.reducer;

// Selectors
export const selectAuth = state => state.auth.authenticated;
export const selectAuthUser = state => state.auth.user;
export const selectAuthError = state => state.auth.errorMessage;
export const selectAuthLoading = state => state.auth.loading;
