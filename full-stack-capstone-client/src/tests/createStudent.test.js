import React from 'react';
import { render, screen } from './test-utils';
import userEvent from '@testing-library/user-event';
import CreateStudent from '../features/students/components/CreateStudent';

// Mock react-router-dom navigate
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

// Mock axios to prevent actual API calls
jest.mock('axios');

describe('<CreateStudent />', () => {
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
  });

  it('Should render the create student form', () => {
    render(<CreateStudent />, { preloadedState: authenticatedState });

    expect(
      screen.getByRole('heading', { name: /Create New Student/i })
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter student full name/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter school/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter teacher/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter grade level/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/enter ELL Status/i)
    ).toBeInTheDocument();
  });

  it('Should have a disabled submit button when form is empty', () => {
    render(<CreateStudent />, { preloadedState: authenticatedState });

    const submitButton = screen.getByRole('button', { name: /Save Student/i });
    expect(submitButton).toBeDisabled();
  });

  it('Should enable submit button when required fields are filled', async () => {
    const user = userEvent.setup();
    render(<CreateStudent />, { preloadedState: authenticatedState });

    // Fill required fields
    await user.type(
      screen.getByPlaceholderText(/enter student full name/i),
      'John Doe'
    );
    await user.type(
      screen.getByPlaceholderText(/enter school/i),
      'Test School'
    );
    await user.type(screen.getByPlaceholderText(/enter teacher/i), 'Ms. Smith');
    await user.type(screen.getByPlaceholderText(/enter grade level/i), '5th');
    await user.type(
      screen.getByPlaceholderText(/enter ELL Status/i),
      'Level 2'
    );

    const submitButton = screen.getByRole('button', { name: /Save Student/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('Should show optional fields', () => {
    render(<CreateStudent />, { preloadedState: authenticatedState });

    expect(
      screen.getByPlaceholderText(/WIDA ACCESS composite level/i)
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/IEP\/504\/intervention plan/i)
    ).toBeInTheDocument();
  });

  it('Should display form inputs with correct icons', () => {
    const { container } = render(<CreateStudent />, {
      preloadedState: authenticatedState,
    });

    // Check that form group containers exist using container query
    // eslint-disable-next-line testing-library/no-node-access, testing-library/no-container
    const formGroups = container.querySelectorAll('.field');
    expect(formGroups.length).toBeGreaterThan(0);
  });
});
