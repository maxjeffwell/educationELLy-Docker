import { required, nonEmpty, isTrimmed, length, matches } from '../validators';

describe('validators (legacy)', () => {
  describe('required', () => {
    it('should return undefined for truthy value', () => {
      expect(required('hello')).toBeUndefined();
      expect(required('0')).toBeUndefined();
      expect(required(1)).toBeUndefined();
    });

    it('should return error for falsy value', () => {
      expect(required('')).toBe('This field is required');
      expect(required(null)).toBe('This field is required');
      expect(required(undefined)).toBe('This field is required');
    });
  });

  describe('nonEmpty', () => {
    it('should return undefined for non-empty string', () => {
      expect(nonEmpty('hello')).toBeUndefined();
      expect(nonEmpty('  hello  ')).toBeUndefined();
    });

    it('should return error for whitespace-only string', () => {
      expect(nonEmpty('   ')).toBe('This field cannot be empty');
      expect(nonEmpty('')).toBe('This field cannot be empty');
    });
  });

  describe('isTrimmed', () => {
    it('should return undefined for trimmed string', () => {
      expect(isTrimmed('hello')).toBeUndefined();
      expect(isTrimmed('hello world')).toBeUndefined();
    });

    it('should return error for untrimmed string', () => {
      expect(isTrimmed(' hello')).toBe('Cannot start or end with whitespace');
      expect(isTrimmed('hello ')).toBe('Cannot start or end with whitespace');
      expect(isTrimmed(' hello ')).toBe('Cannot start or end with whitespace');
    });
  });

  describe('length', () => {
    it('should return undefined when within min/max bounds', () => {
      const validator = length({ min: 3, max: 10 });
      expect(validator('hello')).toBeUndefined();
      expect(validator('abc')).toBeUndefined();
      expect(validator('1234567890')).toBeUndefined();
    });

    it('should return error when below min length', () => {
      const validator = length({ min: 5 });
      expect(validator('hi')).toBe('Your password must be at least 5 characters long');
    });

    it('should return error when above max length', () => {
      const validator = length({ max: 5 });
      expect(validator('toolongpassword')).toBe('Your password can be at most 5 characters long');
    });

    it('should handle only min constraint', () => {
      const validator = length({ min: 3 });
      expect(validator('ab')).toBe('Your password must be at least 3 characters long');
      expect(validator('abc')).toBeUndefined();
      expect(validator('verylongstring')).toBeUndefined();
    });

    it('should handle only max constraint', () => {
      const validator = length({ max: 5 });
      expect(validator('hi')).toBeUndefined();
      expect(validator('hello')).toBeUndefined();
      expect(validator('toolong')).toBe('Your password can be at most 5 characters long');
    });
  });

  describe('matches', () => {
    it('should return undefined when fields match', () => {
      const validator = matches('password');
      const allValues = { password: 'secret123' };

      expect(validator('secret123', allValues)).toBeUndefined();
    });

    it('should return undefined when fields match with whitespace trimmed', () => {
      const validator = matches('password');
      const allValues = { password: 'secret123 ' };

      expect(validator(' secret123', allValues)).toBeUndefined();
    });

    it('should return error when fields do not match', () => {
      const validator = matches('password');
      const allValues = { password: 'secret123' };

      expect(validator('different', allValues)).toBe('The passwords do not match');
    });

    it('should return error when target field does not exist', () => {
      const validator = matches('password');
      const allValues = { email: 'test@example.com' };

      expect(validator('anything', allValues)).toBe('The passwords do not match');
    });
  });
});
