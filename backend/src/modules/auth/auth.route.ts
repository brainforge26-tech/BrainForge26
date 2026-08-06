import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import * as authController from './auth.controller';

const router = Router();

// Public routes
router.post('/login',         authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout',        authController.logout);

// Protected routes (require JWT)
router.get('/me',              authenticate, authController.getMe);
router.post('/change-password', authenticate, authController.changePassword);

export default router;
