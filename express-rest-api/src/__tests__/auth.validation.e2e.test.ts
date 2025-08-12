import request from 'supertest';
import { createApp } from '../main';

describe('Auth API Validation E2E', () => {
  const app = createApp();

  it('POST /api/auth/signin valid should return 200 and token', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'admin@lh.sandbox', password: 'pass' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/signin invalid email should return 422', async () => {
    const res = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'bad', password: 'pass' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(422);
  });

  it('POST /api/auth/signup missing password should return 422', async () => {
    const res = await request(app)
      .post('/api/auth/signup')
      .send({ email: 'user+bad@example.com' })
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(422);
  });
});


