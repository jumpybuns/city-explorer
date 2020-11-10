require('dotenv').config();
import geos from './geos';
import mungeLocation from './utils.js';
// const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
// const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    // let token;
  
    // beforeAll(async done => {
    //   execSync('npm run setup-db');
  
    //   client.connect();
  
    //   const signInData = await fakeRequest(app)
    //     .post('/auth/signup')
    //     .send({
    //       email: 'jon@user.com',
    //       password: '1234'
    //     });
      
    //   token = signInData.body.token;
  
    //   return done();
    // });
  
    // afterAll(done => {
    //   return client.end(done);
    // });

    test('returns location', async() => {

      const expectation = [
        {
          'lat': '45.5202471',
          'lon': '-122.6741949',
          'display_name': 'Portland, Multnomah County, Oregon, USA',
        }
      ];

      const data = await fakeRequest(app)
        .get('/location')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
  });
});
