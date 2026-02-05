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

const Router = (app) => {
  // Health check endpoint moved to index.js (before rate limiter)

  app.get('/', requireAuth, (req, res) => {
    res.send('GET request to homepage');
  });

  /**
   * @swagger
   * /api/signin:
   *   post:
   *     summary: User login
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SigninRequest'
   *     responses:
   *       200:
   *         description: Login successful, sets httpOnly cookie
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       401:
   *         description: Invalid credentials
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Error'
   */
  app.post('/api/signin', signinValidationRules, handleValidationErrors, requireSignin, Signin);

  /**
   * @swagger
   * /api/signup:
   *   post:
   *     summary: Register new user
   *     tags: [Authentication]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/SignupRequest'
   *     responses:
   *       201:
   *         description: Registration successful
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/AuthResponse'
   *       422:
   *         description: Email already in use
   *       400:
   *         description: Validation error
   */
  app.post('/api/signup', validateSignup, handleValidationErrors, Signup);

  /**
   * @swagger
   * /api/refresh:
   *   post:
   *     summary: Refresh access token
   *     tags: [Authentication]
   *     description: Uses refresh token from httpOnly cookie to issue new access token
   *     responses:
   *       200:
   *         description: New access token issued
   *       401:
   *         description: Invalid or expired refresh token
   */
  app.post('/api/refresh', Refresh);

  /**
   * @swagger
   * /api/signout:
   *   post:
   *     summary: Logout current session
   *     tags: [Authentication]
   *     description: Invalidates current session and clears cookies
   *     responses:
   *       200:
   *         description: Logout successful
   */
  app.post('/api/signout', Signout);

  /**
   * @swagger
   * /api/signout-all:
   *   post:
   *     summary: Logout from all devices
   *     tags: [Authentication]
   *     security:
   *       - cookieAuth: []
   *     description: Revokes all refresh tokens for the user
   *     responses:
   *       200:
   *         description: All sessions invalidated
   *       401:
   *         description: Not authenticated
   */
  app.post('/api/signout-all', requireAuth, SignoutAll);

  // Legacy logout redirect (backward compatibility)
  app.get('/api/logout', (req, res) => {
    res.redirect(307, '/api/signout');
  });

  /**
   * @swagger
   * /api/whoami:
   *   get:
   *     summary: Get current user info
   *     tags: [Authentication]
   *     security:
   *       - cookieAuth: []
   *     responses:
   *       200:
   *         description: Current user information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/User'
   *       401:
   *         description: Not authenticated
   */
  app.get('/api/whoami', requireAuth, (req, res) => res.json(req.user));

  /**
   * @swagger
   * /api/valid-values:
   *   get:
   *     summary: Get valid enum values
   *     tags: [Utility]
   *     description: Returns valid values for dropdown fields (ellStatuses, designations, etc.)
   *     responses:
   *       200:
   *         description: Valid field values
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ValidValues'
   */
  app.get('/api/valid-values', (req, res) => res.json(validValues));

  /**
   * @swagger
   * /api/test-auth:
   *   get:
   *     summary: Test authentication
   *     tags: [Utility]
   *     security:
   *       - cookieAuth: []
   *     description: Verifies JWT authentication is working
   *     responses:
   *       200:
   *         description: Authentication verified
   *       401:
   *         description: Not authenticated
   */
  app.get('/api/test-auth', requireAuth, (req, res) => {
    console.log('GET /api/test-auth - User authenticated:', req.user?.email);
    res.json({
      message: 'Authentication working',
      user: req.user?.email,
      timestamp: new Date().toISOString(),
    });
  });

  /**
   * @swagger
   * /api/students:
   *   get:
   *     summary: Get paginated list of students
   *     tags: [Students]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Page number (1-based)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           default: 25
   *           maximum: 100
   *         description: Items per page
   *       - in: query
   *         name: sort
   *         schema:
   *           type: string
   *           default: fullName
   *           enum: [fullName, ellStatus, gradeLevel, teacher, school, active, createdAt]
   *         description: Sort field
   *       - in: query
   *         name: order
   *         schema:
   *           type: string
   *           default: asc
   *           enum: [asc, desc]
   *         description: Sort order
   *     responses:
   *       200:
   *         description: Paginated student list
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PaginatedStudents'
   *       401:
   *         description: Not authenticated
   *       400:
   *         description: Invalid pagination parameters
   */
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

  /**
   * @swagger
   * /api/students/{id}:
   *   get:
   *     summary: Get student by ID
   *     tags: [Students]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: MongoDB ObjectId
   *     responses:
   *       200:
   *         description: Student details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Student'
   *       404:
   *         description: Student not found
   *       401:
   *         description: Not authenticated
   */
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

  /**
   * @swagger
   * /api/students:
   *   post:
   *     summary: Create new student
   *     tags: [Students]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/StudentInput'
   *     responses:
   *       200:
   *         description: Student created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Student'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Not authenticated
   */
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

  /**
   * @swagger
   * /api/students/{id}:
   *   put:
   *     summary: Update student
   *     tags: [Students]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: MongoDB ObjectId
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/StudentInput'
   *     responses:
   *       200:
   *         description: Student updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 message:
   *                   type: string
   *                 result:
   *                   $ref: '#/components/schemas/Student'
   *       404:
   *         description: Student not found
   *       400:
   *         description: Validation error
   *       401:
   *         description: Not authenticated
   */
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

  /**
   * @swagger
   * /api/students/{id}:
   *   delete:
   *     summary: Delete student
   *     tags: [Students]
   *     security:
   *       - cookieAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: MongoDB ObjectId
   *     responses:
   *       204:
   *         description: Student deleted successfully
   *       404:
   *         description: Student not found
   *       401:
   *         description: Not authenticated
   */
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
  /**
   * @swagger
   * /api/ai/study-recommendations:
   *   post:
   *     summary: Generate study recommendations
   *     tags: [AI Features]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/StudyRecommendationsRequest'
   *     responses:
   *       200:
   *         description: Study recommendations generated
   *       401:
   *         description: Not authenticated
   *       503:
   *         description: AI gateway unavailable
   */
  app.post('/api/ai/study-recommendations', requireAuth, studyRecommendationsValidation, handleValidationErrors, generateStudyRecommendations);

  /**
   * @swagger
   * /api/ai/flashcard:
   *   post:
   *     summary: Generate flashcard
   *     tags: [AI Features]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/FlashcardRequest'
   *     responses:
   *       200:
   *         description: Flashcard generated
   *       401:
   *         description: Not authenticated
   *       503:
   *         description: AI gateway unavailable
   */
  app.post('/api/ai/flashcard', requireAuth, flashcardValidation, handleValidationErrors, generateFlashcard);

  /**
   * @swagger
   * /api/ai/quiz:
   *   post:
   *     summary: Generate quiz questions
   *     tags: [AI Features]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/QuizRequest'
   *     responses:
   *       200:
   *         description: Quiz questions generated
   *       401:
   *         description: Not authenticated
   *       503:
   *         description: AI gateway unavailable
   */
  app.post('/api/ai/quiz', requireAuth, quizValidation, handleValidationErrors, generateQuiz);

  /**
   * @swagger
   * /api/ai/chat:
   *   post:
   *     summary: Chat with AI assistant
   *     tags: [AI Features]
   *     security:
   *       - cookieAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChatRequest'
   *     responses:
   *       200:
   *         description: AI response
   *       401:
   *         description: Not authenticated
   *       503:
   *         description: AI gateway unavailable
   */
  app.post('/api/ai/chat', requireAuth, chatValidation, handleValidationErrors, chat);

  /**
   * @swagger
   * /api/ai/health:
   *   get:
   *     summary: Check AI gateway health
   *     tags: [AI Features]
   *     responses:
   *       200:
   *         description: AI gateway is healthy
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/HealthCheck'
   *       503:
   *         description: AI gateway unavailable
   */
  app.get('/api/ai/health', checkAIHealth);

  // Log AI routes registration
  console.log('AI routes registered successfully');
};

export default Router;
