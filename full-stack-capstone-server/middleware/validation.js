import { body, param } from 'express-validator';
import mongoose from 'mongoose';

// Common validation rules
export const studentValidationRules = [
  body('fullName').trim().isLength({ min: 1, max: 100 }).withMessage('Full name is required and must be less than 100 characters'),
  body('ellStatus').trim().isLength({ min: 1 }).withMessage('ELL status is required'),
  body('designation').trim().isLength({ min: 1 }).withMessage('Designation is required'),
  body('gradeLevel').optional().isInt({ min: 1, max: 12 }).withMessage('Grade level must be between 1 and 12'),
  body('school').optional().trim().isLength({ max: 100 })
    .escape()
    .withMessage('School name must be less than 100 characters'),
  body('teacher').optional().trim().isLength({ max: 100 })
    .escape()
    .withMessage('Teacher name must be less than 100 characters'),
  body('studentId').optional().isInt({ min: 1 }).withMessage('Student ID must be a positive integer'),
  body('dateOfBirth').optional().isISO8601().withMessage('Date of birth must be a valid date'),
  body('gender').optional().trim().isLength({ max: 20 })
    .withMessage('Gender must be less than 20 characters'),
  body('race').optional().trim().isLength({ max: 50 })
    .withMessage('Race must be less than 50 characters'),
  body('nativeLanguage').optional().trim().isLength({ max: 50 })
    .withMessage('Native language must be less than 50 characters'),
  body('cityOfBirth').optional().trim().isLength({ max: 100 })
    .withMessage('City of birth must be less than 100 characters'),
  body('countryOfBirth').optional().trim().isLength({ max: 100 })
    .withMessage('Country of birth must be less than 100 characters'),
  body('compositeLevel').optional().trim().isLength({ max: 20 })
    .withMessage('Composite level must be less than 20 characters'),
  body('active').optional().isBoolean().withMessage('Active must be a boolean value'),
];

export const mongoIdValidation = [
  param('id').custom((value) => {
    if (!mongoose.Types.ObjectId.isValid(value)) {
      throw new Error('Invalid ID format');
    }
    return true;
  }),
];

export const authValidationRules = [
  body('email').isEmail().normalizeEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
];
