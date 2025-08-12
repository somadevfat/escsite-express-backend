import { Request, Response } from 'express';
import { AuthUsecase } from '../../application/usecases/authUsecase';

export class AuthController {
  constructor(private readonly authUsecase: AuthUsecase) { }

  async signin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const result = await this.authUsecase.signin(email, password, false);
      res.status(200).json(result);
    } catch (e) {
      res.status(401).json({ error: 'Unauthorized', statusCode: 401 });
    }
  }

  async adminSignin(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const result = await this.authUsecase.signin(email, password, true);
      res.status(200).json(result);
    } catch (e) {
      res.status(401).json({ error: 'Unauthorized', statusCode: 401 });
    }
  }

  async signout(_req: Request, res: Response): Promise<void> {
    try {
      await this.authUsecase.signout();
      res.status(200).json({});
    } catch (e) {
      res.status(500).json({ error: 'Failed to signout', statusCode: 500 });
    }
  }

  async signup(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body as { email: string; password: string };
      const result = await this.authUsecase.signup(email, password);
      res.status(200).json(result);
    } catch (e) {
      res.status(400).json({ error: 'Failed to signup', statusCode: 400 });
    }
  }
}


