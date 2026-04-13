const request = require('supertest');
const jwt = require('jsonwebtoken');

jest.mock('../services/ingestServices');
const ingestServices = require('../services/ingestServices');

const app = require('../app');

const SECRET = process.env.JWT;
const makeToken = (payload = {}) =>
  jwt.sign({ id: 1, username: 'testuser', role: 'hrh', ...payload }, SECRET);

const fakeFileBuffer = Buffer.from('fake excel content');

afterEach(() => jest.clearAllMocks());

describe('POST /ingest/components', () => {
  it('returns 201 and calls ingestComponents with the uploaded file and decoded user', async () => {
    ingestServices.ingestComponents.mockResolvedValue(undefined);

    const res = await request(app)
      .post('/ingest/components')
      .set('Cookie', `token=${makeToken()}`)
      .attach('file', fakeFileBuffer, 'components.xlsx');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Upload successful.');
    expect(ingestServices.ingestComponents).toHaveBeenCalledWith(
      expect.objectContaining({ originalname: 'components.xlsx' }),
      expect.objectContaining({ id: 1, username: 'testuser' }),
    );
  });

  it('returns 400 when no file is attached — service is never called', async () => {
    const res = await request(app)
      .post('/ingest/components')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'No file uploaded.');
    expect(ingestServices.ingestComponents).not.toHaveBeenCalled();
  });

  it('returns 401 with no token', async () => {
    const res = await request(app)
      .post('/ingest/components')
      .attach('file', fakeFileBuffer, 'components.xlsx');

    expect(res.status).toBe(401);
    expect(ingestServices.ingestComponents).not.toHaveBeenCalled();
  });

  it('returns 500 when service throws', async () => {
    ingestServices.ingestComponents.mockRejectedValue(new Error('Parse error'));

    const res = await request(app)
      .post('/ingest/components')
      .set('Cookie', `token=${makeToken()}`)
      .attach('file', fakeFileBuffer, 'components.xlsx');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message');
  });
});

describe('POST /ingest/end-items', () => {
  it('returns 201 and calls ingestEndItems with the uploaded file and decoded user', async () => {
    ingestServices.ingestEndItems.mockResolvedValue(undefined);

    const res = await request(app)
      .post('/ingest/end-items')
      .set('Cookie', `token=${makeToken()}`)
      .attach('file', fakeFileBuffer, 'end-items.xlsx');

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('message', 'Upload successful.');
    expect(ingestServices.ingestEndItems).toHaveBeenCalledWith(
      expect.objectContaining({ originalname: 'end-items.xlsx' }),
      expect.objectContaining({ id: 1, username: 'testuser' }),
    );
  });

  it('returns 400 when no file is attached — service is never called', async () => {
    const res = await request(app)
      .post('/ingest/end-items')
      .set('Cookie', `token=${makeToken()}`);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message', 'No file uploaded.');
    expect(ingestServices.ingestEndItems).not.toHaveBeenCalled();
  });

  it('returns 401 with no token', async () => {
    const res = await request(app)
      .post('/ingest/end-items')
      .attach('file', fakeFileBuffer, 'end-items.xlsx');

    expect(res.status).toBe(401);
    expect(ingestServices.ingestEndItems).not.toHaveBeenCalled();
  });

  it('returns 500 when service throws', async () => {
    ingestServices.ingestEndItems.mockRejectedValue(new Error('Parse error'));

    const res = await request(app)
      .post('/ingest/end-items')
      .set('Cookie', `token=${makeToken()}`)
      .attach('file', fakeFileBuffer, 'end-items.xlsx');

    expect(res.status).toBe(500);
    expect(res.body).toHaveProperty('message');
  });
});
