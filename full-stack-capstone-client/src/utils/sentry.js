import * as Sentry from '@sentry/react';

/**
 * Initialize Sentry error tracking for the React application.
 * Should be called early in the application lifecycle, before ReactDOM.render.
 */
export function initSentry() {
  if (!process.env.REACT_APP_SENTRY_DSN) {
    console.log('Sentry DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
  });

  console.log('Sentry initialized for', process.env.NODE_ENV || 'development');
}

/**
 * Wrap a component with Sentry error boundary
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

/**
 * Capture an exception manually
 */
export function captureException(error, context) {
  Sentry.captureException(error, context);
}

/**
 * Set user context for error tracking
 */
export function setUser(user) {
  if (user) {
    Sentry.setUser({ email: user.email, id: user.id });
  } else {
    Sentry.setUser(null);
  }
}

export { Sentry };
