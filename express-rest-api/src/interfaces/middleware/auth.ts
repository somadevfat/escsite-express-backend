import { NextFunction, Request, Response } from 'express';
import { verifyAuthToken } from '../../config/jwt';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      userId: number;
      email: string;
      isAdmin: boolean;
    };
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized', statusCode: 401 });
    return;
  }

  const token = header.substring('Bearer '.length).trim();
  try {
    const payload = verifyAuthToken(token);
    const userId = Number(payload.sub);
    if (!Number.isFinite(userId)) {
      res.status(401).json({ error: 'Unauthorized', statusCode: 401 });
      return;
    }
    req.user = { userId, email: payload.email, isAdmin: payload.isAdmin };
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized', statusCode: 401 });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'Forbidden', statusCode: 403 });
    return;
  }
  next();
}


