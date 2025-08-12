/**
 * Item関連のルーティング設定
 * RESTful APIのエンドポイントを定義
 */

import { Router } from 'express';
import { ItemController } from '../controllers/itemController';
import { UserController } from '../controllers/userController';
import { CartController } from '../controllers/cartController';
import { createCartRoutes } from './cartRoutes';
import { createUserRoutes } from './userRoutes';
import { createAuthRoutes } from './authRoutes';
import { validate } from '../validate';
import { createItemSchema, updateItemSchema, listItemsQuerySchema, itemIdParamSchema } from '../dto/itemDto';
import { authenticate, requireAdmin } from '../middleware/auth';

/**
 * Itemエンドポイントのルーティングを設定
 * @param itemController ItemControllerのインスタンス
 * @returns 設定済みのExpressルーター
 */
export function createItemRoutes(itemController: ItemController): Router {
  const router = Router();

  // GET /items - 商品一覧取得（ページネーション付き）
  router.get('/', validate(listItemsQuerySchema), (req, res) => itemController.getAll(req, res));

  // POST /items - 商品作成（管理者のみ）
  router.post('/', authenticate, requireAdmin, validate(createItemSchema), (req, res) => itemController.create(req, res));

  // GET /items/{ItemId} - 商品詳細取得
  router.get('/:ItemId', validate(itemIdParamSchema), (req, res) => itemController.getById(req, res));

  // PUT /items/{ItemId} - 商品更新（管理者のみ）
  router.put('/:ItemId', authenticate, requireAdmin, validate(itemIdParamSchema), validate(updateItemSchema), (req, res) => itemController.update(req, res));

  // DELETE /items/{ItemId} - 商品削除（管理者のみ）
  router.delete('/:ItemId', authenticate, requireAdmin, validate(itemIdParamSchema), (req, res) => itemController.delete(req, res));

  return router;
}

/**
 * すべてのAPIルートを設定
 * 将来的に他のリソース（users, cartsなど）も追加予定
 */
export function createApiRoutes(itemController: ItemController, userController: UserController, cartController?: CartController, authController?: import('../controllers/authController').AuthController): Router {
  const apiRouter = Router();

  // Items関連のルートを /api/items に設定
  apiRouter.use('/items', createItemRoutes(itemController));

  // My User関連のルートを /api/my/user に設定（JWT 認証必須）
  apiRouter.use('/my/user', authenticate, createUserRoutes(userController));
  if (cartController) {
    apiRouter.use('/carts', createCartRoutes(cartController));
  }

  if (authController) {
    apiRouter.use('/auth', createAuthRoutes(authController));
  }

  return apiRouter;
}
