import * as Sentry from '@sentry/node';

/**
 * Initialize Sentry error tracking for the Express application.
 * Must be called early in the application lifecycle, before routes are defined.
 *
 * @param {object} app - The Express application instance
 */
export function initSentry(app) {
  if (!process.env.SENTRY_DSN) {
    console.log('Sentry DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      Sentry.httpIntegration(),
      Sentry.expressIntegration({ app }),
    ],
  });

  console.log('Sentry initialized for', process.env.NODE_ENV || 'development');
}

/**
 * Returns the Sentry Express error handler middleware.
 * Should be added after all routes but before other error handlers.
 *
 * @returns {function} Sentry Express error handler middleware
 */
export function sentryErrorHandler() {
  return Sentry.expressErrorHandler();
}

export { Sentry };
