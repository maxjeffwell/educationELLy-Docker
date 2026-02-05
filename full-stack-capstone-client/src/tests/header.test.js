import React from 'react';
import { render, screen } from './test-utils';
import Header from '../shared/components/Header';

describe('<Header />', () => {
  it('Should render without crashing', () => {
    render(<Header />);
    // Header renders navigation buttons
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('Should display About Us link', () => {
    render(<Header />);
    expect(screen.getByText('About Us')).toBeInTheDocument();
  });

  it('Should show unauthenticated navigation links', () => {
    render(<Header />);

    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();

    // Should not show authenticated links
    expect(screen.queryByText('Instructor Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Student List')).not.toBeInTheDocument();
    expect(screen.queryByText('Log Out')).not.toBeInTheDocument();
  });

  it('Should show authenticated navigation links when user is logged in', () => {
    const authenticatedState = {
      auth: {
        authenticated: true,
        user: { email: 'test@test.com' },
        errorMessage: '',
        loading: false,
      },
    };

    render(<Header />, { preloadedState: authenticatedState });

    expect(screen.getByText('Instructor Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Student List')).toBeInTheDocument();
    expect(screen.getByText('Add New Student')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();

    // Should not show unauthenticated links
    expect(screen.queryByText('Register')).not.toBeInTheDocument();
    expect(screen.queryByText('Log In')).not.toBeInTheDocument();
  });

  it('Should have clickable Register and Log In buttons', () => {
    render(<Header />);

    const registerButton = screen.getByText('Register');
    const loginButton = screen.getByText('Log In');

    expect(registerButton).toBeInTheDocument();
    expect(loginButton).toBeInTheDocument();
  });

  it('Should have clickable authenticated navigation buttons', () => {
    const authenticatedState = {
      auth: {
        authenticated: true,
        user: { email: 'test@test.com' },
        errorMessage: '',
        loading: false,
      },
    };

    render(<Header />, { preloadedState: authenticatedState });

    expect(screen.getByText('Instructor Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Student List')).toBeInTheDocument();
    expect(screen.getByText('Add New Student')).toBeInTheDocument();
    expect(screen.getByText('Log Out')).toBeInTheDocument();
  });

  it('Should render header container', () => {
    const { container } = render(<Header />);
    expect(container.firstChild).toBeTruthy();
  });
});
