const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/currentHistoryEndItemsServices');
jest.mock('../services/archivedHistoryEndItemsServices');

const currentHistoryEndItemsServices = require('../services/currentHistoryEndItemsServices');
const archivedHistoryEndItemsServices = require('../services/archivedHistoryEndItemsServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const mockHistory = {
  id: 1,
  serial_number: 'SN-001',
  end_item_id: 1,
  signed_to: 1,
  status: 'active',
};

afterEach(() => jest.clearAllMocks());

describe('GET /current-history/end-items', () => {
  it('returns 200 with currentHistory and calls getCurrentHistory with the query object', async () => {
    currentHistoryEndItemsServices.getCurrentHistory.mockResolvedValue([mockHistory]);

    const res = await request(app)
      .get('/current-history/end-items')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('currentHistory');
    expect(currentHistoryEndItemsServices.getCurrentHistory).toHaveBeenCalledWith({});
  });

  it('passes query string filters to getCurrentHistory', async () => {
    currentHistoryEndItemsServices.getCurrentHistory.mockResolvedValue([mockHistory]);

    await request(app)
      .get('/current-history/end-items?signed_to=1')
      .set('Cookie', `token=${makeToken()}`);

    expect(currentHistoryEndItemsServices.getCurrentHistory).toHaveBeenCalledWith({ signed_to: '1' });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/current-history/end-items');

    expect(res.status).toBe(401);
    expect(currentHistoryEndItemsServices.getCurrentHistory).not.toHaveBeenCalled();
  });
});

describe('GET /current-history/end-items/:id', () => {
  it('returns 200 with currentHistory and calls getCurrentHistoryById with the id param', async () => {
    currentHistoryEndItemsServices.getCurrentHistoryById.mockResolvedValue(mockHistory);

    const res = await request(app)
      .get('/current-history/end-items/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('currentHistory');
    expect(currentHistoryEndItemsServices.getCurrentHistoryById).toHaveBeenCalledWith('1');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/current-history/end-items/1');

    expect(res.status).toBe(401);
    expect(currentHistoryEndItemsServices.getCurrentHistoryById).not.toHaveBeenCalled();
  });
});

describe('POST /current-history/end-items', () => {
  const body = { serial_number: 'SN-001', end_item_id: 1, signed_to: 1 };

  it('creates new record and calls createCurrentHistory with the request body when no prior record exists', async () => {
    currentHistoryEndItemsServices.getCurrentHistoryBySn.mockResolvedValue(null);
    currentHistoryEndItemsServices.createCurrentHistory.mockResolvedValue(mockHistory);

    const res = await request(app)
      .post('/current-history/end-items')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('newCurrentHistory');
    expect(res.body).toHaveProperty('message');
    expect(currentHistoryEndItemsServices.getCurrentHistoryBySn).toHaveBeenCalledWith({
      serial_number: body.serial_number,
    });
    expect(currentHistoryEndItemsServices.createCurrentHistory).toHaveBeenCalledWith(body);
    expect(archivedHistoryEndItemsServices.createArchivedHistory).not.toHaveBeenCalled();
  });

  it('archives the existing record before creating the new one', async () => {
    currentHistoryEndItemsServices.getCurrentHistoryBySn.mockResolvedValue(mockHistory);
    archivedHistoryEndItemsServices.createArchivedHistory.mockResolvedValue({});
    currentHistoryEndItemsServices.deleteCurrentHistory.mockResolvedValue({});
    currentHistoryEndItemsServices.createCurrentHistory.mockResolvedValue({ ...mockHistory, id: 2 });

    await request(app)
      .post('/current-history/end-items')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(archivedHistoryEndItemsServices.createArchivedHistory).toHaveBeenCalledWith(mockHistory);
    expect(currentHistoryEndItemsServices.deleteCurrentHistory).toHaveBeenCalledWith(mockHistory.id);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).post('/current-history/end-items').send(body);

    expect(res.status).toBe(401);
    expect(currentHistoryEndItemsServices.createCurrentHistory).not.toHaveBeenCalled();
  });
});

describe('PATCH /current-history/end-items/:id', () => {
  const body = { status: 'returned' };

  it('archives the existing record then updates, calling all three services correctly', async () => {
    currentHistoryEndItemsServices.getCurrentHistoryById.mockResolvedValue(mockHistory);
    archivedHistoryEndItemsServices.createArchivedHistory.mockResolvedValue({});
    currentHistoryEndItemsServices.updateCurrentHistory.mockResolvedValue({ ...mockHistory, status: 'returned' });

    const res = await request(app)
      .patch('/current-history/end-items/1')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('updatedCurrentHistory');
    expect(currentHistoryEndItemsServices.getCurrentHistoryById).toHaveBeenCalledWith('1');
    expect(archivedHistoryEndItemsServices.createArchivedHistory).toHaveBeenCalledWith(mockHistory);
    expect(currentHistoryEndItemsServices.updateCurrentHistory).toHaveBeenCalledWith('1', body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).patch('/current-history/end-items/1').send(body);

    expect(res.status).toBe(401);
    expect(currentHistoryEndItemsServices.updateCurrentHistory).not.toHaveBeenCalled();
  });
});
