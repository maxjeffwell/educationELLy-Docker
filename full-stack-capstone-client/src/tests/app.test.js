import React from 'react';
import { render as rtlRender, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';
import App from '../components/App';

// Import reducers from feature directories
import authReducer from '../features/auth/authSlice';
import studentsReducer from '../features/students/studentsSlice';
import toggleReducer from '../features/dashboard/toggleSlice';
import signupReducer from '../features/auth/signupSlice';
import modalReducer from '../features/modals/modalSlice';

const theme = {
  orange: '#fb9438',
  blue: '#2873b4',
  green: '#86c64e',
  white: '#f5f5f5',
};

// Custom render for App that doesn't wrap in Router (App has its own)
function renderApp(preloadedState = {}) {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      students: studentsReducer,
      isSidebarToggled: toggleReducer,
      signup: signupReducer,
      modals: modalReducer,
    },
    preloadedState,
  });

  return rtlRender(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Provider>
  );
}

describe('<App />', () => {
  it('Should render without crashing', () => {
    renderApp();
    // App component contains Header with nav links
    expect(screen.getByText('Register')).toBeInTheDocument();
  });

  it('Should render header with navigation links', () => {
    renderApp();

    // Check for unauthenticated user links
    expect(screen.getByText('Register')).toBeInTheDocument();
    expect(screen.getByText('Log In')).toBeInTheDocument();
  });

  it('Should render the landing page content by default', () => {
    renderApp();

    // Landing page content should be shown at root path
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('educationELLy');
  });

  it('Should have valid container element', () => {
    const { container } = renderApp();

    // App should render a valid container
    expect(container.firstChild).toBeTruthy();
  });
});
