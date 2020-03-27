const request = require('supertest');
const db = require('../database/dbConfig.js');
const AuthUtils = require('../auth/auth-model.js');
const server = require('../api/server.js');

// describe('My API tests', function() {
//   var token = null;

//   before(function(done) {
//     request(url)
//       .post('/api/auth/login')
//       .send({ username:"Forscience", password:Doctowhat? })
//       .end(function(err, res) {
//         token = res.body.token; // Or something
//         done();
//       });
//   });

//   it('should get a valid token for user: user1', function(done) {
//     request('/api/auth/login')
//       .set('Authorization', 'Bearer ' + token)
//       .expect(200, done);
//   });
// });

describe('user model', () => {
  it('shoud test user regiations', async () => {
    AuthUtils.add({ username: 'Emberus', password: 'WoodyWoodPecker' });

    const users = await db('users');
    expect(users).toHaveLength(1);
  });

  it('should test user logging in', async () => {});

  describe('should test registring and loggin in', () => {
    it('should register users', async () => {
      const newUser = { username: 'Emberus', password: 'WoodyWoodPecker' };
      const res = await request(server)
        .post('/api/auth/register')
        .send(newUser);
      expect(res.status).toBe(200);
    });

    it('should test the login function', async () => {
      const credential = { username: 'Forscience', password: 'DoctorWhat?' };
      await request(server)
        .post('/api/auth/register')
        .send(credential);
      const res = await request(server)
        .post('/api/auth/login')
        .send(credential);

      expect(res.status).toBe(200);
    });
  });
});

describe('GET /api/jokes', () => {
  it('should return json type', async () => {
    const res = await request(server).get('/api/jokes');
    expect(res.type).toBe('application/json');
  });

  it('should return status of 200', async () => {
    await request(server);
    const credential = { username: 'Forscience', password: 'DoctorWhat?' };
    await request(server)
      .post('/api/auth/register')
      .send(credential);
    const auth = await request(server)
      .post('/api/auth/login')
      .send(credential);
    const res = await request(server)
      .get('/api/jokes')
      .set('authorization', auth.body.token);
    expect(res.status).toBe(200);
  });
});

beforeEach(async () => {
  await db('users').truncate();
});
