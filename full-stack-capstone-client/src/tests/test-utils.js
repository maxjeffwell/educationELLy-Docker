import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { configureStore } from '@reduxjs/toolkit';

// Import all reducers from feature directories
import authReducer from '../features/auth/authSlice';
import studentsReducer from '../features/students/studentsSlice';
import toggleReducer from '../features/dashboard/toggleSlice';
import signupReducer from '../features/auth/signupSlice';
import modalReducer from '../features/modals/modalSlice';

// Theme for styled-components
const theme = {
  orange: '#fb9438',
  blue: '#2873b4',
  green: '#86c64e',
  white: '#f5f5f5',
};

// Create a custom render function that includes all providers
export function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = configureStore({
      reducer: {
        auth: authReducer,
        students: studentsReducer,
        isSidebarToggled: toggleReducer,
        signup: signupReducer,
        modals: modalReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <ThemeProvider theme={theme}>{children}</ThemeProvider>
        </BrowserRouter>
      </Provider>
    );
  }

  // Return an object with the store and all of RTL's query functions
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

// Re-export everything
export * from '@testing-library/react';

// Override render method
export { renderWithProviders as render };
