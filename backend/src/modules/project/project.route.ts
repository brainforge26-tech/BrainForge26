import { Router } from 'express';
import * as PC from './project.controller';
import * as MC from './milestone.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';

const router = Router();

// Public unauthenticated route
router.get('/public', PC.listPublicProjects);

router.use(authenticate);

// ── Projects ──────────────────────────────────────────────────────────────────
router.get('/',     PC.listProjects);
router.get('/:id',  PC.getProject);
router.post('/',                       authorize('MANAGER','ADMIN'), PC.createProject);
router.patch('/:id',                   authorize('MANAGER','ADMIN'), PC.updateProject);
router.delete('/:id',                  authorize('MANAGER','ADMIN'), PC.deleteProject);

// ── Team assignment ───────────────────────────────────────────────────────────
router.post('/:id/developers',           authorize('MANAGER','ADMIN'), PC.assignDevelopers);
router.delete('/:id/developers/:devId',  authorize('MANAGER','ADMIN'), PC.removeDeveloper);

// ── Progress updates ──────────────────────────────────────────────────────────
router.post('/:id/progress',   authorize('MANAGER','ADMIN'), PC.postProgressUpdate);
router.get('/:id/progress',    PC.listProgressUpdates);

// ── Milestones ────────────────────────────────────────────────────────────────
router.post('/:projectId/milestones',                 authorize('MANAGER','ADMIN'), MC.createMilestone);
router.patch('/:projectId/milestones/reorder',        authorize('MANAGER','ADMIN'), MC.reorderMilestones);
router.patch('/:projectId/milestones/:milestoneId',   authorize('MANAGER','ADMIN'), MC.updateMilestone);
router.delete('/:projectId/milestones/:milestoneId',  authorize('MANAGER','ADMIN'), MC.deleteMilestone);

// ── Timeline stages ───────────────────────────────────────────────────────────
router.post('/:projectId/timeline',           authorize('MANAGER','ADMIN'), MC.addTimelineStage);
router.patch('/:projectId/timeline/:stageId', authorize('MANAGER','ADMIN'), MC.updateTimelineStage);

// ── Gallery ───────────────────────────────────────────────────────────────────
router.get('/:projectId/gallery',             MC.getGallery);
router.post('/:projectId/gallery',            authorize('MANAGER','ADMIN'), MC.addGalleryImage);
router.delete('/:projectId/gallery/:imageId', authorize('MANAGER','ADMIN'), MC.deleteGalleryImage);

export default router;
