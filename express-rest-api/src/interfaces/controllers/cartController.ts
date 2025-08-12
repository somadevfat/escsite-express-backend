import { Request, Response } from 'express';
import { CartUsecase } from '../../application/usecases/cartUsecase';

export class CartController {
  constructor(private readonly cartUsecase: CartUsecase) { }

  async list(_req: Request, res: Response): Promise<void> {
    try {
      const userId = 1; // 認証導入前の固定
      const carts = await this.cartUsecase.list(userId);
      // Swagger 経由でも安定させるため、防御的に必ず配列で返す
      res.status(200).json(Array.isArray(carts) ? carts : []);
    } catch (e) {
      res.status(500).json({ error: 'Failed to get carts', statusCode: 500 });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const userId = 1; // 認証導入前の固定
      const items = req.body as { item_id: number; quantity: number }[];
      const carts = await this.cartUsecase.update(userId, items);
      res.status(200).json(carts);
    } catch (e) {
      res.status(500).json({ error: 'Failed to update carts', statusCode: 500 });
    }
  }
}


