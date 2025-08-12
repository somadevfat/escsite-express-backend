import request from 'supertest';
import { createApp } from '../main';

describe('Items API E2E', () => {
  const app = createApp();

  it('GET /api/items should return paginated list with default pagination', async () => {
    const res = await request(app).get('/api/items');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body).toHaveProperty('currentPage', 1);
    expect(res.body).toHaveProperty('perPage');
    expect(res.body).toHaveProperty('total');
  });

  it('POST /api/items should create a new item and return it', async () => {
    const payload = {
      name: 'すごいキーボード',
      price: 15000,
      content: 'とても打ちやすい、最高のキーボードです。'
    };
    const res = await request(app)
      .post('/api/items')
      .send(payload)
      .set('Content-Type', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.name).toBe(payload.name);
    expect(res.body.price).toBe(payload.price);
  });

  it('GET /api/items?price_gte=1000&price_lte=2000 should filter by price range', async () => {
    const res = await request(app).get('/api/items?price_gte=1000&price_lte=2000');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
    for (const item of res.body.data) {
      expect(item.price).toBeGreaterThanOrEqual(1000);
      expect(item.price).toBeLessThanOrEqual(2000);
    }
  });

  it('GET /api/items/:ItemId should return an item when exists', async () => {
    const res = await request(app).get('/api/items/1');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('PUT /api/items/:ItemId should update an item', async () => {
    const update = { name: 'すごいキーボードV2', price: 18000, content: '価格を改定しました。相変わらず最高のキーボードです。' };
    const res = await request(app)
      .put('/api/items/1')
      .send(update)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('name', update.name);
    expect(res.body).toHaveProperty('price', update.price);
  });

  it('DELETE /api/items/:ItemId should delete an item', async () => {
    // まず作成
    const created = await request(app)
      .post('/api/items')
      .send({ name: '一時的な商品', price: 999, content: '削除対象' })
      .set('Content-Type', 'application/json');
    const id = created.body.id;

    // 次に削除
    const res = await request(app).delete(`/api/items/${id}`);
    expect(res.status).toBe(200);

    // 削除後は 404 を期待
    const after = await request(app).get(`/api/items/${id}`);
    expect(after.status).toBe(404);
  });
});


