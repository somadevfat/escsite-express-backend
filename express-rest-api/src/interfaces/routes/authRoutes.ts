import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { validate } from '../validate';
import { signinSchema, signupSchema } from '../dto/authDto';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  router.post('/signin', validate(signinSchema), (req, res) => authController.signin(req, res));
  router.post('/admin/signin', validate(signinSchema), (req, res) => authController.adminSignin(req, res));
  router.post('/signout', (req, res) => authController.signout(req, res));
  router.post('/signup', validate(signupSchema), (req, res) => authController.signup(req, res));

  return router;
}


