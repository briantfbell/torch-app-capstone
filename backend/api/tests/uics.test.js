const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/uicsServices');
const uicsServices = require('../services/uicsServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const mockUic = { id: 1, uic: 'W1234', unit_name: 'Test Unit', parent_uic: 'W0000' };

afterEach(() => jest.clearAllMocks());

describe('GET /uics', () => {
  it('returns 200 with allUics and calls getAllUics with the query object', async () => {
    uicsServices.getAllUics.mockResolvedValue([mockUic]);

    const res = await request(app).get('/uics');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('allUics');
    expect(Array.isArray(res.body.allUics)).toBe(true);
    expect(uicsServices.getAllUics).toHaveBeenCalledWith({});
  });

  it('passes query string filters to getAllUics', async () => {
    uicsServices.getAllUics.mockResolvedValue([mockUic]);

    await request(app).get('/uics?uic=W1234');

    expect(uicsServices.getAllUics).toHaveBeenCalledWith({ uic: 'W1234' });
  });

  it('returns 500 when service throws', async () => {
    uicsServices.getAllUics.mockRejectedValue(new Error('DB error'));

    const res = await request(app).get('/uics');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message');
  });
});

describe('GET /uics/:id', () => {
  it('returns 200 with uic and calls getUicById with the id param', async () => {
    uicsServices.getUicById.mockResolvedValue(mockUic);

    const res = await request(app).get('/uics/1');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('uic');
    expect(uicsServices.getUicById).toHaveBeenCalledWith('1');
  });

  it('returns 404 when uic not found', async () => {
    const err = new Error('UIC does not exist.');
    err.status = 404;
    uicsServices.getUicById.mockRejectedValue(err);

    const res = await request(app).get('/uics/9999');

    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('message');
  });
});

describe('POST /uics', () => {
  const body = { uic: 'W1234', unit_name: 'Test Unit', parent_uic: 'W0000' };

  it('returns 201 with newUic and calls createUic with the request body', async () => {
    uicsServices.createUic.mockResolvedValue(mockUic);

    const res = await request(app)
      .post('/uics')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('newUic');
    expect(res.body).toHaveProperty('message');
    expect(uicsServices.createUic).toHaveBeenCalledWith(body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).post('/uics').send(body);

    expect(res.status).toBe(401);
    expect(uicsServices.createUic).not.toHaveBeenCalled();
  });

  it('returns 400 when service throws validation error', async () => {
    const err = new Error('All fields are required.');
    err.status = 400;
    uicsServices.createUic.mockRejectedValue(err);

    const res = await request(app)
      .post('/uics')
      .set('Cookie', `token=${makeToken()}`)
      .send({});

    expect(res.status).toBe(400);
  });
});

describe('PATCH /uics/:id', () => {
  const body = { unit_name: 'Updated Unit' };

  it('returns 200 with updatedUic and calls updateUic with the id and body', async () => {
    uicsServices.updateUic.mockResolvedValue({ ...mockUic, unit_name: 'Updated Unit' });

    const res = await request(app)
      .patch('/uics/1')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('updatedUic');
    expect(res.body).toHaveProperty('message');
    expect(uicsServices.updateUic).toHaveBeenCalledWith('1', body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).patch('/uics/1').send(body);

    expect(res.status).toBe(401);
    expect(uicsServices.updateUic).not.toHaveBeenCalled();
  });
});

describe('DELETE /uics/:id', () => {
  it('returns 200 with deletedUic and calls deleteUic with the id', async () => {
    uicsServices.deleteUic.mockResolvedValue(mockUic);

    const res = await request(app)
      .delete('/uics/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('deletedUic');
    expect(res.body).toHaveProperty('message');
    expect(uicsServices.deleteUic).toHaveBeenCalledWith('1');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).delete('/uics/1');

    expect(res.status).toBe(401);
    expect(uicsServices.deleteUic).not.toHaveBeenCalled();
  });
});
