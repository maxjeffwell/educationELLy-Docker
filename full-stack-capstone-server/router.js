import passport from 'passport';
import { validationResult } from 'express-validator';
import { Signin, Signup, validateSignup, Refresh, Signout, SignoutAll } from './controllers/authentication.js';
import {
  studentValidationRules,
  mongoIdValidation,
  signinValidationRules,
  studyRecommendationsValidation,
  flashcardValidation,
  quizValidation,
  chatValidation,
  validatePaginationParams,
  validValues,
} from './middleware/validation.js';
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

  app.post('/api/signin', signinValidationRules, handleValidationErrors, requireSignin, Signin);

  app.post('/api/signup', validateSignup, handleValidationErrors, Signup);

  // Token refresh endpoint (uses refresh token cookie)
  app.post('/api/refresh', Refresh);

  // Signout - invalidates current session
  app.post('/api/signout', Signout);

  // Signout from all devices - requires authentication
  app.post('/api/signout-all', requireAuth, SignoutAll);

  // Legacy logout redirect (backward compatibility)
  app.get('/api/logout', (req, res) => {
    res.redirect(307, '/api/signout');
  });

  app.get('/api/whoami', requireAuth, (req, res) => res.json(req.user));

  // Expose valid field values for frontend dropdowns
  app.get('/api/valid-values', (req, res) => res.json(validValues));

  app.get('/api/test-auth', requireAuth, (req, res) => {
    console.log('GET /api/test-auth - User authenticated:', req.user?.email);
    res.json({
      message: 'Authentication working',
      user: req.user?.email,
      timestamp: new Date().toISOString()
    });
  });

  app.get(
    '/api/students',
    requireAuth,
    validatePaginationParams,
    async (req, res) => {
      const timings = [];
      const requestStart = performance.now();

      try {
        // Parse pagination params with defaults
        const page = Math.max(1, parseInt(req.query.page, 10) || 1);
        const limit = Math.min(
          100,
          Math.max(1, parseInt(req.query.limit, 10) || 25)
        );
        const sort = req.query.sort || 'fullName';
        const order = req.query.order === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        const dbStart = performance.now();

        // Run data query and count in parallel for efficiency
        const [students, total] = await Promise.all([
          Student.find({})
            .sort({ [sort]: order })
            .skip(skip)
            .limit(limit),
          Student.countDocuments({}),
        ]);

        const dbDuration = performance.now() - dbStart;
        timings.push(`db;dur=${dbDuration.toFixed(2)};desc="MongoDB query"`);

        const totalTime = performance.now() - requestStart;
        timings.push(`total;dur=${totalTime.toFixed(2)}`);

        res.set('Server-Timing', timings.join(', '));
        res.set(
          'Cache-Control',
          'public, s-maxage=60, stale-while-revalidate=300'
        );
        res.set('CDN-Cache-Control', 'max-age=60');

        res.json({
          data: students,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page * limit < total,
            hasPrev: page > 1,
          },
        });
      } catch (err) {
        handleServerError(res, err, 'Failed to retrieve students');
      }
    }
  );

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

  // AI-powered features with input validation
  app.post('/api/ai/study-recommendations', requireAuth, studyRecommendationsValidation, handleValidationErrors, generateStudyRecommendations);
  app.post('/api/ai/flashcard', requireAuth, flashcardValidation, handleValidationErrors, generateFlashcard);
  app.post('/api/ai/quiz', requireAuth, quizValidation, handleValidationErrors, generateQuiz);
  app.post('/api/ai/chat', requireAuth, chatValidation, handleValidationErrors, chat);
  app.get('/api/ai/health', checkAIHealth);

  // Log AI routes registration
  console.log('AI routes registered successfully');
};

export default Router;
