const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/componentsServices');
const componentsServices = require('../services/componentsServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const mockComponent = {
  id: 1,
  niin: '001234567',
  description: 'Test Component',
  arc: 'B',
  uic_id: 1,
  end_item_id: 1,
};

afterEach(() => jest.clearAllMocks());

describe('GET /components', () => {
  it('returns 200 with allComponents and calls getAllComponents with the query object', async () => {
    componentsServices.getAllComponents.mockResolvedValue([mockComponent]);

    const res = await request(app)
      .get('/components')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('allComponents');
    expect(Array.isArray(res.body.allComponents)).toBe(true);
    expect(componentsServices.getAllComponents).toHaveBeenCalledWith({});
  });

  it('passes query string filters to getAllComponents', async () => {
    componentsServices.getAllComponents.mockResolvedValue([mockComponent]);

    await request(app)
      .get('/components?niin=001234567&arc=B')
      .set('Cookie', `token=${makeToken()}`);

    expect(componentsServices.getAllComponents).toHaveBeenCalledWith({ niin: '001234567', arc: 'B' });
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).get('/components');

    expect(res.status).toBe(401);
    expect(componentsServices.getAllComponents).not.toHaveBeenCalled();
  });
});

describe('GET /components/:id', () => {
  it('returns 200 with component and calls getComponentById with the id param', async () => {
    componentsServices.getComponentById.mockResolvedValue(mockComponent);

    const res = await request(app)
      .get('/components/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('component');
    expect(componentsServices.getComponentById).toHaveBeenCalledWith('1');
  });

  it('returns 404 when component not found', async () => {
    const err = new Error('Component not found.');
    err.status = 404;
    componentsServices.getComponentById.mockRejectedValue(err);

    const res = await request(app)
      .get('/components/9999')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(404);
  });
});

describe('GET /components/uic/:uic_id', () => {
  it('returns 200 with components and calls getComponentsByUicId with the uic_id param', async () => {
    componentsServices.getComponentsByUicId.mockResolvedValue([mockComponent]);

    const res = await request(app)
      .get('/components/uic/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('components');
    expect(Array.isArray(res.body.components)).toBe(true);
    expect(componentsServices.getComponentsByUicId).toHaveBeenCalledWith('1');
  });
});

describe('POST /components', () => {
  const body = { niin: '001234567', description: 'Test Component', arc: 'B', uic_id: 1 };

  it('returns 201 with newComponent and calls createComponent with the request body', async () => {
    componentsServices.createComponent.mockResolvedValue(mockComponent);

    const res = await request(app)
      .post('/components')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('newComponent');
    expect(res.body).toHaveProperty('message');
    expect(componentsServices.createComponent).toHaveBeenCalledWith(body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).post('/components').send(body);

    expect(res.status).toBe(401);
    expect(componentsServices.createComponent).not.toHaveBeenCalled();
  });
});

describe('PATCH /components/:id', () => {
  const body = { description: 'Updated' };

  it('returns 200 with updatedComponent and calls updateComponent with the id and body', async () => {
    componentsServices.updateComponent.mockResolvedValue({ ...mockComponent, description: 'Updated' });

    const res = await request(app)
      .patch('/components/1')
      .set('Cookie', `token=${makeToken()}`)
      .send(body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('updatedComponent');
    expect(res.body).toHaveProperty('message');
    expect(componentsServices.updateComponent).toHaveBeenCalledWith('1', body);
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).patch('/components/1').send(body);

    expect(res.status).toBe(401);
    expect(componentsServices.updateComponent).not.toHaveBeenCalled();
  });
});

describe('DELETE /components/:id', () => {
  it('returns 200 with deletedComponent and calls deleteComponent with the id', async () => {
    componentsServices.deleteComponent.mockResolvedValue(mockComponent);

    const res = await request(app)
      .delete('/components/1')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('deletedComponent');
    expect(res.body).toHaveProperty('message');
    expect(componentsServices.deleteComponent).toHaveBeenCalledWith('1');
  });

  it('returns 401 with no token', async () => {
    const res = await request(app).delete('/components/1');

    expect(res.status).toBe(401);
    expect(componentsServices.deleteComponent).not.toHaveBeenCalled();
  });
});
