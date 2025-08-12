import request from 'supertest';
import { createApp } from '../main';

describe('Items API Validation E2E', () => {
  const app = createApp();

  it('GET /api/items with valid query should return 200', async () => {
    const res = await request(app).get('/api/items?limit=2&page=2&price_gte=100&price_lte=2000&name_like=ペン');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/items with invalid limit should return 422', async () => {
    const res = await request(app).get('/api/items?limit=abc');
    expect(res.status).toBe(422);
    expect(res.body).toHaveProperty('validationErrors');
  });

  it('GET /api/items with negative price_lt should return 422', async () => {
    const res = await request(app).get('/api/items?price_lt=-1');
    expect(res.status).toBe(422);
  });
});


