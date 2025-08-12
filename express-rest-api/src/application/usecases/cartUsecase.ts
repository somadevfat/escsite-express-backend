import { ICartRepository } from '../../domain/repositories/cartRepository';
import { Cart } from '../../domain/entities/cart';

export class CartUsecase {
  constructor(private readonly cartRepository: ICartRepository) {}

  async list(userId: number): Promise<Cart[]> {
    return this.cartRepository.findAllByUser(userId);
  }

  async update(userId: number, items: { item_id: number; quantity: number }[]): Promise<Cart[]> {
    return this.cartRepository.upsertMany(userId, items);
  }
}


