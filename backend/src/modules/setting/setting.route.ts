import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as settingController from './setting.controller';

const router = Router();

// Public route
router.get('/public', settingController.getPublicSettings);
router.get('/key/:key', settingController.getSettingByKey);

// Admin route
router.put('/:key', authenticate, authorize('ADMIN'), settingController.updateSetting);

export default router;
