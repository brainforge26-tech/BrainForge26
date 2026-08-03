import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as blogController from './blog.controller';

const router = Router();

// Public routes
router.get('/public', blogController.getPublicBlogs);
router.get('/slug/:id', blogController.getBlog);

// Admin routes
router.get('/', authenticate, authorize('ADMIN'), blogController.getAllBlogs);
router.get('/:id', blogController.getBlog);
router.post('/', authenticate, authorize('ADMIN'), blogController.createBlog);
router.put('/:id', authenticate, authorize('ADMIN'), blogController.updateBlog);
router.patch('/:id', authenticate, authorize('ADMIN'), blogController.updateBlog);
router.delete('/:id', authenticate, authorize('ADMIN'), blogController.deleteBlog);

export default router;
