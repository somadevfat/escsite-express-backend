import bcrypt from 'bcrypt';
import { IAuthRepository } from '../../domain/repositories/authRepository';
import { getPrismaClient } from '../prisma/client';
import { signAuthToken } from '../../config/jwt';

export class PrismaAuthRepository implements IAuthRepository {
  private prisma = getPrismaClient();

  async signin(email: string, password: string, admin = false): Promise<string> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      throw new Error('Invalid credentials');
    }
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      throw new Error('Invalid credentials');
    }
    if (admin && !user.isAdmin) {
      throw new Error('Invalid credentials');
    }
    return signAuthToken({ sub: String(user.id), email: user.email, isAdmin: !!user.isAdmin });
  }

  async signout(_token?: string): Promise<void> {
    return;
  }

  async signup(email: string, password: string): Promise<string> {
    const exists = await this.prisma.user.findUnique({ where: { email } });
    if (exists) {
      throw new Error('User already exists');
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const now = new Date();
    const created = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        isAdmin: false,
        createdAt: now,
        updatedAt: now,
        createdBy: 1,
        updatedBy: 1,
      },
    });
    return signAuthToken({ sub: String(created.id), email: created.email, isAdmin: false });
  }
}


