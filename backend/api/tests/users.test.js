const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/usersServices');
const usersServices = require('../services/usersServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const mockUser = {
  id: 1,
  username: 'jdoe',
  name_first: 'John',
  name_last: 'Doe',
  email: 'john@example.com',
  role: 'hrh',
};

afterEach(() => jest.clearAllMocks());

describe('GET /users', () => {
  it('returns 200 with allUsers and calls getAllUsers with the query object', async () => {
    usersServices.getAllUsers.mockResolvedValue([mockUser]);

    const res = await request(app)
      .get('/users')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('allUsers');
    expect(Array.isArray(res.body.allUsers)).toBe(true);
    expect(usersServices.getAllUsers).toHaveBeenCalledWith({});
  });

  it('passes query string filters to getAllUsers', async () => {
    usersServices.getAllUsers.mockResolvedValue([mockUser]);

    await request(app)
      .get('/users?role=hrh')
      .set('Cookie', `token=${makeToken()}`);

    expect(usersServices.getAllUsers).toHaveBeenCalledWith({ role: 'hrh' });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/users');

    expect(res.status).toBe(401);
    expect(usersServices.getAllUsers).not.toHaveBeenCalled();
  });
});

describe('GET /users/:id', () => {
  it('returns 200 with user and calls getUserById with the id param', async () => {
    usersServices.getUserById.mockResolvedValue(mockUser);

    const res = await request(app)
      .get('/users/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(usersServices.getUserById).toHaveBeenCalledWith('1');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/users/1');

    expect(res.status).toBe(401);
    expect(usersServices.getUserById).not.toHaveBeenCalled();
  });

  it('returns 500 when service throws unexpectedly', async () => {
    usersServices.getUserById.mockRejectedValue(new Error('Unexpected error'));

    const res = await request(app)
      .get('/users/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message');
  });
});

describe('PATCH /users/:id', () => {
  const body = { username: 'jdoe_updated' };

  it('returns 200 with updatedUser and calls updateUser with the id and body', async () => {
    usersServices.updateUser.mockResolvedValue({ ...mockUser, username: 'jdoe_updated' });

    const res = await request(app)
      .patch('/users/1')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('updatedUser');
    expect(res.body).toHaveProperty('message');
    expect(usersServices.updateUser).toHaveBeenCalledWith('1', body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).patch('/users/1').send(body);

    expect(res.status).toBe(401);
    expect(usersServices.updateUser).not.toHaveBeenCalled();
  });
});

describe('DELETE /users/:id', () => {
  it('returns 200 with deletedUser and calls deleteUser with the id', async () => {
    usersServices.deleteUser.mockResolvedValue(mockUser);

    const res = await request(app)
      .delete('/users/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('deletedUser');
    expect(res.body).toHaveProperty('message');
    expect(usersServices.deleteUser).toHaveBeenCalledWith('1');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).delete('/users/1');

    expect(res.status).toBe(401);
    expect(usersServices.deleteUser).not.toHaveBeenCalled();
  });
});
