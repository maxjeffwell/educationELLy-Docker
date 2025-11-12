import mongoose from 'mongoose';
import chai from 'chai';
import request from 'supertest';

import app from '../index.js';
import User from '../models/user.js';

const { expect } = chai;

describe('educationELLy API - Users', () => {
  const email = 'example@example.com';
  const password = 'ExamplePass123';

  before(() => mongoose.connect(process.env.TEST_MONGODB_URI)
    .then(() => mongoose.connection.db.dropDatabase()));

  beforeEach(() => User.createIndexes());

  afterEach(() => mongoose.connection.db.dropDatabase());

  after(() => mongoose.disconnect());

  describe('/signup', () => {
    describe('POST', () => {
      it('Should create a new user', () => {
        const testUser = { email, password };

        let res;
        return request(app)
          .post('/signup')
          .send(testUser)
          .then((_res) => {
            res = _res;
            expect(res.status).to.equal(200);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys('token');
          });
      });
    });
  });
});
