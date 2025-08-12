import request from 'supertest';
import { createApp } from '../main';

describe('My User API E2E', () => {
  const app = createApp();

  it('GET /api/my/user should return current user with Bearer token', async () => {
    // まずは管理者でサインインしてトークンを取得
    const signin = await request(app)
      .post('/api/auth/signin')
      .send({ email: 'admin@lh.sandbox', password: 'pass' })
      .set('Content-Type', 'application/json');
    expect(signin.status).toBe(200);
    const token = signin.body.token as string;

    const res = await request(app)
      .get('/api/my/user')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email');
    expect(res.body).toHaveProperty('isAdmin');
  });
});


