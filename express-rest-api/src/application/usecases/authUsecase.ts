import { IAuthRepository } from '../../domain/repositories/authRepository';

export class AuthUsecase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async signin(email: string, password: string, admin = false): Promise<{ token: string }> {
    const token = await this.authRepository.signin(email, password, admin);
    return { token };
  }

  async signout(token?: string): Promise<void> {
    await this.authRepository.signout(token);
  }
}


