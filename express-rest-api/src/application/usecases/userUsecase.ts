import { IUserRepository } from '../../domain/repositories/userRepository';
import { User } from '../../domain/entities/user';

export class UserUsecase {
  constructor(private readonly userRepository: IUserRepository) {}

  async getMyUser(): Promise<User> {
    // 認証導入前のため、固定の"現在のユーザー"を返す
    return this.userRepository.findMe();
  }
}
