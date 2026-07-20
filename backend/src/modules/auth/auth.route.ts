import { Router } from 'express';
import * as AuthController from './auth.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

// Public routes
router.post('/register',         AuthController.register);
router.post('/login',            AuthController.login);
router.post('/refresh-token',    AuthController.refreshToken);
router.post('/logout',           AuthController.logout);
router.post('/forgot-password',  AuthController.forgotPassword);
router.post('/reset-password',   AuthController.resetPassword);

// Protected routes
router.post('/logout-all',      authenticate, AuthController.logoutAll);
router.post('/change-password', authenticate, AuthController.changePassword);
router.get('/me',               authenticate, AuthController.getMe);

export default router;
