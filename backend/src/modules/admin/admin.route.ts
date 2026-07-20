import { Router } from 'express';
import * as AdminController from './admin.controller';
import { authenticate } from '../../middlewares/authenticate';
import { authorize }    from '../../middlewares/authenticate';

const router = Router();

// All admin routes require authentication + ADMIN role
router.use(authenticate, authorize('ADMIN'));

router.get('/stats',                   AdminController.getDashboardStats);
router.get('/activity',                AdminController.getRecentActivity);

router.get('/managers',                AdminController.listManagers);
router.post('/managers',               AdminController.createManager);
router.get('/managers/:id',            AdminController.getManager);
router.patch('/managers/:id',          AdminController.updateManager);
router.delete('/managers/:id',         AdminController.deleteManager);
router.patch('/managers/:id/deactivate', AdminController.deactivateManager);

export default router;
