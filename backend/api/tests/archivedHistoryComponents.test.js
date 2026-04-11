const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/archivedHistoryComponentsServices');
const archivedHistoryComponentsServices = require('../services/archivedHistoryComponentsServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const mockArchived = {
  id: 1,
  serial_number: 'SN-001',
  component_id: 1,
  signed_to: 1,
  archived_at: new Date().toISOString(),
};

afterEach(() => jest.clearAllMocks());

describe('GET /archived-history/components', () => {
  it('returns 200 with archivedHistory and calls getComponentArchivedHistory with the query object', async () => {
    archivedHistoryComponentsServices.getComponentArchivedHistory.mockResolvedValue(
      [mockArchived],
    );

    const res = await request(app)
      .get('/archived-history/components')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('archivedHistory');
    expect(Array.isArray(res.body.archivedHistory)).toBe(true);
    expect(
      archivedHistoryComponentsServices.getComponentArchivedHistory,
    ).toHaveBeenCalledWith({});
  });

  it('passes query string filters to getComponentArchivedHistory', async () => {
    archivedHistoryComponentsServices.getComponentArchivedHistory.mockResolvedValue(
      [mockArchived],
    );

    await request(app)
      .get('/archived-history/components?component_id=1')
      .set('Cookie', `token=${makeToken()}`);

    expect(
      archivedHistoryComponentsServices.getComponentArchivedHistory,
    ).toHaveBeenCalledWith({
      component_id: '1',
    });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/archived-history/components');

    expect(res.status).toBe(401);
    expect(
      archivedHistoryComponentsServices.getComponentArchivedHistory,
    ).not.toHaveBeenCalled();
  });

  it('returns 500 when service throws', async () => {
    archivedHistoryComponentsServices.getComponentArchivedHistory.mockRejectedValue(
      new Error('DB error'),
    );

    const res = await request(app)
      .get('/archived-history/components')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(500);
  });
});

describe('GET /archived-history/components/:id', () => {
  it('returns 200 with archivedHistory and calls getComponentArchivedHistoryById with the id param', async () => {
    archivedHistoryComponentsServices.getComponentArchivedHistoryById.mockResolvedValue(
      mockArchived,
    );

    const res = await request(app)
      .get('/archived-history/components/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('archivedHistory');
    expect(
      archivedHistoryComponentsServices.getComponentArchivedHistoryById,
    ).toHaveBeenCalledWith('1');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/archived-history/components/1');

    expect(res.status).toBe(401);
    expect(
      archivedHistoryComponentsServices.getComponentArchivedHistoryById,
    ).not.toHaveBeenCalled();
  });
});

describe('POST /archived-history/components', () => {
  const body = { serial_number: 'SN-001', component_id: 1, signed_to: 1 };

  it('returns 201 with newArchivedHistory and calls createComponentArchivedHistory with the request body', async () => {
    archivedHistoryComponentsServices.createComponentArchivedHistory.mockResolvedValue(
      mockArchived,
    );

    const res = await request(app)
      .post('/archived-history/components')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('newArchivedHistory');
    expect(res.body).toHaveProperty('message');
    expect(
      archivedHistoryComponentsServices.createComponentArchivedHistory,
    ).toHaveBeenCalledWith(body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app)
      .post('/archived-history/components')
      .send(body);

    expect(res.status).toBe(401);
    expect(
      archivedHistoryComponentsServices.createComponentArchivedHistory,
    ).not.toHaveBeenCalled();
  });
});
