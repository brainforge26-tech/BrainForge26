import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate';
import * as authController from './auth.controller';

const router = Router();

router.post('/login', authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
