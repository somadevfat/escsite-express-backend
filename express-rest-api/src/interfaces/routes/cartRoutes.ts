import { Router } from 'express';
import { CartController } from '../controllers/cartController';

export function createCartRoutes(cartController: CartController): Router {
  const router = Router();

  // GET /carts - カート一覧
  router.get('/', (req, res) => cartController.list(req, res));

  // POST /carts - カート更新（配列を受け取り upsert）
  router.post('/', (req, res) => cartController.update(req, res));

  return router;
}


