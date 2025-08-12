import { Request, Response } from 'express';
import { UserUsecase } from '../../application/usecases/userUsecase';

export class UserController {
  constructor(private readonly userUsecase: UserUsecase) {}

  async getMe(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId;
      const user = await this.userUsecase.getMyUser(userId);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to get user', statusCode: 500 });
    }
  }
}
