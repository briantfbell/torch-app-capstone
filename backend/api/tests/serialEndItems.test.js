const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/serialEndItemsServices');
const serialEndItemsServices = require('../services/serialEndItemsServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const mockSerialEndItem = {
  id: 1,
  serial_number: 'SN-001',
  status: 'serviceable',
  item_id: 1,
  uic_id: 1,
};

afterEach(() => jest.clearAllMocks());

describe('GET /serial-items', () => {
  it('returns 200 with allSerialEndItems and calls getAllSerialEndItems with the query object', async () => {
    serialEndItemsServices.getAllSerialEndItems.mockResolvedValue([
      mockSerialEndItem,
    ]);

    const res = await request(app)
      .get('/serial-items')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('allSerialEndItems');
    expect(Array.isArray(res.body.allSerialEndItems)).toBe(true);
    expect(serialEndItemsServices.getAllSerialEndItems).toHaveBeenCalledWith(
      {},
    );
  });

  it('passes query string filters to getAllSerialEndItems', async () => {
    serialEndItemsServices.getAllSerialEndItems.mockResolvedValue([
      mockSerialEndItem,
    ]);

    await request(app)
      .get('/serial-items?status=serviceable')
      .set('Cookie', `token=${makeToken()}`);

    expect(serialEndItemsServices.getAllSerialEndItems).toHaveBeenCalledWith({
      status: 'serviceable',
    });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/serial-items');

    expect(res.status).toBe(401);
    expect(serialEndItemsServices.getAllSerialEndItems).not.toHaveBeenCalled();
  });
});

describe('GET /serial-items/:id', () => {
  it('returns 200 with serialEndItem and calls getSerialEndItemById with the id param', async () => {
    serialEndItemsServices.getSerialEndItemById.mockResolvedValue(
      mockSerialEndItem,
    );

    const res = await request(app)
      .get('/serial-items/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('serialEndItem');
    expect(serialEndItemsServices.getSerialEndItemById).toHaveBeenCalledWith(
      '1',
    );
  });

  it('returns 404 when serial item not found', async () => {
    const err = new Error('Serial item not found.');
    err.status = 404;
    serialEndItemsServices.getSerialEndItemById.mockRejectedValue(err);

    const res = await request(app)
      .get('/serial-items/9999')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(404);
  });
});

describe('GET /serial-items/uic/:uic_id', () => {
  it('returns 200 with serialEndItems and calls getSerialEndItemsByUicId with the uic_id param', async () => {
    serialEndItemsServices.getSerialEndItemsByUicId.mockResolvedValue([
      mockSerialEndItem,
    ]);

    const res = await request(app)
      .get('/serial-items/uic/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('serialEndItems');
    expect(Array.isArray(res.body.serialEndItems)).toBe(true);
    expect(
      serialEndItemsServices.getSerialEndItemsByUicId,
    ).toHaveBeenCalledWith('1');
  });
});

describe('POST /serial-items', () => {
  const body = {
    serial_number: 'SN-001',
    status: 'serviceable',
    item_id: 1,
    uic_id: 1,
  };

  it('returns 201 with newSerialEndItem and calls createSerialEndItem with the request body', async () => {
    serialEndItemsServices.createSerialEndItem.mockResolvedValue(
      mockSerialEndItem,
    );

    const res = await request(app)
      .post('/serial-items')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('newSerialEndItem');
    expect(res.body).toHaveProperty('message');
    expect(serialEndItemsServices.createSerialEndItem).toHaveBeenCalledWith(
      body,
    );
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).post('/serial-items').send(body);

    expect(res.status).toBe(401);
    expect(serialEndItemsServices.createSerialEndItem).not.toHaveBeenCalled();
  });
});

describe('PATCH /serial-items/:id', () => {
  const body = { status: 'unserviceable' };

  it('returns 200 with updatedSerialEndItem and calls updateSerialEndItem with the id and body', async () => {
    serialEndItemsServices.updateSerialEndItem.mockResolvedValue({
      ...mockSerialEndItem,
      status: 'unserviceable',
    });

    const res = await request(app)
      .patch('/serial-items/1')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('updatedSerialEndItem');
    expect(res.body).toHaveProperty('message');
    expect(serialEndItemsServices.updateSerialEndItem).toHaveBeenCalledWith(
      '1',
      body,
    );
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).patch('/serial-items/1').send(body);

    expect(res.status).toBe(401);
    expect(serialEndItemsServices.updateSerialEndItem).not.toHaveBeenCalled();
  });
});

describe('DELETE /serial-items/:id', () => {
  it('returns 200 with deletedSerialEndItem and calls deleteSerialEndItem with the id', async () => {
    serialEndItemsServices.deleteSerialEndItem.mockResolvedValue(
      mockSerialEndItem,
    );

    const res = await request(app)
      .delete('/serial-items/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('deletedSerialEndItem');
    expect(res.body).toHaveProperty('message');
    expect(serialEndItemsServices.deleteSerialEndItem).toHaveBeenCalledWith(
      '1',
    );
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).delete('/serial-items/1');

    expect(res.status).toBe(401);
    expect(serialEndItemsServices.deleteSerialEndItem).not.toHaveBeenCalled();
  });
});
