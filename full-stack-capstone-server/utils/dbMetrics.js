import client from 'prom-client';

let metricsInitialized = false;
let connectionStateGauge;
let connectionErrorsCounter;
let queryDurationHistogram;
let poolMetricsGauge;

/**
 * Initialize database metrics with the Prometheus registry
 * @param {client.Registry} register - The Prometheus registry
 */
export function initDatabaseMetrics(register) {
  if (metricsInitialized) return;

  // Gauge for connection state (1 = connected, 0 = disconnected)
  connectionStateGauge = new client.Gauge({
    name: 'mongodb_connection_state',
    help: 'MongoDB connection state (1 = connected, 0 = disconnected)',
    registers: [register],
  });

  // Counter for connection errors
  connectionErrorsCounter = new client.Counter({
    name: 'mongodb_connection_errors_total',
    help: 'Total number of MongoDB connection errors',
    labelNames: ['type'],
    registers: [register],
  });

  // Histogram for query duration
  queryDurationHistogram = new client.Histogram({
    name: 'mongodb_query_duration_seconds',
    help: 'Duration of MongoDB queries in seconds',
    labelNames: ['operation', 'collection'],
    buckets: [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
    registers: [register],
  });

  // Gauge for pool-related metrics
  poolMetricsGauge = new client.Gauge({
    name: 'mongodb_pool_size',
    help: 'MongoDB connection pool size configuration',
    labelNames: ['type'],
    registers: [register],
  });

  metricsInitialized = true;
}

/**
 * Update connection state gauge
 * @param {boolean} connected - Whether connected or not
 */
export function updateConnectionState(connected) {
  if (connectionStateGauge) {
    connectionStateGauge.set(connected ? 1 : 0);
  }
}

/**
 * Record a connection error
 * @param {string} errorType - Type of error (e.g., 'connection', 'timeout', 'auth')
 */
export function recordConnectionError(errorType = 'unknown') {
  if (connectionErrorsCounter) {
    connectionErrorsCounter.inc({ type: errorType });
  }
}

/**
 * Record query duration
 * @param {string} operation - The operation type (find, save, update, delete, etc.)
 * @param {string} collection - The collection name
 * @param {number} durationSeconds - Duration in seconds
 */
export function recordQueryDuration(operation, collection, durationSeconds) {
  if (queryDurationHistogram) {
    queryDurationHistogram.observe({ operation, collection }, durationSeconds);
  }
}

/**
 * Update pool size metrics
 * @param {number} maxPoolSize - Maximum pool size
 * @param {number} minPoolSize - Minimum pool size
 */
export function updatePoolMetrics(maxPoolSize, minPoolSize) {
  if (poolMetricsGauge) {
    poolMetricsGauge.labels('max').set(maxPoolSize);
    poolMetricsGauge.labels('min').set(minPoolSize);
  }
}

export default {
  initDatabaseMetrics,
  updateConnectionState,
  recordConnectionError,
  recordQueryDuration,
  updatePoolMetrics,
};
