import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

// ─── Generic helpers (mirrors jwtHelper.ts pattern) ──────────────────────────
const generateToken = (payload: object, secret: string, expiresIn: number | string): string => {
  const options: SignOptions = {
    algorithm: 'HS256',
    expiresIn: expiresIn as SignOptions['expiresIn'],
  };
  return jwt.sign(payload, secret, options);
};

const verifyToken = (token: string, secret: string): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const JwtHelper = { generateToken, verifyToken };

// ─── Typed payloads ───────────────────────────────────────────────────────────
export interface AccessTokenPayload {
  userId: string;
  email:  string;
  role:   string;
}

export interface RefreshTokenPayload {
  userId:  string;
  tokenId: string;
}

// ─── App-specific helpers built on top of JwtHelper ──────────────────────────
export function signAccessToken(payload: AccessTokenPayload): string {
  return JwtHelper.generateToken(payload, env.JWT_ACCESS_SECRET, env.JWT_ACCESS_EXPIRES_IN);
}

export function signRefreshToken(payload: RefreshTokenPayload): string {
  return JwtHelper.generateToken(payload, env.JWT_REFRESH_SECRET, env.JWT_REFRESH_EXPIRES_IN);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  return JwtHelper.verifyToken(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
}

export function verifyRefreshToken(token: string): RefreshTokenPayload {
  return JwtHelper.verifyToken(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
}
