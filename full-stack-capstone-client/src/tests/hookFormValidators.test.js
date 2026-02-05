import { validationRules, combineRules } from '../validators/hookFormValidators';

describe('hookFormValidators', () => {
  describe('validationRules.required', () => {
    it('should have required message', () => {
      expect(validationRules.required.required).toBe('This field is required');
    });
  });

  describe('validationRules.nonEmpty', () => {
    it('should have required message', () => {
      expect(validationRules.nonEmpty.required).toBe('This field is required');
    });

    it('should pass for non-empty string', () => {
      const result = validationRules.nonEmpty.validate('hello');
      expect(result).toBe(true);
    });

    it('should fail for whitespace-only string', () => {
      const result = validationRules.nonEmpty.validate('   ');
      expect(result).toBe('This field cannot be empty');
    });

    it('should fail for empty string', () => {
      const result = validationRules.nonEmpty.validate('');
      expect(result).toBe('This field cannot be empty');
    });
  });

  describe('validationRules.email', () => {
    it('should have required message', () => {
      expect(validationRules.email.required).toBe('Email is required');
    });

    it('should have valid email pattern', () => {
      const pattern = validationRules.email.pattern.value;

      expect(pattern.test('test@example.com')).toBe(true);
      expect(pattern.test('user.name@domain.org')).toBe(true);
      expect(pattern.test('invalid')).toBe(false);
      expect(pattern.test('no@domain')).toBe(false);
      expect(pattern.test('@nodomain.com')).toBe(false);
    });

    it('should have pattern error message', () => {
      expect(validationRules.email.pattern.message).toBe('Invalid email address');
    });

    it('should pass validate for non-empty email', () => {
      const result = validationRules.email.validate('test@example.com');
      expect(result).toBe(true);
    });

    it('should fail validate for whitespace-only', () => {
      const result = validationRules.email.validate('   ');
      expect(result).toBe('Email cannot be empty');
    });
  });

  describe('validationRules.isTrimmed', () => {
    it('should pass for trimmed string', () => {
      const result = validationRules.isTrimmed.validate('hello');
      expect(result).toBe(true);
    });

    it('should fail for leading whitespace', () => {
      const result = validationRules.isTrimmed.validate(' hello');
      expect(result).toBe('Cannot start or end with whitespace');
    });

    it('should fail for trailing whitespace', () => {
      const result = validationRules.isTrimmed.validate('hello ');
      expect(result).toBe('Cannot start or end with whitespace');
    });

    it('should pass for string with internal spaces', () => {
      const result = validationRules.isTrimmed.validate('hello world');
      expect(result).toBe(true);
    });
  });

  describe('validationRules.password', () => {
    it('should use default min/max lengths', () => {
      const rules = validationRules.password();

      expect(rules.required).toBe('Password is required');
      expect(rules.minLength.value).toBe(8);
      expect(rules.maxLength.value).toBe(72);
    });

    it('should accept custom min/max lengths', () => {
      const rules = validationRules.password(10, 50);

      expect(rules.minLength.value).toBe(10);
      expect(rules.minLength.message).toBe('Your password must be at least 10 characters long');
      expect(rules.maxLength.value).toBe(50);
      expect(rules.maxLength.message).toBe('Your password can be at most 50 characters long');
    });

    it('should pass validate for trimmed password', () => {
      const rules = validationRules.password();
      const result = rules.validate('password123');
      expect(result).toBe(true);
    });

    it('should fail validate for password with leading/trailing whitespace', () => {
      const rules = validationRules.password();
      const result = rules.validate(' password123 ');
      expect(result).toBe('Password cannot start or end with whitespace');
    });
  });

  describe('validationRules.passwordConfirmation', () => {
    it('should have required message', () => {
      expect(validationRules.passwordConfirmation.required).toBe('Please confirm your password');
    });

    it('should fail if value is empty', () => {
      const result = validationRules.passwordConfirmation.validate('', { password: 'test123' });
      expect(result).toBe('Please confirm your password');
    });

    it('should fail if value is whitespace only', () => {
      const result = validationRules.passwordConfirmation.validate('   ', { password: 'test123' });
      expect(result).toBe('This field cannot be empty');
    });

    it('should fail if passwords do not match', () => {
      const result = validationRules.passwordConfirmation.validate('different', { password: 'test123' });
      expect(result).toBe('The passwords do not match');
    });

    it('should pass if passwords match', () => {
      const result = validationRules.passwordConfirmation.validate('test123', { password: 'test123' });
      expect(result).toBe(true);
    });
  });

  describe('combineRules', () => {
    it('should combine simple rules', () => {
      const combined = combineRules(
        { required: 'Field required' },
        { minLength: { value: 5, message: 'Too short' } }
      );

      expect(combined.required).toBe('Field required');
      expect(combined.minLength).toEqual({ value: 5, message: 'Too short' });
    });

    it('should override same keys with later rules', () => {
      const combined = combineRules(
        { required: 'First message' },
        { required: 'Second message' }
      );

      expect(combined.required).toBe('Second message');
    });

    it('should combine multiple validate functions', async () => {
      const rule1 = {
        validate: value => (value.length >= 3 ? true : 'Too short'),
      };
      const rule2 = {
        validate: value => (value.includes('@') ? true : 'Must contain @'),
      };

      const combined = combineRules(rule1, rule2);

      // Test that both validators run
      expect(await combined.validate('ab')).toBe('Too short');
      expect(await combined.validate('abc')).toBe('Must contain @');
      expect(await combined.validate('abc@')).toBe(true);
    });

    it('should return empty object for no rules', () => {
      const combined = combineRules();
      expect(combined).toEqual({});
    });
  });
});
