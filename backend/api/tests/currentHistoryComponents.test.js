const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/currentHistoryComponentsServices');
jest.mock('../services/archivedHistoryComponentsServices');

const currentHistoryComponentsServices = require('../services/currentHistoryComponentsServices');
const archivedHistoryComponentsServices = require('../services/archivedHistoryComponentsServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const mockHistory = {
  id: 1,
  serial_number: 'SN-001',
  component_id: 1,
  signed_to: 1,
};

afterEach(() => jest.clearAllMocks());

describe('GET /current-history/components', () => {
  it('returns 200 with currentHistory and calls getComponentCurrentHistory with the query object', async () => {
    currentHistoryComponentsServices.getComponentCurrentHistory.mockResolvedValue([mockHistory]);

    const res = await request(app)
      .get('/current-history/components')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('currentHistory');
    expect(currentHistoryComponentsServices.getComponentCurrentHistory).toHaveBeenCalledWith({});
  });

  it('passes query string filters to getComponentCurrentHistory', async () => {
    currentHistoryComponentsServices.getComponentCurrentHistory.mockResolvedValue([mockHistory]);

    await request(app)
      .get('/current-history/components?component_id=1')
      .set('Cookie', `token=${makeToken()}`);

    expect(currentHistoryComponentsServices.getComponentCurrentHistory).toHaveBeenCalledWith({
      component_id: '1',
    });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/current-history/components');

    expect(res.status).toBe(401);
    expect(currentHistoryComponentsServices.getComponentCurrentHistory).not.toHaveBeenCalled();
  });
});

describe('GET /current-history/components/:id', () => {
  it('returns 200 with currentHistory and calls getComponentCurrentHistoryById with the id param', async () => {
    currentHistoryComponentsServices.getComponentCurrentHistoryById.mockResolvedValue(mockHistory);

    const res = await request(app)
      .get('/current-history/components/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('currentHistory');
    expect(currentHistoryComponentsServices.getComponentCurrentHistoryById).toHaveBeenCalledWith('1');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/current-history/components/1');

    expect(res.status).toBe(401);
    expect(currentHistoryComponentsServices.getComponentCurrentHistoryById).not.toHaveBeenCalled();
  });
});

describe('POST /current-history/components', () => {
  describe('serialized component (has serial_number)', () => {
    const body = { serial_number: 'SN-001', component_id: 1, signed_to: 1 };

    it('creates new record when no prior record exists', async () => {
      currentHistoryComponentsServices.getComponentCurrentHistoryBySn.mockResolvedValue(null);
      currentHistoryComponentsServices.createComponentCurrentHistory.mockResolvedValue(mockHistory);

      const res = await request(app)
        .post('/current-history/components')
        .set('Cookie', `token=${makeToken()}`)
        .send(body);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('newCurrentHistory');
      expect(currentHistoryComponentsServices.getComponentCurrentHistoryBySn).toHaveBeenCalledWith(
        body.serial_number,
      );
      expect(currentHistoryComponentsServices.createComponentCurrentHistory).toHaveBeenCalledWith(body);
      expect(archivedHistoryComponentsServices.createComponentArchivedHistory).not.toHaveBeenCalled();
    });

    it('archives the existing record before creating the new one', async () => {
      currentHistoryComponentsServices.getComponentCurrentHistoryBySn.mockResolvedValue(mockHistory);
      archivedHistoryComponentsServices.createComponentArchivedHistory.mockResolvedValue({});
      currentHistoryComponentsServices.deleteComponentCurrentHistory.mockResolvedValue({});
      currentHistoryComponentsServices.createComponentCurrentHistory.mockResolvedValue({ ...mockHistory, id: 2 });

      await request(app)
        .post('/current-history/components')
        .set('Cookie', `token=${makeToken()}`)
        .send(body);

      expect(archivedHistoryComponentsServices.createComponentArchivedHistory).toHaveBeenCalledWith(mockHistory);
      expect(currentHistoryComponentsServices.deleteComponentCurrentHistory).toHaveBeenCalledWith(mockHistory.id);
    });
  });

  describe('unserialized component (no serial_number)', () => {
    const body = { component_id: 1, signed_to: 1 };

    it('creates new record using getUnserializedComponentCurrentHistory lookup', async () => {
      currentHistoryComponentsServices.getUnserializedComponentCurrentHistory.mockResolvedValue(null);
      currentHistoryComponentsServices.createComponentCurrentHistory.mockResolvedValue({ ...mockHistory, serial_number: null });

      const res = await request(app)
        .post('/current-history/components')
        .set('Cookie', `token=${makeToken()}`)
        .send(body);

      expect(res.status).toBe(201);
      expect(currentHistoryComponentsServices.getUnserializedComponentCurrentHistory).toHaveBeenCalledWith(
        body.component_id,
      );
      expect(currentHistoryComponentsServices.createComponentCurrentHistory).toHaveBeenCalledWith(body);
    });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app)
      .post('/current-history/components')
      .send({ component_id: 1 });

    expect(res.status).toBe(401);
    expect(currentHistoryComponentsServices.createComponentCurrentHistory).not.toHaveBeenCalled();
  });
});

describe('PATCH /current-history/components/:id', () => {
  const body = { signed_to: 2 };

  it('archives the existing record then updates, calling all three services correctly', async () => {
    currentHistoryComponentsServices.getComponentCurrentHistoryById.mockResolvedValue(mockHistory);
    archivedHistoryComponentsServices.createComponentArchivedHistory.mockResolvedValue({});
    currentHistoryComponentsServices.updateComponentCurrentHistory.mockResolvedValue({ ...mockHistory, signed_to: 2 });

    const res = await request(app)
      .patch('/current-history/components/1')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('updatedCurrentHistory');
    expect(currentHistoryComponentsServices.getComponentCurrentHistoryById).toHaveBeenCalledWith('1');
    expect(archivedHistoryComponentsServices.createComponentArchivedHistory).toHaveBeenCalledWith(mockHistory);
    expect(currentHistoryComponentsServices.updateComponentCurrentHistory).toHaveBeenCalledWith('1', body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).patch('/current-history/components/1').send(body);

    expect(res.status).toBe(401);
    expect(currentHistoryComponentsServices.updateComponentCurrentHistory).not.toHaveBeenCalled();
  });
});
