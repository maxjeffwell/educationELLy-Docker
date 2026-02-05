import React from 'react';
import { render, screen } from './test-utils';
import Signout from '../components/auth/Signout';

// Auth utils mock is provided in setupTests.js

describe('<Signout />', () => {
  it('Should render without crashing', () => {
    render(<Signout />);
    expect(
      screen.getByText('You have successfully logged out.')
    ).toBeInTheDocument();
  });

  it('Should display success message', () => {
    render(<Signout />);

    const message = screen.getByText('You have successfully logged out.');
    expect(message).toBeInTheDocument();
  });

  it('Should clear authenticated state after signout', () => {
    const preloadedState = {
      auth: { authenticated: true, user: { email: 'test@test.com' }, errorMessage: '', loading: false },
    };

    const { store } = render(<Signout />, { preloadedState });

    // After signout, auth state should be cleared
    expect(store.getState().auth.authenticated).toBe(false);
  });
});
