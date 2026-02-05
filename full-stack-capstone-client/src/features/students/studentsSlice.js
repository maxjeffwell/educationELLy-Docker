import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import authService from '../../utils/auth';
import { setError } from '../auth/authSlice';

// Create entity adapter for normalized state
const studentsAdapter = createEntityAdapter({
  // Assuming students have an 'id' field
  selectId: student => student.id || student._id,
});

// Initial state
const initialState = studentsAdapter.getInitialState({
  loading: false,
  error: null,
  selectedStudent: null,
  pagination: {
    page: 1,
    limit: 25,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  },
});

// Async thunks
export const fetchStudents = createAsyncThunk(
  'students/fetchAll',
  async (
    { page = 1, limit = 25, sort = 'fullName', order = 'asc' } = {},
    { dispatch, getState, rejectWithValue }
  ) => {
    // Check both authService and Redux state
    const token = authService.getToken();
    const reduxAuth = getState().auth.authenticated;

    // If we have a token, try to use it regardless of validation
    if (!token && !reduxAuth) {
      dispatch(setError('No authentication token found'));
      return rejectWithValue('Not authenticated');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/students`, {
        params: {
          page,
          limit,
          sort,
          order,
          _t: Date.now(), // Cache-busting
        },
      });
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        authService.clearTokens();
        dispatch(setError('Session expired. Please log in again.'));
      }
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to fetch students'
      );
    }
  }
);

export const fetchStudent = createAsyncThunk(
  'students/fetchOne',
  async (id, { dispatch, rejectWithValue }) => {
    if (!authService.isAuthenticated()) {
      dispatch(setError('No authentication token found'));
      return rejectWithValue('Not authenticated');
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/students/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        authService.clearTokens();
        dispatch(setError('Session expired. Please log in again.'));
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch student'
      );
    }
  }
);

export const createStudent = createAsyncThunk(
  'students/create',
  async (studentData, { dispatch, getState, rejectWithValue }) => {
    // Check authentication similar to fetchStudents
    const token = authService.getToken();
    const reduxAuth = getState().auth.authenticated;

    if (!token && !reduxAuth) {
      dispatch(setError('No authentication token found'));
      return rejectWithValue('Not authenticated');
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/students`,
        studentData
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) {
        authService.clearTokens();
        dispatch(setError('Session expired. Please log in again.'));
      }
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          'Failed to create student'
      );
    }
  }
);

export const updateStudent = createAsyncThunk(
  'students/update',
  async ({ id, ...studentData }, { dispatch, rejectWithValue }) => {
    if (!authService.isAuthenticated()) {
      dispatch(setError('No authentication token found'));
      return rejectWithValue('Not authenticated');
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/students/${id}`,
        studentData
      );
      // Server returns { success, message, result } - extract the student data
      const updatedStudent = response.data.result || response.data;
      // Ensure the returned data has an id field for the entity adapter
      return { ...updatedStudent, id: updatedStudent._id || id };
    } catch (error) {
      if (error.response?.status === 401) {
        authService.clearTokens();
        dispatch(setError('Session expired. Please log in again.'));
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to update student'
      );
    }
  }
);

export const deleteStudent = createAsyncThunk(
  'students/delete',
  async (id, { dispatch, rejectWithValue }) => {
    if (!authService.isAuthenticated()) {
      dispatch(setError('No authentication token found'));
      return rejectWithValue('Not authenticated');
    }

    try {
      await axios.delete(`${API_BASE_URL}/students/${id}`);
      return id;
    } catch (error) {
      if (error.response?.status === 401) {
        authService.clearTokens();
        dispatch(setError('Session expired. Please log in again.'));
      }
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete student'
      );
    }
  }
);

// Students slice
const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    clearSelectedStudent: state => {
      state.selectedStudent = null;
    },
    clearError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch all students
      .addCase(fetchStudents.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        // Handle paginated response: { data: [...], pagination: {...} }
        const { data, pagination } = action.payload;
        studentsAdapter.setAll(state, data);
        state.pagination = pagination;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch one student
      .addCase(fetchStudent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedStudent = action.payload;
        studentsAdapter.upsertOne(state, action.payload);
      })
      .addCase(fetchStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create student
      .addCase(createStudent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createStudent.fulfilled, (state, action) => {
        state.loading = false;
        studentsAdapter.addOne(state, action.payload);
      })
      .addCase(createStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update student
      .addCase(updateStudent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        studentsAdapter.upsertOne(state, action.payload);
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete student
      .addCase(deleteStudent.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        studentsAdapter.removeOne(state, action.payload);
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export actions
export const { clearSelectedStudent, clearError } = studentsSlice.actions;

// Export reducer
export default studentsSlice.reducer;

// Export selectors
export const {
  selectAll: selectAllStudents,
  selectById: selectStudentById,
  selectIds: selectStudentIds,
} = studentsAdapter.getSelectors(state => state.students);

export const selectStudentsLoading = state => state.students.loading;
export const selectStudentsError = state => state.students.error;
export const selectSelectedStudent = state => state.students.selectedStudent;

// Pagination selectors
export const selectPagination = state => state.students.pagination;
export const selectCurrentPage = state => state.students.pagination.page;
export const selectTotalPages = state => state.students.pagination.totalPages;
export const selectTotalStudents = state => state.students.pagination.total;
export const selectHasNextPage = state => state.students.pagination.hasNext;
export const selectHasPrevPage = state => state.students.pagination.hasPrev;
