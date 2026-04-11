const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/archivedHistoryEndItemsServices');
const archivedHistoryEndItemsServices = require('../services/archivedHistoryEndItemsServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const mockArchived = {
  id: 1,
  serial_number: 'SN-001',
  end_item_id: 1,
  signed_to: 1,
  archived_at: new Date().toISOString(),
};

afterEach(() => jest.clearAllMocks());

describe('GET /archived-history/end-items', () => {
  it('returns 200 with archivedHistory and calls getArchivedHistory with the query object', async () => {
    archivedHistoryEndItemsServices.getArchivedHistory.mockResolvedValue([mockArchived]);

    const res = await request(app)
      .get('/archived-history/end-items')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('archivedHistory');
    expect(Array.isArray(res.body.archivedHistory)).toBe(true);
    expect(archivedHistoryEndItemsServices.getArchivedHistory).toHaveBeenCalledWith({});
  });

  it('passes query string filters to getArchivedHistory', async () => {
    archivedHistoryEndItemsServices.getArchivedHistory.mockResolvedValue([mockArchived]);

    await request(app)
      .get('/archived-history/end-items?serial_number=SN-001')
      .set('Cookie', `token=${makeToken()}`);

    expect(archivedHistoryEndItemsServices.getArchivedHistory).toHaveBeenCalledWith({
      serial_number: 'SN-001',
    });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/archived-history/end-items');

    expect(res.status).toBe(401);
    expect(archivedHistoryEndItemsServices.getArchivedHistory).not.toHaveBeenCalled();
  });

  it('returns 500 when service throws', async () => {
    archivedHistoryEndItemsServices.getArchivedHistory.mockRejectedValue(new Error('DB error'));

    const res = await request(app)
      .get('/archived-history/end-items')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(500);
  });
});

describe('GET /archived-history/end-items/:id', () => {
  it('returns 200 with archivedHistory and calls getArchivedHistoryById with the id param', async () => {
    archivedHistoryEndItemsServices.getArchivedHistoryById.mockResolvedValue(mockArchived);

    const res = await request(app)
      .get('/archived-history/end-items/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('archivedHistory');
    expect(archivedHistoryEndItemsServices.getArchivedHistoryById).toHaveBeenCalledWith('1');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/archived-history/end-items/1');

    expect(res.status).toBe(401);
    expect(archivedHistoryEndItemsServices.getArchivedHistoryById).not.toHaveBeenCalled();
  });
});

describe('POST /archived-history/end-items', () => {
  const body = { serial_number: 'SN-001', end_item_id: 1, signed_to: 1 };

  it('returns 201 with newArchivedHistory and calls createArchivedHistory with the request body', async () => {
    archivedHistoryEndItemsServices.createArchivedHistory.mockResolvedValue(mockArchived);

    const res = await request(app)
      .post('/archived-history/end-items')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('newArchivedHistory');
    expect(res.body).toHaveProperty('message');
    expect(archivedHistoryEndItemsServices.createArchivedHistory).toHaveBeenCalledWith(body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).post('/archived-history/end-items').send(body);

    expect(res.status).toBe(401);
    expect(archivedHistoryEndItemsServices.createArchivedHistory).not.toHaveBeenCalled();
  });
});
