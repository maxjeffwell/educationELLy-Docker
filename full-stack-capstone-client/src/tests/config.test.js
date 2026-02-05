describe('config', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should use REACT_APP_API_URL if defined', () => {
    process.env.REACT_APP_API_URL = 'https://api.example.com';
    process.env.NODE_ENV = 'development';

    const { API_BASE_URL } = require('../config');

    expect(API_BASE_URL).toBe('https://api.example.com');
  });

  it('should use REACT_APP_API_BASE_URL as fallback', () => {
    delete process.env.REACT_APP_API_URL;
    process.env.REACT_APP_API_BASE_URL = 'https://fallback.example.com';
    process.env.NODE_ENV = 'development';

    const { API_BASE_URL } = require('../config');

    expect(API_BASE_URL).toBe('https://fallback.example.com');
  });

  it('should use /api in production when no env vars set', () => {
    delete process.env.REACT_APP_API_URL;
    delete process.env.REACT_APP_API_BASE_URL;
    process.env.NODE_ENV = 'production';

    const { API_BASE_URL } = require('../config');

    expect(API_BASE_URL).toBe('/api');
  });

  it('should use localhost:8080 in development when no env vars set', () => {
    delete process.env.REACT_APP_API_URL;
    delete process.env.REACT_APP_API_BASE_URL;
    process.env.NODE_ENV = 'development';

    const { API_BASE_URL } = require('../config');

    expect(API_BASE_URL).toBe('http://localhost:8080');
  });

  it('should allow empty string for relative URLs', () => {
    process.env.REACT_APP_API_URL = '';
    process.env.NODE_ENV = 'production';

    const { API_BASE_URL } = require('../config');

    expect(API_BASE_URL).toBe('');
  });
});
