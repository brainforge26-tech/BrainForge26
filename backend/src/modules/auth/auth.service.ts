import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../config/database';
import { env } from '../../config/env';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../utils/jwt';
import { sendPasswordResetEmail } from '../../utils/email';
import {
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from '../../errors/AppError';
import type {
  RegisterInput,
  LoginInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  ChangePasswordInput,
} from './auth.validation';

// ─── helpers ─────────────────────────────────────────────────────────────────
const HASH_ROUNDS = 12;

function msFromExpiry(expiry: string): number {
  const unit  = expiry.slice(-1);
  const value = parseInt(expiry.slice(0, -1), 10);
  const map: Record<string, number> = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  return value * (map[unit] ?? 86_400_000);
}

// ─── REGISTER (Client only) ───────────────────────────────────────────────────
export async function registerClient(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) throw new ConflictError('An account with this email already exists');

  const passwordHash = await bcrypt.hash(input.password, HASH_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      role:  'CLIENT',
      clientProfile: {
        create: {
          companyName:   input.companyName,
          contactPerson: input.contactPerson,
          phone:         input.phone,
        },
      },
    },
    include: { clientProfile: true },
  });

  return sanitizeUser(user);
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) throw new UnauthorizedError('Invalid email or password');

  const valid = await bcrypt.compare(input.password, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Invalid email or password');

  if (!user.isActive) throw new UnauthorizedError('Your account has been deactivated');

  const tokenId      = uuidv4();
  const accessToken  = signAccessToken({ userId: user.id, email: user.email, role: user.role });
  const refreshToken = signRefreshToken({ userId: user.id, tokenId });

  // Store refresh token
  await prisma.refreshToken.create({
    data: {
      id:        tokenId,
      userId:    user.id,
      token:     refreshToken,
      expiresAt: new Date(Date.now() + msFromExpiry(env.JWT_REFRESH_EXPIRES_IN)),
    },
  });

  return { accessToken, refreshToken, user: sanitizeUser(user) };
}

// ─── REFRESH TOKEN ────────────────────────────────────────────────────────────
export async function refreshAccessToken(refreshToken: string) {
  let payload: ReturnType<typeof verifyRefreshToken>;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
  if (!stored || stored.isRevoked || stored.expiresAt < new Date()) {
    throw new UnauthorizedError('Refresh token is no longer valid');
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } });
  if (!user || !user.isActive) throw new UnauthorizedError('User not found or deactivated');

  const accessToken = signAccessToken({ userId: user.id, email: user.email, role: user.role });
  return { accessToken, user: sanitizeUser(user) };
}

// ─── LOGOUT ───────────────────────────────────────────────────────────────────
export async function logout(refreshToken: string) {
  await prisma.refreshToken.updateMany({
    where: { token: refreshToken },
    data:  { isRevoked: true },
  });
}

// ─── LOGOUT ALL DEVICES ───────────────────────────────────────────────────────
export async function logoutAll(userId: string) {
  await prisma.refreshToken.updateMany({
    where: { userId },
    data:  { isRevoked: true },
  });
}

// ─── FORGOT PASSWORD ──────────────────────────────────────────────────────────
export async function forgotPassword(input: ForgotPasswordInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  // Always return success to prevent user enumeration
  if (!user) return;

  // Invalidate existing tokens
  await prisma.passwordReset.updateMany({
    where: { userId: user.id, isUsed: false },
    data:  { isUsed: true },
  });

  const rawToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + msFromExpiry(env.RESET_PASS_TOKEN_EXPIRES));

  await prisma.passwordReset.create({
    data: { userId: user.id, token: rawToken, expiresAt },
  });

  const resetLink = `${env.RESET_PASSWORD_LINK}?token=${rawToken}`;
  await sendPasswordResetEmail(user.email, resetLink);
}

// ─── RESET PASSWORD ───────────────────────────────────────────────────────────
export async function resetPassword(input: ResetPasswordInput) {
  const record = await prisma.passwordReset.findUnique({ where: { token: input.token } });
  if (!record || record.isUsed || record.expiresAt < new Date()) {
    throw new BadRequestError('Reset token is invalid or has expired');
  }

  const passwordHash = await bcrypt.hash(input.password, HASH_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: record.userId },
      data:  { passwordHash },
    }),
    prisma.passwordReset.update({
      where: { id: record.id },
      data:  { isUsed: true },
    }),
    // Revoke all refresh tokens for security
    prisma.refreshToken.updateMany({
      where: { userId: record.userId },
      data:  { isRevoked: true },
    }),
  ]);
}

// ─── CHANGE PASSWORD (authenticated) ─────────────────────────────────────────
export async function changePassword(userId: string, input: ChangePasswordInput) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new NotFoundError('User not found');

  const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
  if (!valid) throw new UnauthorizedError('Current password is incorrect');

  const passwordHash = await bcrypt.hash(input.newPassword, HASH_ROUNDS);
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } });

  // Revoke all refresh tokens so other sessions are invalidated
  await prisma.refreshToken.updateMany({
    where: { userId },
    data:  { isRevoked: true },
  });
}

// ─── GET ME ───────────────────────────────────────────────────────────────────
export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      adminProfile:     true,
      managerProfile:   true,
      developerProfile: true,
      clientProfile:    true,
    },
  });
  if (!user) throw new NotFoundError('User not found');
  return sanitizeUser(user);
}

// ─── helper ───────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function sanitizeUser(user: any) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...safe } = user;
  return safe;
}
