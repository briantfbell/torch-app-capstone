const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/serialItemsServices');
const serialItemsServices = require('../services/serialItemsServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const mockSerialItem = {
  id: 1,
  serial_number: 'SN-001',
  status: 'serviceable',
  item_id: 1,
  uic_id: 1,
};

afterEach(() => jest.clearAllMocks());

describe('GET /serial-items', () => {
  it('returns 200 with allSerialItems and calls getAllSerialItems with the query object', async () => {
    serialItemsServices.getAllSerialItems.mockResolvedValue([mockSerialItem]);

    const res = await request(app)
      .get('/serial-items')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('allSerialItems');
    expect(Array.isArray(res.body.allSerialItems)).toBe(true);
    expect(serialItemsServices.getAllSerialItems).toHaveBeenCalledWith({});
  });

  it('passes query string filters to getAllSerialItems', async () => {
    serialItemsServices.getAllSerialItems.mockResolvedValue([mockSerialItem]);

    await request(app)
      .get('/serial-items?status=serviceable')
      .set('Cookie', `token=${makeToken()}`);

    expect(serialItemsServices.getAllSerialItems).toHaveBeenCalledWith({
      status: 'serviceable',
    });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/serial-items');

    expect(res.status).toBe(401);
    expect(serialItemsServices.getAllSerialItems).not.toHaveBeenCalled();
  });
});

describe('GET /serial-items/:id', () => {
  it('returns 200 with serialItem and calls getSerialItemById with the id param', async () => {
    serialItemsServices.getSerialItemById.mockResolvedValue(mockSerialItem);

    const res = await request(app)
      .get('/serial-items/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('serialItem');
    expect(serialItemsServices.getSerialItemById).toHaveBeenCalledWith('1');
  });

  it('returns 404 when serial item not found', async () => {
    const err = new Error('Serial item not found.');
    err.status = 404;
    serialItemsServices.getSerialItemById.mockRejectedValue(err);

    const res = await request(app)
      .get('/serial-items/9999')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(404);
  });
});

describe('GET /serial-items/uic/:uic_id', () => {
  it('returns 200 with serialItems and calls getSerialItemsByUicId with the uic_id param', async () => {
    serialItemsServices.getSerialItemsByUicId.mockResolvedValue([
      mockSerialItem,
    ]);

    const res = await request(app)
      .get('/serial-items/uic/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('serialItems');
    expect(Array.isArray(res.body.serialItems)).toBe(true);
    expect(serialItemsServices.getSerialItemsByUicId).toHaveBeenCalledWith('1');
  });
});

describe('POST /serial-items', () => {
  const body = {
    serial_number: 'SN-001',
    status: 'serviceable',
    item_id: 1,
    uic_id: 1,
  };

  it('returns 201 with newSerialItem and calls createSerialItem with the request body', async () => {
    serialItemsServices.createSerialItem.mockResolvedValue(mockSerialItem);

    const res = await request(app)
      .post('/serial-items')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('newSerialItem');
    expect(res.body).toHaveProperty('message');
    expect(serialItemsServices.createSerialItem).toHaveBeenCalledWith(body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).post('/serial-items').send(body);

    expect(res.status).toBe(401);
    expect(serialItemsServices.createSerialItem).not.toHaveBeenCalled();
  });
});

describe('PATCH /serial-items/:id', () => {
  const body = { status: 'unserviceable' };

  it('returns 200 with updatedSerialItem and calls updateSerialItem with the id and body', async () => {
    serialItemsServices.updateSerialItem.mockResolvedValue({
      ...mockSerialItem,
      status: 'unserviceable',
    });

    const res = await request(app)
      .patch('/serial-items/1')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('updatedSerialItem');
    expect(res.body).toHaveProperty('message');
    expect(serialItemsServices.updateSerialItem).toHaveBeenCalledWith(
      '1',
      body,
    );
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).patch('/serial-items/1').send(body);

    expect(res.status).toBe(401);
    expect(serialItemsServices.updateSerialItem).not.toHaveBeenCalled();
  });
});

describe('DELETE /serial-items/:id', () => {
  it('returns 200 with deletedSerialItem and calls deleteSerialItem with the id', async () => {
    serialItemsServices.deleteSerialItem.mockResolvedValue(mockSerialItem);

    const res = await request(app)
      .delete('/serial-items/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('deletedSerialItem');
    expect(res.body).toHaveProperty('message');
    expect(serialItemsServices.deleteSerialItem).toHaveBeenCalledWith('1');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).delete('/serial-items/1');

    expect(res.status).toBe(401);
    expect(serialItemsServices.deleteSerialItem).not.toHaveBeenCalled();
  });
});
