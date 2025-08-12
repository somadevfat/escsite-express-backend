import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

export type AuthTokenPayload = JwtPayload & {
  sub: string; // user id as string per JWT spec
  email: string;
  isAdmin: boolean;
};

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not set');
  }
  return secret;
}

export function getJwtExpiresInSeconds(): number {
  const raw = process.env.JWT_EXPIRES_IN ?? '1h';
  if (typeof raw === 'number') return raw;
  const match = String(raw).match(/^(\d+)([smhd])?$/i);
  if (!match) return 3600; // fallback 1h
  const value = Number(match[1]);
  const unit = (match[2] || 's').toLowerCase();
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * (multipliers[unit] ?? 1);
}

export function signAuthToken(payload: AuthTokenPayload, options: SignOptions = {}): string {
  const secret = getJwtSecret();
  const expiresIn: SignOptions['expiresIn'] = options.expiresIn ?? getJwtExpiresInSeconds();
  return jwt.sign(payload, secret, { expiresIn });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  const secret = getJwtSecret();
  const decoded = jwt.verify(token, secret);
  return decoded as AuthTokenPayload;
}


