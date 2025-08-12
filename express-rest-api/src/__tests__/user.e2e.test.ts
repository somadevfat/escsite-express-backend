import request from 'supertest';
import { createApp } from '../main';

describe('My User API E2E', () => {
  const app = createApp();

  it('GET /api/my/user should return current user', async () => {
    const res = await request(app).get('/api/my/user');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('isAdmin');
  });
});


