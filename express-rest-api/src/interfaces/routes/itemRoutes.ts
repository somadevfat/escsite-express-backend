/**
 * Item関連のルーティング設定
 * RESTful APIのエンドポイントを定義
 */

import { Router } from 'express';
import { ItemController } from '../controllers/itemController';
import { UserController } from '../controllers/userController';
import { createUserRoutes } from './userRoutes';
import { validate } from '../validate';
import { createItemSchema, updateItemSchema } from '../dto/itemDto';

/**
 * Itemエンドポイントのルーティングを設定
 * @param itemController ItemControllerのインスタンス
 * @returns 設定済みのExpressルーター
 */
export function createItemRoutes(itemController: ItemController): Router {
  const router = Router();

  // GET /items - 商品一覧取得（ページネーション付き）
  router.get('/', (req, res) => itemController.getAll(req, res));

  // POST /items - 商品作成
  router.post('/', validate(createItemSchema), (req, res) => itemController.create(req, res));

  // GET /items/{ItemId} - 商品詳細取得
  router.get('/:ItemId', (req, res) => itemController.getById(req, res));

  // PUT /items/{ItemId} - 商品更新
  router.put('/:ItemId', validate(updateItemSchema), (req, res) => itemController.update(req, res));

  // DELETE /items/{ItemId} - 商品削除
  router.delete('/:ItemId', (req, res) => itemController.delete(req, res));

  return router;
}

/**
 * すべてのAPIルートを設定
 * 将来的に他のリソース（users, cartsなど）も追加予定
 */
export function createApiRoutes(itemController: ItemController, userController: UserController): Router {
  const apiRouter = Router();

  // Items関連のルートを /api/items に設定
  apiRouter.use('/items', createItemRoutes(itemController));

  // My User関連のルートを /api/my/user に設定
  apiRouter.use('/my/user', createUserRoutes(userController));
  // apiRouter.use('/carts', createCartRoutes(cartController));

  return apiRouter;
}
