import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as portfolioController from './portfolio.controller';

const router = Router();

// Public routes
router.get('/public', portfolioController.getPublicProjects);
router.get('/industries', portfolioController.getIndustries);
router.get('/slug/:id', portfolioController.getProject);

// Admin Industries management
router.post('/industries', authenticate, authorize('ADMIN'), portfolioController.createIndustry);
router.put('/industries/:id', authenticate, authorize('ADMIN'), portfolioController.updateIndustry);
router.delete('/industries/:id', authenticate, authorize('ADMIN'), portfolioController.deleteIndustry);

// Admin Portfolio CRUD
router.get('/', authenticate, authorize('ADMIN'), portfolioController.getAllProjects);
router.get('/:id', portfolioController.getProject);
router.post('/', authenticate, authorize('ADMIN'), portfolioController.createProject);
router.put('/:id', authenticate, authorize('ADMIN'), portfolioController.updateProject);
router.patch('/:id', authenticate, authorize('ADMIN'), portfolioController.updateProject);
router.delete('/:id', authenticate, authorize('ADMIN'), portfolioController.deleteProject);

export default router;
