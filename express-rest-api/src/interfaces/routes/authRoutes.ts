import { Router } from 'express';
import { AuthController } from '../controllers/authController';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  router.post('/signin', (req, res) => authController.signin(req, res));
  router.post('/admin/signin', (req, res) => authController.adminSignin(req, res));
  router.post('/signout', (req, res) => authController.signout(req, res));
  router.post('/signup', (req, res) => authController.signup(req, res));

  return router;
}


