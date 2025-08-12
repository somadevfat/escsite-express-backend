import { IUserRepository } from '../../domain/repositories/userRepository';
import { User } from '../../domain/entities/user';
import { getPrismaClient } from '../prisma/client';

export class PrismaUserRepository implements IUserRepository {
  private prisma = getPrismaClient();

  async findMe(): Promise<User> {
    // 仮: 最初のユーザーをログインユーザーとして返す（本番は認証統合後に差し替え）
    const user = await this.prisma.user.findFirst();
    if (!user) {
      const now = new Date();
      const created = await this.prisma.user.create({
        data: {
          email: 'admin@lh.sandbox',
          isAdmin: true,
          createdAt: now,
          updatedAt: now,
          createdBy: 1,
          updatedBy: 1,
        },
      });
      return created as unknown as User;
    }
    return user as unknown as User;
  }
}


