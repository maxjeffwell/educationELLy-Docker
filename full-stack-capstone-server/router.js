import passport from 'passport';
import { validationResult } from 'express-validator';
import { Signin, Signup, validateSignup } from './controllers/authentication.js';
import { studentValidationRules, mongoIdValidation } from './middleware/validation.js';

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
  app.get('/', requireAuth, (req, res) => {
    res.send('GET request to homepage');
  });

  app.post('/signin', requireSignin, Signin);

  app.post('/signup', validateSignup, handleValidationErrors, Signup);

  app.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
  });

  app.get('/whoami', requireAuth, (req, res) => res.json(req.user));

  app.get('/test-auth', requireAuth, (req, res) => {
    console.log('GET /test-auth - User authenticated:', req.user?.email);
    res.json({ 
      message: 'Authentication working', 
      user: req.user?.email,
      timestamp: new Date().toISOString()
    });
  });

  app.get('/students', requireAuth, (req, res) => {
    Student.find({})
      .then((result) => res.json(result))
      .catch((err) => handleServerError(res, err, 'Failed to retrieve students'));
  });

  app.get('/students/:id', requireAuth, mongoIdValidation, handleValidationErrors, (req, res) => {
    Student.findById(req.params.id)
      .then((result) => {
        if (!result) {
          return res.status(404).json({ error: 'Student not found' });
        }
        return res.json(result);
      })
      .catch((err) => handleServerError(res, err, 'Failed to retrieve student'));
  });

  app.post('/students', requireAuth, studentValidationRules, handleValidationErrors, (req, res) => {
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

    Student.create(newStudent)
      .then(() => Student.find({}))
      .then((result) => res.json(result))
      .catch((err) => handleServerError(res, err, 'Failed to create student'));
  });

  app.put('/students/:id', requireAuth, mongoIdValidation, studentValidationRules, handleValidationErrors, (req, res) => {
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

    Student.findOneAndUpdate({ _id: req.params.id }, updatedStudent, { new: true })
      .then((result) => {
        if (!result) {
          return res.status(404).json({ error: 'Student not found' });
        }
        return res.json({
          success: true,
          message: 'Updated successfully',
          result,
        });
      })
      .catch((err) => handleServerError(res, err, 'Failed to update student'));
  });

  app.delete('/students/:id', requireAuth, mongoIdValidation, handleValidationErrors, (req, res) => {
    Student.findOneAndDelete({ _id: req.params.id })
      .then((result) => {
        if (!result) {
          return res.status(404).json({ error: 'Student not found' });
        }
        return res.status(204).end();
      })
      .catch((err) => handleServerError(res, err, 'Failed to delete student'));
  });
};

export default Router;
