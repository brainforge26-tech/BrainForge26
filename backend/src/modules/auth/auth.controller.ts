import { Request, Response, NextFunction } from 'express';
import * as AuthService from './auth.service';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  changePasswordSchema,
} from './auth.validation';
import { sendSuccess, sendCreated } from '../../utils/response';
import { BadRequestError } from '../../errors/AppError';

const REFRESH_COOKIE = 'refreshToken';

const cookieOpts = {
  httpOnly: true,
  secure:   process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge:   30 * 24 * 60 * 60 * 1000, // 30 days
  path:     '/',
};

// POST /api/v1/auth/register
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);

    const user = await AuthService.registerClient(parsed.data);
    sendCreated(res, { user }, 'Account created successfully');
  } catch (err) { next(err); }
}

// POST /api/v1/auth/login
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);

    const { accessToken, refreshToken, user } = await AuthService.login(parsed.data);

    res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts);
    sendSuccess(res, { accessToken, user }, 'Login successful');
  } catch (err) { next(err); }
}

// POST /api/v1/auth/refresh-token
export async function refreshToken(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies[REFRESH_COOKIE] as string | undefined;
    if (!token) throw new BadRequestError('No refresh token provided');

    const result = await AuthService.refreshAccessToken(token);
    sendSuccess(res, result, 'Token refreshed');
  } catch (err) { next(err); }
}

// POST /api/v1/auth/logout
export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies[REFRESH_COOKIE] as string | undefined;
    if (token) await AuthService.logout(token);

    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    sendSuccess(res, null, 'Logged out successfully');
  } catch (err) { next(err); }
}

// POST /api/v1/auth/logout-all
export async function logoutAll(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;
    if (userId) await AuthService.logoutAll(userId);

    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    sendSuccess(res, null, 'Logged out from all devices');
  } catch (err) { next(err); }
}

// POST /api/v1/auth/forgot-password
export async function forgotPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = forgotPasswordSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);

    await AuthService.forgotPassword(parsed.data);
    // Always 200 to prevent enumeration
    sendSuccess(res, null, 'If that email exists, a reset link has been sent');
  } catch (err) { next(err); }
}

// POST /api/v1/auth/reset-password
export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = resetPasswordSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);

    await AuthService.resetPassword(parsed.data);
    sendSuccess(res, null, 'Password reset successfully');
  } catch (err) { next(err); }
}

// POST /api/v1/auth/change-password  (authenticated)
export async function changePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;
    if (!userId) throw new BadRequestError('Not authenticated');

    const parsed = changePasswordSchema.safeParse(req.body);
    if (!parsed.success) throw new BadRequestError(parsed.error.issues[0].message);

    await AuthService.changePassword(userId, parsed.data);
    res.clearCookie(REFRESH_COOKIE, { path: '/' });
    sendSuccess(res, null, 'Password changed successfully. Please login again.');
  } catch (err) { next(err); }
}

// GET /api/v1/auth/me  (authenticated)
export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = (req as Request & { user?: { userId: string } }).user?.userId;
    if (!userId) throw new BadRequestError('Not authenticated');

    const user = await AuthService.getMe(userId);
    sendSuccess(res, { user });
  } catch (err) { next(err); }
}

// GET /api/v1/auth/seed
export async function seedAccounts(_req: Request, res: Response, next: NextFunction) {
  try {
    await AuthService.seedProductionAccounts();
    sendSuccess(res, null, 'Production accounts initialized with password123');
  } catch (err) { next(err); }
}
