import { ICartRepository } from '../../domain/repositories/cartRepository';
import { Cart } from '../../domain/entities/cart';

export class InMemoryCartRepository implements ICartRepository {
  private carts: Cart[] = [];
  private nextId = 1;

  async findAllByUser(userId: number): Promise<Cart[]> {
    return this.carts.filter(c => c.userId === userId);
  }

  async upsertMany(userId: number, items: { item_id: number; quantity: number }[]): Promise<Cart[]> {
    const now = new Date().toISOString();
    const actorId = userId;
    for (const { item_id, quantity } of items) {
      const index = this.carts.findIndex(c => c.userId === userId && c.itemId === item_id);
      if (index >= 0) {
        this.carts[index] = {
          ...this.carts[index],
          quantity,
          updatedAt: now,
          updatedBy: actorId,
        };
      } else {
        this.carts.push({
          id: this.nextId++,
          userId,
          itemId: item_id,
          quantity,
          createdAt: now,
          updatedAt: now,
          createdBy: actorId,
          updatedBy: actorId,
        });
      }
    }
    return this.findAllByUser(userId);
  }
}


