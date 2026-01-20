import passport from 'passport';
import { validationResult } from 'express-validator';
import { Signin, Signup, validateSignup } from './controllers/authentication.js';
import { studentValidationRules, mongoIdValidation } from './middleware/validation.js';
import {
  generateStudyRecommendations,
  generateFlashcard,
  generateQuiz,
  chat,
  checkAIHealth
} from './routes/ai-routes.js';
import { purgeStudentsCache } from './utils/cloudflare.js';

// Create an object and insert it between our incoming request and our route handler (i.e. Passport middleware - requireAuth)

import Student from './models/student.js';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation failed',
      details: errors.array().map((err) => ({ field: err.path, message: err.msg })),
    });
  }
  return next();
};

const handleServerError = (res, err, message = 'Internal server error') => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({ error: message });
  }
  return res.status(500).json({ error: message, details: err.message });
};

const requireAuth = passport.authenticate('jwt', { session: false }); // When a user is authenticated don't try to create a session for them
// (by default, Passport tries to make a cookie-based session for the request - we're using tokens)

const requireSignin = passport.authenticate('local', { session: false });

const Router = (app) => { // Inside this function we have access to our Express app
  // Health check endpoint moved to index.js (before rate limiter)

  app.get('/', requireAuth, (req, res) => {
    res.send('GET request to homepage');
  });

  app.post('/api/signin', requireSignin, Signin);

  app.post('/api/signup', validateSignup, handleValidationErrors, Signup);

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/api/whoami', requireAuth, (req, res) => res.json(req.user));

  app.get('/api/test-auth', requireAuth, (req, res) => {
    console.log('GET /api/test-auth - User authenticated:', req.user?.email);
    res.json({
      message: 'Authentication working',
      user: req.user?.email,
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/students', requireAuth, async (req, res) => {
    const timings = [];
    const requestStart = performance.now();

    try {
      const dbStart = performance.now();
      const result = await Student.find({});
      const dbDuration = performance.now() - dbStart;
      timings.push(`db;dur=${dbDuration.toFixed(2)};desc="MongoDB query"`);

      const total = performance.now() - requestStart;
      timings.push(`total;dur=${total.toFixed(2)}`);

      res.set('Server-Timing', timings.join(', '));
      res.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      res.set('CDN-Cache-Control', 'max-age=60');
      res.json(result);
    } catch (err) {
      handleServerError(res, err, 'Failed to retrieve students');
    }
  });

  app.get('/api/students/:id', requireAuth, mongoIdValidation, handleValidationErrors, (req, res) => {
    Student.findById(req.params.id)
      .then((result) => {
        if (!result) {
          return res.status(404).json({ error: 'Student not found' });
        }
        return res.json(result);
      })
      .catch((err) => handleServerError(res, err, 'Failed to retrieve student'));
  });

  app.post('/api/students', requireAuth, studentValidationRules, handleValidationErrors, async (req, res) => {
    const newStudent = {
      fullName: req.body.fullName,
      school: req.body.school,
      studentId: req.body.studentId,
      teacher: req.body.teacher,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      race: req.body.race,
      gradeLevel: req.body.gradeLevel,
      nativeLanguage: req.body.nativeLanguage,
      cityOfBirth: req.body.cityOfBirth,
      countryOfBirth: req.body.countryOfBirth,
      ellStatus: req.body.ellStatus,
      compositeLevel: req.body.compositeLevel,
      active: req.body.active,
      designation: req.body.designation,
    };

    try {
      await Student.create(newStudent);
      const result = await Student.find({});
      await purgeStudentsCache();
      res.json(result);
    } catch (err) {
      handleServerError(res, err, 'Failed to create student');
    }
  });

  app.put('/api/students/:id', requireAuth, mongoIdValidation, studentValidationRules, handleValidationErrors, async (req, res) => {
    const updatedStudent = {
      fullName: req.body.fullName,
      school: req.body.school,
      studentId: req.body.studentId,
      teacher: req.body.teacher,
      dateOfBirth: req.body.dateOfBirth,
      gender: req.body.gender,
      race: req.body.race,
      gradeLevel: req.body.gradeLevel,
      nativeLanguage: req.body.nativeLanguage,
      cityOfBirth: req.body.cityOfBirth,
      countryOfBirth: req.body.countryOfBirth,
      ellStatus: req.body.ellStatus,
      compositeLevel: req.body.compositeLevel,
      active: req.body.active,
      designation: req.body.designation,
    };

    try {
      const result = await Student.findOneAndUpdate({ _id: req.params.id }, updatedStudent, { new: true });
      if (!result) {
        return res.status(404).json({ error: 'Student not found' });
      }
      // Await cache purge to ensure subsequent fetches get fresh data
      await purgeStudentsCache();
      return res.json({
        success: true,
        message: 'Updated successfully',
        result,
      });
    } catch (err) {
      return handleServerError(res, err, 'Failed to update student');
    }
  });

  app.delete('/api/students/:id', requireAuth, mongoIdValidation, handleValidationErrors, async (req, res) => {
    try {
      const result = await Student.findOneAndDelete({ _id: req.params.id });
      if (!result) {
        return res.status(404).json({ error: 'Student not found' });
      }
      await purgeStudentsCache();
      return res.status(204).end();
    } catch (err) {
      return handleServerError(res, err, 'Failed to delete student');
    }
  });

  // AI-powered features
  app.post('/api/ai/study-recommendations', requireAuth, generateStudyRecommendations);
  app.post('/api/ai/flashcard', requireAuth, generateFlashcard);
  app.post('/api/ai/quiz', requireAuth, generateQuiz);
  app.post('/api/ai/chat', requireAuth, chat);
  app.get('/api/ai/health', checkAIHealth);

  // Log AI routes registration
  console.log('AI routes registered successfully');
};

export default Router;
