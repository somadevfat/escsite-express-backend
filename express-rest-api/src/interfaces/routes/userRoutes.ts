import { Router } from 'express';
import { UserController } from '../controllers/userController';

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // GET /my/user - ログインユーザー情報
  router.get('/', (req, res) => userController.getMe(req, res));

  return router;
}
