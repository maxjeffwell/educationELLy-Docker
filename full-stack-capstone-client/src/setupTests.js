// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock Sentry to prevent errors in test environment
jest.mock('@sentry/react', () => ({
  init: jest.fn(),
  ErrorBoundary: ({ children }) => children,
  browserTracingIntegration: jest.fn(() => ({})),
  replayIntegration: jest.fn(() => ({})),
  captureException: jest.fn(),
  setUser: jest.fn(),
  withScope: jest.fn(cb => cb({ setExtra: jest.fn() })),
}));

// Mock the local sentry utils
jest.mock('./utils/sentry', () => ({
  initSentry: jest.fn(),
  SentryErrorBoundary: ({ children }) => children,
  captureException: jest.fn(),
  setUser: jest.fn(),
}));

// Mock auth utils by default (can be overridden in specific tests)
jest.mock('./utils/auth', () => ({
  __esModule: true,
  default: {
    isAuthenticated: jest.fn(() => false),
    getToken: jest.fn(() => null),
    clearTokens: jest.fn(),
    handleAuthSuccess: jest.fn(),
    handleAuthFailure: jest.fn(),
    checkAuthStatus: jest.fn().mockResolvedValue({ authenticated: false }),
    signout: jest.fn().mockResolvedValue({}),
    signoutAll: jest.fn().mockResolvedValue({}),
  },
}));

// Mock react-helmet-async to avoid SSR issues in tests
jest.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => children,
  HelmetProvider: ({ children }) => children,
}));

// Mock window.matchMedia which is not implemented in JSDOM
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver for components that use it
global.IntersectionObserver = class IntersectionObserver {
  // eslint-disable-next-line no-useless-constructor
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};

// Suppress known console warnings during tests
const originalError = console.error;
const originalWarn = console.warn;

beforeAll(() => {
  // Suppress known non-critical warnings
  console.error = (...args) => {
    const message = typeof args[0] === 'string' ? args[0] : '';

    // Suppress known warnings that don't affect test results
    const suppressedPatterns = [
      'Warning: ReactDOM.render is no longer supported',
      'Warning: An update to',
      'inside a test was not wrapped in act',
      'Warning: findDOMNode is deprecated',
      'Support for defaultProps will be removed',
      'A suspended resource finished loading inside a test',
      'Failed to fetch students:',
    ];

    if (suppressedPatterns.some(pattern => message.includes(pattern))) {
      return;
    }
    originalError.call(console, ...args);
  };

  console.warn = (...args) => {
    const message = typeof args[0] === 'string' ? args[0] : '';

    // Suppress React Router deprecation warnings in tests
    const suppressedPatterns = ['React Router Future Flag Warning'];

    if (suppressedPatterns.some(pattern => message.includes(pattern))) {
      return;
    }
    originalWarn.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
  console.warn = originalWarn;
});

// Cleanup after each test to prevent memory leaks and act() warnings
afterEach(() => {
  jest.clearAllTimers();
});
