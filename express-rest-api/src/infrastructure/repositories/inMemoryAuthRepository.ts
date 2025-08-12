import { IAuthRepository } from '../../domain/repositories/authRepository';
import { signAuthToken } from '../../config/jwt';

export class InMemoryAuthRepository implements IAuthRepository {
  private readonly adminEmail = 'admin@lh.sandbox';
  private readonly userEmail = 'user@lh.sandbox';
  private readonly password = 'pass';

  async signin(email: string, password: string, admin?: boolean): Promise<string> {
    const ok = password === this.password && (admin ? email === this.adminEmail : true);
    if (!ok) {
      throw new Error('Invalid credentials');
    }
    const payload = {
      sub: admin ? '1' : '2',
      email,
      isAdmin: !!admin,
    } as const;
    return signAuthToken(payload);
  }

  async signout(_token?: string): Promise<void> {
    return;
  }

  async signup(email: string, password: string): Promise<string> {
    // 簡易に password 一致を不要にし、トークンを発行（本番はDB登録・重複チェックなど）
    if (!email || !password) {
      throw new Error('Invalid signup payload');
    }
    const payload = {
      sub: '2',
      email,
      isAdmin: false,
    } as const;
    return signAuthToken(payload);
  }
}


