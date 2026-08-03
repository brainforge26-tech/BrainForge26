import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as adminController from './admin.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/stats', adminController.getStats);

export default router;
