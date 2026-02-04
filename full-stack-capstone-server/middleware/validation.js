import { body, param } from 'express-validator';
import mongoose from 'mongoose';

// =============================================================================
// Constants for enum validation
// =============================================================================

const VALID_ELL_STATUSES = ['Active', 'Former', 'Never', 'Monitored', 'Exited', 'Waived'];
const VALID_DESIGNATIONS = ['ELL', 'RFEP', 'IFEP', 'EO', 'TBD'];
const VALID_COMPOSITE_LEVELS = ['Beginning', 'Early Intermediate', 'Intermediate', 'Early Advanced', 'Advanced', 'N/A'];
const VALID_GENDERS = ['Male', 'Female', 'Non-binary', 'Other', 'Prefer not to say'];
const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];
const VALID_USER_ROLES = ['teacher', 'student', 'admin'];
const VALID_CHAT_ROLES = ['user', 'assistant', 'system'];

// =============================================================================
// Sanitization helpers
// =============================================================================

/**
 * Sanitize text to prevent prompt injection in AI contexts
 * Removes or escapes potentially dangerous patterns
 */
const sanitizeForPrompt = (value) => {
  if (typeof value !== 'string') return value;
  return value
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/\{\{.*?\}\}/g, '') // Remove template-like patterns
    .replace(/\[\[.*?\]\]/g, '') // Remove wiki-like patterns
    .trim()
    .slice(0, 1000); // Enforce max length
};

// =============================================================================
// Student validation rules
// =============================================================================

export const studentValidationRules = [
  body('fullName')
    .trim()
    .escape()
    .isLength({ min: 1, max: 100 })
    .withMessage('Full name is required and must be less than 100 characters'),

  body('ellStatus')
    .trim()
    .isIn(VALID_ELL_STATUSES)
    .withMessage(`ELL status must be one of: ${VALID_ELL_STATUSES.join(', ')}`),

  body('designation')
    .trim()
    .isIn(VALID_DESIGNATIONS)
    .withMessage(`Designation must be one of: ${VALID_DESIGNATIONS.join(', ')}`),

  body('gradeLevel')
    .optional()
    .isInt({ min: 1, max: 12 })
    .toInt()
    .withMessage('Grade level must be between 1 and 12'),

  body('school')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage('School name must be less than 100 characters'),

  body('teacher')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage('Teacher name must be less than 100 characters'),

  body('studentId')
    .optional()
    .isInt({ min: 1 })
    .toInt()
    .withMessage('Student ID must be a positive integer'),

  body('dateOfBirth')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Date of birth must be a valid date'),

  body('gender')
    .optional()
    .trim()
    .isIn(VALID_GENDERS)
    .withMessage(`Gender must be one of: ${VALID_GENDERS.join(', ')}`),

  body('race')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 50 })
    .withMessage('Race must be less than 50 characters'),

  body('nativeLanguage')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 50 })
    .withMessage('Native language must be less than 50 characters'),

  body('cityOfBirth')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage('City of birth must be less than 100 characters'),

  body('countryOfBirth')
    .optional()
    .trim()
    .escape()
    .isLength({ max: 100 })
    .withMessage('Country of birth must be less than 100 characters'),

  body('compositeLevel')
    .optional()
    .trim()
    .isIn(VALID_COMPOSITE_LEVELS)
    .withMessage(`Composite level must be one of: ${VALID_COMPOSITE_LEVELS.join(', ')}`),

  body('active')
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage('Active must be a boolean value'),
];

// =============================================================================
// MongoDB ID validation
// =============================================================================

export const mongoIdValidation = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid ID format');
    }
    return true;
  }),
];

// =============================================================================
// Authentication validation rules
// =============================================================================

export const signinValidationRules = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

// =============================================================================
// AI route validation rules
// =============================================================================

/**
 * Validation for POST /api/ai/study-recommendations
 */
export const studyRecommendationsValidation = [
  body('gradeLevel')
    .isInt({ min: 1, max: 12 })
    .toInt()
    .withMessage('Grade level is required and must be between 1 and 12'),

  body('compositeLevel')
    .optional()
    .trim()
    .customSanitizer(sanitizeForPrompt)
    .isLength({ max: 50 })
    .withMessage('Composite level must be less than 50 characters'),

  body('ellStatus')
    .optional()
    .trim()
    .customSanitizer(sanitizeForPrompt)
    .isLength({ max: 50 })
    .withMessage('ELL status must be less than 50 characters'),

  body('nativeLanguage')
    .optional()
    .trim()
    .customSanitizer(sanitizeForPrompt)
    .isLength({ max: 50 })
    .withMessage('Native language must be less than 50 characters'),
];

/**
 * Validation for POST /api/ai/flashcard
 */
export const flashcardValidation = [
  body('topic')
    .trim()
    .customSanitizer(sanitizeForPrompt)
    .isLength({ min: 1, max: 200 })
    .withMessage('Topic is required and must be less than 200 characters'),

  body('content')
    .trim()
    .customSanitizer(sanitizeForPrompt)
    .isLength({ min: 1, max: 1000 })
    .withMessage('Content is required and must be less than 1000 characters'),

  body('gradeLevel')
    .optional()
    .isInt({ min: 1, max: 12 })
    .toInt()
    .withMessage('Grade level must be between 1 and 12'),
];

/**
 * Validation for POST /api/ai/quiz
 */
export const quizValidation = [
  body('topic')
    .trim()
    .customSanitizer(sanitizeForPrompt)
    .isLength({ min: 1, max: 200 })
    .withMessage('Topic is required and must be less than 200 characters'),

  body('difficulty')
    .optional()
    .trim()
    .isIn(VALID_DIFFICULTIES)
    .withMessage(`Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`),

  body('count')
    .optional()
    .isInt({ min: 1, max: 10 })
    .toInt()
    .withMessage('Count must be between 1 and 10'),

  body('gradeLevel')
    .optional()
    .isInt({ min: 1, max: 12 })
    .toInt()
    .withMessage('Grade level must be between 1 and 12'),
];

/**
 * Validation for POST /api/ai/chat
 */
export const chatValidation = [
  body('messages')
    .isArray({ min: 1, max: 50 })
    .withMessage('Messages must be an array with 1-50 items'),

  body('messages.*.role')
    .isIn(VALID_CHAT_ROLES)
    .withMessage(`Message role must be one of: ${VALID_CHAT_ROLES.join(', ')}`),

  body('messages.*.content')
    .trim()
    .customSanitizer(sanitizeForPrompt)
    .isLength({ min: 1, max: 2000 })
    .withMessage('Message content must be between 1 and 2000 characters'),

  body('context')
    .optional()
    .isObject()
    .withMessage('Context must be an object'),

  body('context.userRole')
    .optional()
    .isIn(VALID_USER_ROLES)
    .withMessage(`User role must be one of: ${VALID_USER_ROLES.join(', ')}`),

  body('context.gradeLevel')
    .optional()
    .isInt({ min: 1, max: 12 })
    .toInt()
    .withMessage('Grade level must be between 1 and 12'),

  body('context.ellStatus')
    .optional()
    .trim()
    .customSanitizer(sanitizeForPrompt)
    .isLength({ max: 50 })
    .withMessage('ELL status must be less than 50 characters'),

  body('context.nativeLanguage')
    .optional()
    .trim()
    .customSanitizer(sanitizeForPrompt)
    .isLength({ max: 50 })
    .withMessage('Native language must be less than 50 characters'),

  body('context.studentId')
    .optional()
    .custom((value) => {
      if (value && !mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid student ID format');
      }
      return true;
    }),
];

// =============================================================================
// Export valid values for use in other modules (e.g., frontend)
// =============================================================================

export const validValues = {
  ellStatuses: VALID_ELL_STATUSES,
  designations: VALID_DESIGNATIONS,
  compositeLevels: VALID_COMPOSITE_LEVELS,
  genders: VALID_GENDERS,
  difficulties: VALID_DIFFICULTIES,
  userRoles: VALID_USER_ROLES,
};
