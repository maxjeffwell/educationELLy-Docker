import 'dotenv/config.js';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import client from 'prom-client';
import Router from './router.js';
import validateEnvironment from './utils/envValidation.js';
import { initSentry, sentryErrorHandler } from './utils/sentry.js';
import {
  connectToDatabase,
  disconnectFromDatabase,
  getDatabaseStatus,
  getConnectionOptions,
} from './config/database.js';
import {
  initDatabaseMetrics,
  updateConnectionState,
  recordConnectionError,
  updatePoolMetrics,
} from './utils/dbMetrics.js';

import './services/passport.js';
import './models/student.js';
import './models/user.js';

// Validate environment variables
if (process.env.NODE_ENV !== 'test') {
  try {
    validateEnvironment();
  } catch (error) {
    console.error('Environment validation failed:', error.message);
    console.error('Continuing without validation...');
  }
}

const app = express();

// Initialize Sentry early (before routes)
initSentry(app);

// Prometheus metrics setup
const register = new client.Registry();
client.collectDefaultMetrics({ register });

const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
  registers: [register]
});

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status'],
  buckets: [0.001, 0.005, 0.015, 0.05, 0.1, 0.2, 0.3, 0.4, 0.5, 1, 2, 5],
  registers: [register],
});

// Initialize database metrics
initDatabaseMetrics(register);

// Metrics middleware (before other middleware)
app.use((req, res, next) => {
  if (req.path === '/metrics' || req.path === '/health') return next();
  const start = process.hrtime.bigint();
  res.on('finish', () => {
    const duration = Number(process.hrtime.bigint() - start) / 1e9;
    const route = req.route?.path || req.path || 'unknown';
    const labels = { method: req.method, route, status: res.statusCode.toString() };
    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, duration);
  });
  next();
});

// Trust proxy for K8s ingress
app.set('trust proxy', true);

// Database connection with pooling configuration
if (process.env.NODE_ENV !== 'test') {
  const dbOpts = getConnectionOptions();
  updatePoolMetrics(dbOpts.maxPoolSize, dbOpts.minPoolSize);

  connectToDatabase({
    onConnected: () => updateConnectionState(true),
    onDisconnected: () => updateConnectionState(false),
    onError: (err) => {
      recordConnectionError(err.name || 'unknown');
      updateConnectionState(false);
    },
    onReconnected: () => updateConnectionState(true),
  }).catch((err) => {
    console.error('Database connection failed:', err.message);
  });
}

// App setup to get Express working
// Morgan and bodyParser are Express middleware (any incoming request will be passed into them by default)

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());

// Health check endpoints - placed BEFORE rate limiter to avoid 429 errors on K8s probes
// Liveness probe - is the process alive?
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Readiness probe - is the service ready to accept traffic?
app.get('/health/ready', (req, res) => {
  if (process.env.NODE_ENV === 'test') {
    return res
      .status(200)
      .json({ status: 'ready', timestamp: new Date().toISOString() });
  }

  const dbStatus = getDatabaseStatus();
  const isReady = dbStatus.state === 'connected';

  res.status(isReady ? 200 : 503).json({
    status: isReady ? 'ready' : 'not_ready',
    timestamp: new Date().toISOString(),
    checks: {
      database: {
        status: dbStatus.state,
        host: dbStatus.host,
        name: dbStatus.name,
      },
    },
  });
});

// Prometheus metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/signin', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Increased for development
  message: 'Too many login attempts, please try again later.',
}));
app.use('/signup', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: 'Too many registration attempts, please try again later.',
}));
app.use(limiter);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://localhost:3001'];

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow development origins
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Log rejected origins for debugging
    console.log('CORS rejected origin:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD'],
  exposedHeaders: ['Content-Length', 'X-Requested-With']
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

Router(app);

// Sentry error handler (must be after routes, before other error handlers)
app.use(sentryErrorHandler());

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(PORT);
console.log('Server listening on:', PORT);

// Graceful shutdown handling
let isShuttingDown = false;

async function gracefulShutdown(signal) {
  if (isShuttingDown) {
    console.log('Shutdown already in progress...');
    return;
  }

  isShuttingDown = true;
  console.log(`\n${signal} received. Starting graceful shutdown...`);

  // Stop accepting new connections
  server.close(async (err) => {
    if (err) {
      console.error('Error closing HTTP server:', err);
    } else {
      console.log('HTTP server closed');
    }

    // Close database connections
    try {
      await disconnectFromDatabase();
    } catch (dbErr) {
      console.error('Error closing database connection:', dbErr);
    }

    console.log('Graceful shutdown complete');
    process.exit(err ? 1 : 0);
  });

  // Force shutdown after timeout (30 seconds)
  setTimeout(() => {
    console.error('Forced shutdown due to timeout');
    process.exit(1);
  }, 30000);
}

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  gracefulShutdown('uncaughtException');
});

export default app;
