import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import * as teamController from './team.controller';

const router = Router();

// Public route
router.get('/public', teamController.getPublicTeamMembers);

// Admin protected routes
router.get('/', authenticate, authorize('ADMIN'), teamController.getAllTeamMembers);
router.get('/:id', authenticate, authorize('ADMIN'), teamController.getTeamMemberById);
router.post('/', authenticate, authorize('ADMIN'), teamController.createTeamMember);
router.put('/:id', authenticate, authorize('ADMIN'), teamController.updateTeamMember);
router.patch('/:id', authenticate, authorize('ADMIN'), teamController.updateTeamMember);
router.delete('/:id', authenticate, authorize('ADMIN'), teamController.deleteTeamMember);
router.patch('/:id/toggle-feature', authenticate, authorize('ADMIN'), teamController.toggleFeature);

export default router;
