const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];

// Optional numeric environment variables for database configuration
const numericDbVars = [
  'MONGODB_MAX_POOL_SIZE',
  'MONGODB_MIN_POOL_SIZE',
  'MONGODB_SERVER_SELECTION_TIMEOUT',
  'MONGODB_SOCKET_TIMEOUT',
  'MONGODB_CONNECT_TIMEOUT',
];

const validateEnvironment = () => {
  const missing = requiredEnvVars.filter((envVar) => !process.env[envVar]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`
    );
  }

  // Validate JWT_SECRET strength
  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  // Validate numeric database configuration variables
  numericDbVars.forEach((varName) => {
    const value = process.env[varName];
    if (value !== undefined && value !== '') {
      const parsed = parseInt(value, 10);
      if (isNaN(parsed) || parsed < 0) {
        console.warn(
          `Warning: ${varName} should be a positive number, got: ${value}`
        );
      }
    }
  });
};

export default validateEnvironment;
