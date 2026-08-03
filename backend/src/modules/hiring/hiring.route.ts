import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as hiringController from './hiring.controller';

const router = Router();

// Public routes
router.get('/jobs/public', hiringController.getPublicJobs);
router.get('/jobs/slug/:id', hiringController.getJob);
router.post('/applications/apply', hiringController.submitApplication);

// Admin Jobs CRUD
router.get('/jobs', authenticate, authorize('ADMIN'), hiringController.getAllJobs);
router.get('/jobs/:id', hiringController.getJob);
router.post('/jobs', authenticate, authorize('ADMIN'), hiringController.createJob);
router.put('/jobs/:id', authenticate, authorize('ADMIN'), hiringController.updateJob);
router.patch('/jobs/:id', authenticate, authorize('ADMIN'), hiringController.updateJob);
router.delete('/jobs/:id', authenticate, authorize('ADMIN'), hiringController.deleteJob);

// Admin Applications management
router.get('/applications', authenticate, authorize('ADMIN'), hiringController.getAllApplications);
router.get('/applications/:id', authenticate, authorize('ADMIN'), hiringController.getApplication);
router.patch('/applications/:id/status', authenticate, authorize('ADMIN'), hiringController.updateApplicationStatus);
router.delete('/applications/:id', authenticate, authorize('ADMIN'), hiringController.deleteApplication);

export default router;
