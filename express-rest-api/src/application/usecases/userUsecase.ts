import { IUserRepository } from '../../domain/repositories/userRepository';
import { User } from '../../domain/entities/user';

export class UserUsecase {
  constructor(private readonly userRepository: IUserRepository) { }

  async getMyUser(userId?: number): Promise<User> {
    if (userId && Number.isFinite(userId)) {
      const found = await this.userRepository.findById(userId);
      if (found) return found;
    }
    // フォールバック（従来動作）
    return this.userRepository.findMe();
  }
}
