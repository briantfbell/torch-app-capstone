const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/authServices');
const authServices = require('../services/authServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

afterEach(() => jest.clearAllMocks());

describe('POST /auth/register', () => {
  const validBody = {
    username: 'jdoe',
    name_first: 'John',
    name_last: 'Doe',
    email: 'john@example.com',
    password: 'secret123',
    phone: '555-1234',
    rank: 'SGT',
    uic: 'W1234',
    role: 'hrh',
    dodid: '1234567890',
  };

  it('returns 201 with newUser and calls registerUser with the full request body', async () => {
    authServices.registerUser.mockResolvedValue({ username: 'jdoe', email: 'john@example.com' });

    const res = await request(app).post('/auth/register').send(validBody);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('newUser');
    expect(authServices.registerUser).toHaveBeenCalledWith(validBody);
  });

  it('returns 400 when service throws a validation error', async () => {
    const err = new Error('All fields are required.');
    err.status = 400;
    authServices.registerUser.mockRejectedValue(err);

    const res = await request(app).post('/auth/register').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
  });
});

describe('POST /auth/login', () => {
  it('returns 200 with token, sets cookie, and calls login with email and password', async () => {
    authServices.login.mockResolvedValue(makeToken());

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'john@example.com', password: 'secret123' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.headers['set-cookie']).toBeDefined();
    expect(authServices.login).toHaveBeenCalledWith('john@example.com', 'secret123');
  });

  it('returns 401 on invalid credentials', async () => {
    const err = new Error('Email or password is incorrect.');
    err.status = 401;
    authServices.login.mockRejectedValue(err);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'john@example.com', password: 'wrong' });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('message');
  });

  it('returns 400 when email or password is missing', async () => {
    const err = new Error('Email and password are required.');
    err.status = 400;
    authServices.login.mockRejectedValue(err);

    const res = await request(app).post('/auth/login').send({ email: 'john@example.com' });

    expect(res.status).toBe(400);
  });
});

describe('GET /auth/me', () => {
  it('returns 200 with user and calls getMe with the token from the cookie', async () => {
    authServices.getMe.mockResolvedValue({ id: 1, username: 'jdoe' });
    const token = makeToken();

    const res = await request(app)
      .get('/auth/me')
      .set('Cookie', `token=${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(authServices.getMe).toHaveBeenCalledWith(token);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
    expect(authServices.getMe).not.toHaveBeenCalled();
  });
});

describe('POST /auth/logout', () => {
  it('returns 200, clears the cookie, and does not call any service', async () => {
    const res = await request(app)
      .post('/auth/logout')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message', 'Logged out.');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).post('/auth/logout');
    expect(res.status).toBe(401);
  });
});
