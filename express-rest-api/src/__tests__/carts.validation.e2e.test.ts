import request from 'supertest';
import { createApp } from '../main';

describe('Carts API Validation E2E', () => {
  const app = createApp();

  it('POST /api/carts valid should return 200', async () => {
    const res = await request(app)
      .post('/api/carts')
      .send([{ item_id: 1, quantity: 2 }])
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('POST /api/carts negative quantity should return 422', async () => {
    const res = await request(app)
      .post('/api/carts')
      .send([{ item_id: 1, quantity: -1 }])
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(422);
  });

  it('POST /api/carts empty array should return 422', async () => {
    const res = await request(app)
      .post('/api/carts')
      .send([])
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(422);
  });
});


