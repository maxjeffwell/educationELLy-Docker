import React from 'react';
import { render, screen, waitFor } from './test-utils';
import axios from 'axios';
import Students from '../features/students/components/StudentList';

// Mock axios
jest.mock('axios');

// Get access to the mocked auth service
import authService from '../utils/auth';

const mockStudents = [
  {
    id: '1',
    _id: '1',
    fullName: 'John Doe',
    school: 'Lincoln Elementary',
    teacher: 'Ms. Smith',
    gradeLevel: '3rd',
    ellStatus: 'Level 2',
    compositeLevel: '3.5',
    designation: 'IEP',
  },
  {
    id: '2',
    _id: '2',
    fullName: 'Jane Smith',
    school: 'Washington Middle',
    teacher: 'Mr. Johnson',
    gradeLevel: '6th',
    ellStatus: 'Level 4',
    compositeLevel: '4.2',
    designation: '504 Plan',
  },
];

// Helper to create paginated response matching API format
const createPaginatedResponse = (students) => ({
  data: {
    data: students,
    pagination: {
      page: 1,
      limit: 25,
      total: students.length,
      totalPages: 1,
      hasNext: false,
      hasPrev: false,
    },
  },
});

describe('<Students />', () => {
  // Authenticated preloaded state for tests that need it
  const authenticatedState = {
    auth: {
      authenticated: true,
      user: { email: 'test@test.com' },
      errorMessage: '',
      loading: false,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock auth service to return authenticated
    authService.isAuthenticated.mockReturnValue(true);
    authService.getToken.mockReturnValue('fake-token');
    // Default mock - return empty paginated response
    axios.get.mockResolvedValue(createPaginatedResponse([]));
  });

  it('Should show loading state initially', () => {
    render(<Students />, { preloadedState: authenticatedState });
    expect(screen.getByText('Loading students...')).toBeInTheDocument();
  });

  it('Should render student list after loading', async () => {
    axios.get.mockResolvedValue(createPaginatedResponse(mockStudents));

    render(<Students />, { preloadedState: authenticatedState });

    // Wait for loading to complete - use getByRole for heading
    await waitFor(
      () => {
        expect(
          screen.getByRole('heading', { name: /Student List/i })
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(screen.getByText('Student Name: John Doe')).toBeInTheDocument();
    expect(screen.getByText('Student Name: Jane Smith')).toBeInTheDocument();
  });

  it('Should display student information when data is available', async () => {
    axios.get.mockResolvedValue(createPaginatedResponse([mockStudents[0]]));

    render(<Students />, { preloadedState: authenticatedState });

    // Wait for student card to appear
    await waitFor(
      () => {
        expect(screen.getByText(/John Doe/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    // Check card contains expected information (text may be split across elements)
    const card = screen.getByText(/John Doe/).closest('.card');
    expect(card).toHaveTextContent('Lincoln Elementary');
    expect(card).toHaveTextContent('Ms. Smith');
    expect(card).toHaveTextContent('3rd');
    expect(card).toHaveTextContent('Level 2');
  });

  it('Should show no students message when list is empty', async () => {
    axios.get.mockResolvedValue(createPaginatedResponse([]));

    render(<Students />, { preloadedState: authenticatedState });

    await waitFor(
      () => {
        expect(screen.getByText('No students found.')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('Should display update links for students', async () => {
    axios.get.mockResolvedValue(createPaginatedResponse(mockStudents));

    render(<Students />, { preloadedState: authenticatedState });

    await waitFor(
      () => {
        expect(screen.getAllByText('Update Student')).toHaveLength(2);
      },
      { timeout: 3000 }
    );

    const updateLinks = screen.getAllByText('Update Student');
    expect(updateLinks[0].closest('a')).toHaveAttribute(
      'href',
      '/students/1/update'
    );
    expect(updateLinks[1].closest('a')).toHaveAttribute(
      'href',
      '/students/2/update'
    );
  });

  it('Should show error state when fetch fails', async () => {
    axios.get.mockRejectedValue(new Error('Network error'));

    render(<Students />, { preloadedState: authenticatedState });

    await waitFor(
      () => {
        expect(screen.getByText('Error Loading Students')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('Should display total student count in header', async () => {
    axios.get.mockResolvedValue(createPaginatedResponse(mockStudents));

    render(<Students />, { preloadedState: authenticatedState });

    await waitFor(
      () => {
        expect(screen.getByText(/2 students/)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
