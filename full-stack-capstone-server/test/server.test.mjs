import * as chai from 'chai';
import request from 'supertest';

import app from '../index.js';

const { expect } = chai;

describe('Reality Check', () => {
  it('true should be true', () => {
    expect(true).to.be.true; // eslint-disable-line no-unused-expressions
  });

  it('2 + 2 should equal 4', () => {
    expect(2 + 2).to.equal(4);
  });
});

describe('Basic Express setup', () => {
  describe('404 handler', () => {
    it('should respond with 404 when given a bad path', () => request(app)
      .get('/bad/path')
      .then((res) => {
        expect(res.status).to.equal(404);
      }));
  });
});
