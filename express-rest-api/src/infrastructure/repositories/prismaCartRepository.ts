import { ICartRepository } from '../../domain/repositories/cartRepository';
import { Cart } from '../../domain/entities/cart';
import { getPrismaClient } from '../prisma/client';

export class PrismaCartRepository implements ICartRepository {
  private prisma = getPrismaClient();

  async findAllByUser(userId: number): Promise<Cart[]> {
    const carts = await this.prisma.cart.findMany({ where: { userId }, include: { item: true } });
    return carts.map((c: any) => ({
      id: c.id,
      userId: c.userId,
      itemId: c.itemId,
      quantity: c.quantity,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt.toISOString(),
      createdBy: c.createdBy,
      updatedBy: c.updatedBy,
    }));
  }

  async upsertMany(userId: number, items: { item_id: number; quantity: number }[]): Promise<Cart[]> {
    const now = new Date();
    const actor = userId;
    await this.prisma.$transaction(async (tx) => {
      for (const { item_id, quantity } of items) {
        const existing = await tx.cart.findFirst({ where: { userId, itemId: item_id } });
        if (quantity === 0) {
          if (existing) await tx.cart.delete({ where: { id: existing.id } });
          continue;
        }
        if (existing) {
          await tx.cart.update({ where: { id: existing.id }, data: { quantity, updatedAt: now, updatedBy: actor } });
        } else {
          await tx.cart.create({ data: { userId, itemId: item_id, quantity, createdAt: now, updatedAt: now, createdBy: actor, updatedBy: actor } });
        }
      }
    });
    return this.findAllByUser(userId);
  }
}


