import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, AccessTokenPayload } from '../utils/jwt';
import { UnauthorizedError, ForbiddenError } from '../errors/AppError';

// Extend Express Request to carry the authenticated user
export interface AuthRequest extends Request {
  user: AccessTokenPayload;
}

// ─── authenticate — verify JWT in Authorization header ───────────────────────
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedError('No access token provided');
    }

    const token   = authHeader.split(' ')[1];
    const payload = verifyAccessToken(token);

    (req as AuthRequest).user = payload;
    next();
  } catch (err) {
    if ((err as Error).name === 'TokenExpiredError') {
      next(new UnauthorizedError('Access token has expired'));
    } else if ((err as Error).name === 'JsonWebTokenError') {
      next(new UnauthorizedError('Invalid access token'));
    } else {
      next(err);
    }
  }
}

// ─── authorize — check role(s) ────────────────────────────────────────────────
export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;
    if (!user) {
      next(new UnauthorizedError('Not authenticated'));
      return;
    }
    if (!roles.includes(user.role)) {
      next(new ForbiddenError(`Access denied. Required role: ${roles.join(' or ')}`));
      return;
    }
    next();
  };
}
