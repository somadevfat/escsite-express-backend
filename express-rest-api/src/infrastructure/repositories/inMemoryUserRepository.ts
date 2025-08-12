import { IUserRepository } from '../../domain/repositories/userRepository';
import { User } from '../../domain/entities/user';

export class InMemoryUserRepository implements IUserRepository {
  private readonly currentUser: User;

  constructor() {
    const now = new Date().toISOString();
    this.currentUser = {
      id: 1,
      email: 'admin@lh.sandbox',
      emailVerifiedAt: now,
      emailReissueToken: null,
      isAdmin: true,
      createdAt: now,
      updatedAt: now,
      createdBy: 1,
      updatedBy: 1,
    };
  }

  async findMe(): Promise<User> {
    return this.currentUser;
  }
}
