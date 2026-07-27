import { Router } from 'express';
import * as HPC from './homepage.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';

const router = Router();

// Public routes
router.get('/content', HPC.getContent);
router.get('/testimonials', HPC.getTestimonials);

// Manager/Admin routes
router.use(authenticate, authorize('MANAGER', 'ADMIN'));
router.patch('/content', HPC.updateContent);

export default router;
