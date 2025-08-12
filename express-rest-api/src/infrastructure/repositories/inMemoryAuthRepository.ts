import { IAuthRepository } from '../../domain/repositories/authRepository';

export class InMemoryAuthRepository implements IAuthRepository {
  private readonly adminEmail = 'admin@lh.sandbox';
  private readonly userEmail = 'user@lh.sandbox';
  private readonly password = 'pass';

  async signin(email: string, password: string, admin?: boolean): Promise<string> {
    const ok = password === this.password && (admin ? email === this.adminEmail : true);
    if (!ok) {
      throw new Error('Invalid credentials');
    }
    // 疑似トークン
    return `token-${admin ? 'admin' : 'user'}-${Date.now()}`;
  }

  async signout(_token?: string): Promise<void> {
    return;
  }

  async signup(email: string, password: string): Promise<string> {
    // 簡易に password 一致を不要にし、トークンを発行（本番はDB登録・重複チェックなど）
    if (!email || !password) {
      throw new Error('Invalid signup payload');
    }
    return `token-user-${Date.now()}`;
  }
}


