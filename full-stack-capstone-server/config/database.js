import mongoose from 'mongoose';

/**
 * Get MongoDB connection options with environment variable overrides
 * @returns {Object} Mongoose connection options
 */
export const getConnectionOptions = () => ({
  // Connection pool configuration
  maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE, 10) || 10,
  minPoolSize: parseInt(process.env.MONGODB_MIN_POOL_SIZE, 10) || 2,

  // Timeout configuration
  serverSelectionTimeoutMS:
    parseInt(process.env.MONGODB_SERVER_SELECTION_TIMEOUT, 10) || 5000,
  socketTimeoutMS: parseInt(process.env.MONGODB_SOCKET_TIMEOUT, 10) || 45000,
  connectTimeoutMS: parseInt(process.env.MONGODB_CONNECT_TIMEOUT, 10) || 10000,

  // Heartbeat for replica set monitoring
  heartbeatFrequencyMS: 10000,

  // Disable auto-indexing in production for performance
  autoIndex: process.env.NODE_ENV !== 'production',

  // Use IPv4
  family: 4,
});

/**
 * Set up connection event listeners
 * @param {Object} callbacks - Callback functions for connection events
 */
const setupConnectionListeners = (callbacks = {}) => {
  const { onConnected, onDisconnected, onError, onReconnected } = callbacks;

  mongoose.connection.on('connected', () => {
    const opts = getConnectionOptions();
    console.log(
      `MongoDB connected (pool: ${opts.minPoolSize}-${opts.maxPoolSize})`
    );
    if (onConnected) onConnected();
  });

  mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    if (onDisconnected) onDisconnected();
  });

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err.message);
    if (onError) onError(err);
  });

  mongoose.connection.on('reconnected', () => {
    console.log('MongoDB reconnected');
    if (onReconnected) onReconnected();
  });
};

/**
 * Connect to MongoDB with connection pooling configuration
 * @param {Object} options - Optional callbacks and connection overrides
 * @returns {Promise<mongoose.Connection|null>} The mongoose connection or null in test mode
 */
export async function connectToDatabase(options = {}) {
  if (process.env.NODE_ENV === 'test') {
    console.log('Test mode: Skipping MongoDB connection');
    return null;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost/local';
  const connectionOptions = { ...getConnectionOptions(), ...options };

  // Remove callback properties from connection options
  const { onConnected, onDisconnected, onError, onReconnected, ...mongoOpts } =
    connectionOptions;

  mongoose.Promise = global.Promise;

  setupConnectionListeners({
    onConnected,
    onDisconnected,
    onError,
    onReconnected,
  });

  try {
    await mongoose.connect(uri, mongoOpts);
    return mongoose.connection;
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    throw err;
  }
}

/**
 * Gracefully disconnect from MongoDB
 * @returns {Promise<void>}
 */
export async function disconnectFromDatabase() {
  if (mongoose.connection.readyState !== 0) {
    console.log('Closing MongoDB connection...');
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

/**
 * Check if database is connected
 * @returns {boolean} True if connected
 */
export function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

/**
 * Get detailed database status for health checks
 * @returns {Object} Database status object
 */
export function getDatabaseStatus() {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    state: states[mongoose.connection.readyState] || 'unknown',
    readyState: mongoose.connection.readyState,
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
}

/**
 * Ping the database to verify connectivity
 * @returns {Promise<number>} Ping time in milliseconds, or -1 on failure
 */
export async function pingDatabase() {
  if (!isDatabaseConnected()) {
    return -1;
  }

  try {
    const start = process.hrtime.bigint();
    await mongoose.connection.db.admin().ping();
    return Number(process.hrtime.bigint() - start) / 1e6;
  } catch {
    return -1;
  }
}

export default {
  connectToDatabase,
  disconnectFromDatabase,
  isDatabaseConnected,
  getDatabaseStatus,
  pingDatabase,
  getConnectionOptions,
};
