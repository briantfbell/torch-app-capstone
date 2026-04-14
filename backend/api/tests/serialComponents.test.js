const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/serialComponentsServices');
const serialComponentsServices = require('../services/serialComponentsServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const mockSerialComponent = {
  id: 1,
  serial_number: 'SN-001',
  status: 'serviceable',
  item_id: 1,
  uic_id: 1,
};

afterEach(() => jest.clearAllMocks());

describe('GET /serial-items', () => {
  it('returns 200 with allSerialComponents and calls getAllSerialComponents with the query object', async () => {
    serialComponentsServices.getAllSerialComponents.mockResolvedValue([
      mockSerialComponent,
    ]);

    const res = await request(app)
      .get('/serial-items')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('allSerialComponents');
    expect(Array.isArray(res.body.allSerialComponents)).toBe(true);
    expect(
      serialComponentsServices.getAllSerialComponents,
    ).toHaveBeenCalledWith({});
  });

  it('passes query string filters to getAllSerialComponents', async () => {
    serialComponentsServices.getAllSerialComponents.mockResolvedValue([
      mockSerialComponent,
    ]);

    await request(app)
      .get('/serial-items?status=serviceable')
      .set('Cookie', `token=${makeToken()}`);

    expect(
      serialComponentsServices.getAllSerialComponents,
    ).toHaveBeenCalledWith({
      status: 'serviceable',
    });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/serial-items');

    expect(res.status).toBe(401);
    expect(
      serialComponentsServices.getAllSerialComponents,
    ).not.toHaveBeenCalled();
  });
});

describe('GET /serial-items/:id', () => {
  it('returns 200 with serialComponent and calls getSerialComponentById with the id param', async () => {
    serialComponentsServices.getSerialComponentById.mockResolvedValue(
      mockSerialComponent,
    );

    const res = await request(app)
      .get('/serial-items/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('serialComponent');
    expect(
      serialComponentsServices.getSerialComponentById,
    ).toHaveBeenCalledWith('1');
  });

  it('returns 404 when serial item not found', async () => {
    const err = new Error('Serial item not found.');
    err.status = 404;
    serialComponentsServices.getSerialComponentById.mockRejectedValue(err);

    const res = await request(app)
      .get('/serial-items/9999')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(404);
  });
});

describe('GET /serial-items/uic/:uic_id', () => {
  it('returns 200 with serialComponents and calls getSerialComponentsByUicId with the uic_id param', async () => {
    serialComponentsServices.getSerialComponentsByUicId.mockResolvedValue([
      mockSerialComponent,
    ]);

    const res = await request(app)
      .get('/serial-items/uic/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('serialComponents');
    expect(Array.isArray(res.body.serialComponents)).toBe(true);
    expect(
      serialComponentsServices.getSerialComponentsByUicId,
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

  it('returns 201 with newSerialComponent and calls createSerialComponent with the request body', async () => {
    serialComponentsServices.createSerialComponent.mockResolvedValue(
      mockSerialComponent,
    );

    const res = await request(app)
      .post('/serial-items')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('newSerialComponent');
    expect(res.body).toHaveProperty('message');
    expect(serialComponentsServices.createSerialComponent).toHaveBeenCalledWith(
      body,
    );
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).post('/serial-items').send(body);

    expect(res.status).toBe(401);
    expect(
      serialComponentsServices.createSerialComponent,
    ).not.toHaveBeenCalled();
  });
});

describe('PATCH /serial-items/:id', () => {
  const body = { status: 'unserviceable' };

  it('returns 200 with updatedSerialComponent and calls updateSerialComponent with the id and body', async () => {
    serialComponentsServices.updateSerialComponent.mockResolvedValue({
      ...mockSerialComponent,
      status: 'unserviceable',
    });

    const res = await request(app)
      .patch('/serial-items/1')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('updatedSerialComponent');
    expect(res.body).toHaveProperty('message');
    expect(serialComponentsServices.updateSerialComponent).toHaveBeenCalledWith(
      '1',
      body,
    );
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).patch('/serial-items/1').send(body);

    expect(res.status).toBe(401);
    expect(
      serialComponentsServices.updateSerialComponent,
    ).not.toHaveBeenCalled();
  });
});

describe('DELETE /serial-items/:id', () => {
  it('returns 200 with deletedSerialComponent and calls deleteSerialComponent with the id', async () => {
    serialComponentsServices.deleteSerialComponent.mockResolvedValue(
      mockSerialComponent,
    );

    const res = await request(app)
      .delete('/serial-items/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('deletedSerialComponent');
    expect(res.body).toHaveProperty('message');
    expect(serialComponentsServices.deleteSerialComponent).toHaveBeenCalledWith(
      '1',
    );
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).delete('/serial-items/1');

    expect(res.status).toBe(401);
    expect(
      serialComponentsServices.deleteSerialComponent,
    ).not.toHaveBeenCalled();
  });
});
