import { Cart } from '../entities/cart';

export interface ICartRepository {
  findAllByUser(userId: number): Promise<Cart[]>;
  upsertMany(userId: number, items: { item_id: number; quantity: number }[]): Promise<Cart[]>;
}


