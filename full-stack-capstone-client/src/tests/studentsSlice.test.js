import studentsReducer, {
  clearSelectedStudent,
  clearError,
  selectStudentsLoading,
  selectStudentsError,
  selectSelectedStudent,
  selectAllStudents,
  selectStudentById,
  selectStudentIds,
} from '../store/slices/studentsSlice';

// Mock dependencies
jest.mock('../utils/auth', () => ({
  isAuthenticated: jest.fn(),
  getToken: jest.fn(),
  clearTokens: jest.fn(),
}));

jest.mock('../store/slices/authSlice', () => ({
  setError: jest.fn(msg => ({ type: 'auth/setError', payload: msg })),
}));

describe('studentsSlice', () => {
  // Entity adapter creates this structure
  const initialState = {
    ids: [],
    entities: {},
    loading: false,
    error: null,
    selectedStudent: null,
  };

  describe('synchronous actions', () => {
    it('should return initial state', () => {
      const result = studentsReducer(undefined, { type: '' });

      expect(result.ids).toEqual([]);
      expect(result.entities).toEqual({});
      expect(result.loading).toBe(false);
      expect(result.error).toBe(null);
      expect(result.selectedStudent).toBe(null);
    });

    it('should handle clearSelectedStudent', () => {
      const stateWithSelected = {
        ...initialState,
        selectedStudent: { id: '1', fullName: 'John Doe' },
      };

      const result = studentsReducer(stateWithSelected, clearSelectedStudent());

      expect(result.selectedStudent).toBe(null);
    });

    it('should handle clearError', () => {
      const stateWithError = {
        ...initialState,
        error: 'Failed to fetch students',
      };

      const result = studentsReducer(stateWithError, clearError());

      expect(result.error).toBe(null);
    });

    it('should preserve other state when clearing selected student', () => {
      const stateWithData = {
        ids: ['1', '2'],
        entities: {
          '1': { id: '1', fullName: 'John' },
          '2': { id: '2', fullName: 'Jane' },
        },
        loading: false,
        error: null,
        selectedStudent: { id: '1', fullName: 'John' },
      };

      const result = studentsReducer(stateWithData, clearSelectedStudent());

      expect(result.ids).toEqual(['1', '2']);
      expect(result.entities).toEqual(stateWithData.entities);
      expect(result.selectedStudent).toBe(null);
    });
  });

  describe('selectors', () => {
    const mockState = {
      students: {
        ids: ['1', '2', '3'],
        entities: {
          '1': { id: '1', fullName: 'Alice Smith', ellStatus: 'beginner' },
          '2': { id: '2', fullName: 'Bob Jones', ellStatus: 'intermediate' },
          '3': { id: '3', fullName: 'Carol White', ellStatus: 'advanced' },
        },
        loading: true,
        error: 'Test error',
        selectedStudent: { id: '2', fullName: 'Bob Jones' },
      },
    };

    it('should select loading state', () => {
      expect(selectStudentsLoading(mockState)).toBe(true);
    });

    it('should select error', () => {
      expect(selectStudentsError(mockState)).toBe('Test error');
    });

    it('should select selected student', () => {
      expect(selectSelectedStudent(mockState)).toEqual({
        id: '2',
        fullName: 'Bob Jones',
      });
    });

    it('should select all students', () => {
      const students = selectAllStudents(mockState);

      expect(students).toHaveLength(3);
      expect(students[0].fullName).toBe('Alice Smith');
      expect(students[1].fullName).toBe('Bob Jones');
      expect(students[2].fullName).toBe('Carol White');
    });

    it('should select student by id', () => {
      const student = selectStudentById(mockState, '2');

      expect(student).toEqual({
        id: '2',
        fullName: 'Bob Jones',
        ellStatus: 'intermediate',
      });
    });

    it('should return undefined for non-existent student id', () => {
      const student = selectStudentById(mockState, '999');
      expect(student).toBeUndefined();
    });

    it('should select student ids', () => {
      const ids = selectStudentIds(mockState);
      expect(ids).toEqual(['1', '2', '3']);
    });

    it('should handle empty state', () => {
      const emptyState = {
        students: {
          ids: [],
          entities: {},
          loading: false,
          error: null,
          selectedStudent: null,
        },
      };

      expect(selectAllStudents(emptyState)).toEqual([]);
      expect(selectStudentIds(emptyState)).toEqual([]);
      expect(selectStudentsLoading(emptyState)).toBe(false);
      expect(selectStudentsError(emptyState)).toBe(null);
      expect(selectSelectedStudent(emptyState)).toBe(null);
    });
  });
});
