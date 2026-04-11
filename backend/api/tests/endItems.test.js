const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/endItemsServices');
const endItemsServices = require('../services/endItemsServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const mockEndItem = {
  id: 1,
  lin: 'A12345',
  niin: '001234567',
  description: 'Test End Item',
  uic_id: 1,
  completed: false,
};

afterEach(() => jest.clearAllMocks());

describe('GET /end-items', () => {
  it('returns 200 with allEndItems and calls getAllEndItems with the query object', async () => {
    endItemsServices.getAllEndItems.mockResolvedValue([mockEndItem]);

    const res = await request(app)
      .get('/end-items')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('allEndItems');
    expect(Array.isArray(res.body.allEndItems)).toBe(true);
    expect(endItemsServices.getAllEndItems).toHaveBeenCalledWith({});
  });

  it('passes query string filters to getAllEndItems', async () => {
    endItemsServices.getAllEndItems.mockResolvedValue([mockEndItem]);

    await request(app)
      .get('/end-items?lin=A12345&sort_by=lin')
      .set('Cookie', `token=${makeToken()}`);

    expect(endItemsServices.getAllEndItems).toHaveBeenCalledWith({ lin: 'A12345', sort_by: 'lin' });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/end-items');

    expect(res.status).toBe(401);
    expect(endItemsServices.getAllEndItems).not.toHaveBeenCalled();
  });
});

describe('GET /end-items/:id', () => {
  it('returns 200 with endItem and calls getEndItemById with the id param', async () => {
    endItemsServices.getEndItemById.mockResolvedValue(mockEndItem);

    const res = await request(app)
      .get('/end-items/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('endItem');
    expect(endItemsServices.getEndItemById).toHaveBeenCalledWith('1');
  });

  it('returns 404 when end item not found', async () => {
    const err = new Error('End item not found.');
    err.status = 404;
    endItemsServices.getEndItemById.mockRejectedValue(err);

    const res = await request(app)
      .get('/end-items/9999')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(404);
  });
});

describe('GET /end-items/uic/:uic_id', () => {
  it('returns 200 with endItems and calls getEndItemsByUicId with the uic_id param', async () => {
    endItemsServices.getEndItemsByUicId.mockResolvedValue([mockEndItem]);

    const res = await request(app)
      .get('/end-items/uic/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('endItems');
    expect(Array.isArray(res.body.endItems)).toBe(true);
    expect(endItemsServices.getEndItemsByUicId).toHaveBeenCalledWith('1');
  });
});

describe('POST /end-items', () => {
  const body = { lin: 'A12345', niin: '001234567', description: 'Test', uic_id: 1 };

  it('returns 201 with newEndItem and calls createEndItem with the request body', async () => {
    endItemsServices.createEndItem.mockResolvedValue(mockEndItem);

    const res = await request(app)
      .post('/end-items')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('newEndItem');
    expect(res.body).toHaveProperty('message');
    expect(endItemsServices.createEndItem).toHaveBeenCalledWith(body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).post('/end-items').send(body);

    expect(res.status).toBe(401);
    expect(endItemsServices.createEndItem).not.toHaveBeenCalled();
  });
});

describe('PATCH /end-items/:id', () => {
  const body = { description: 'Updated' };

  it('returns 200 with updatedEndItem and calls updateEndItem with the id and body', async () => {
    endItemsServices.updateEndItem.mockResolvedValue({ ...mockEndItem, description: 'Updated' });

    const res = await request(app)
      .patch('/end-items/1')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('updatedEndItem');
    expect(res.body).toHaveProperty('message');
    expect(endItemsServices.updateEndItem).toHaveBeenCalledWith('1', body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).patch('/end-items/1').send(body);

    expect(res.status).toBe(401);
    expect(endItemsServices.updateEndItem).not.toHaveBeenCalled();
  });
});

describe('PATCH /end-items/:id/complete', () => {
  it('returns 200 and calls updateEndItem with hardcoded { completed: true }', async () => {
    endItemsServices.updateEndItem.mockResolvedValue({ ...mockEndItem, completed: true });

    const res = await request(app)
      .patch('/end-items/1/complete')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('updatedEndItem');
    expect(res.body).toHaveProperty('message');
    expect(endItemsServices.updateEndItem).toHaveBeenCalledWith('1', { completed: true });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).patch('/end-items/1/complete');

    expect(res.status).toBe(401);
    expect(endItemsServices.updateEndItem).not.toHaveBeenCalled();
  });
});

describe('DELETE /end-items/:id', () => {
  it('returns 200 with deletedEndItem and calls deleteEndItem with the id', async () => {
    endItemsServices.deleteEndItem.mockResolvedValue(mockEndItem);

    const res = await request(app)
      .delete('/end-items/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('deletedEndItem');
    expect(res.body).toHaveProperty('message');
    expect(endItemsServices.deleteEndItem).toHaveBeenCalledWith('1');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).delete('/end-items/1');

    expect(res.status).toBe(401);
    expect(endItemsServices.deleteEndItem).not.toHaveBeenCalled();
  });
});
