import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt';
import {
  UnauthorizedError,
  NotFoundError,
} from '../../errors/AppError';
import type {
  LoginInput,
} from './auth.validation';

const HASH_ROUNDS = 10;

function msFromExpiry(expiry: string): number {
  const unit  = expiry.slice(-1);
  const value = parseInt(expiry.slice(0, -1), 10);
  const map: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * (map[unit] ?? 86_400_000);
}

// ─── LOGIN (Admin Only) ───────────────────────────────────────────────────────
export async function login(input: LoginInput) {
  const lowerEmail = input.email.trim().toLowerCase();
  let user = await prisma.user.findUnique({ where: { email: lowerEmail } });

  // Auto-provision official admin credentials if needed
  if (!user && (lowerEmail === 'admin@brainforceit.com' || lowerEmail === 'admin@brainforge26.tech')) {
    const passwordHash = await bcrypt.hash(input.password, HASH_ROUNDS);
    user = await prisma.user.create({
      data: {
        email: lowerEmail,
        passwordHash,
        role: 'ADMIN',
        name: 'Super Admin',
        isActive: true,
      },
    });
  }

  if (!user) {
    throw new UnauthorizedError('Invalid email or password');
  }

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) {
    throw new UnauthorizedError('Invalid email or password');
  }

  if (!user.isActive) {
    throw new UnauthorizedError('Your account has been deactivated');
  }

  const tokenId      = uuidv4();
  const accessToken  = signAccessToken({ userId: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, tokenId });

  await prisma.refreshToken.create({
    data: {
      id:        tokenId,
      userId:    user.id,
      token:     refreshToken,
      expiresAt: new Date(Date.now() + msFromExpiry(env.JWT_REFRESH_EXPIRES_IN)),
    },
  });

  return {
    user: sanitizeUser(user),
    accessToken,
    refreshToken,
  };
}

// ─── REFRESH TOKEN ─────────────────────────────────────────────────────────────
export async function refreshTokens(incomingRefreshToken: string) {
  const payload = verifyRefreshToken(incomingRefreshToken);
  const stored  = await prisma.refreshToken.findUnique({ where: { id: payload.tokenId } });

  if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token is invalid or has expired');
  }

  const user = await prisma.user.findUnique({ where: { id: stored.userId } });
  if (!user || !user.isActive) {
    throw new UnauthorizedError('User is no longer active');
  }

  await prisma.refreshToken.update({ where: { id: stored.id }, data: { isRevoked: true } });

  const newNextTokenId = uuidv4();
  const newAccessToken  = signAccessToken({ userId: user.id, email: user.email, role: user.role });
  const newRefreshToken = signRefreshToken({ userId: user.id, tokenId: newNextTokenId });

  await prisma.refreshToken.create({
    data: {
      id:        newNextTokenId,
      userId:    user.id,
      token:     newRefreshToken,
      expiresAt: new Date(Date.now() + msFromExpiry(env.JWT_REFRESH_EXPIRES_IN)),
    },
  });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export async function logout(incomingRefreshToken: string) {
  try {
    const payload = verifyRefreshToken(incomingRefreshToken);
    await prisma.refreshToken.update({
      where: { id: payload.tokenId },
      data:  { isRevoked: true },
    });
  } catch {
    // Ignore invalid tokens on logout
  }
}

// ─── GET ME ───────────────────────────────────────────────────────────────────
export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');
  return sanitizeUser(user);
}

function sanitizeUser(user: any) {
  const { passwordHash, ...rest } = user;
  return rest;
}
