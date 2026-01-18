import 'dotenv/config.js';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import client from 'prom-client';
import Router from './router.js';
import validateEnvironment from './utils/envValidation.js';

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
  registers: [register]
});

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

if (process.env.NODE_ENV !== 'test') {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/local');
}

// App setup to get Express working
// Morgan and bodyParser are Express middleware (any incoming request will be passed into them by default)

app.use(helmet());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '10mb' }));

// Health check endpoint - placed BEFORE rate limiter to avoid 429 errors on K8s probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
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

const PORT = process.env.PORT || 8080;
const server = http.createServer(app);

server.listen(PORT);
console.log('Server listening on:', PORT);

export default app;
