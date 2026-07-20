import { Router } from 'express';
import * as PC from './project.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';

const router = Router();

router.use(authenticate);

// Any authenticated user can view projects (service enforces ownership)
router.get('/',    PC.listProjects);
router.get('/:id', PC.getProject);

// Manager / Admin only — write operations
router.post('/',                             authorize('MANAGER','ADMIN'), PC.createProject);
router.patch('/:id',                         authorize('MANAGER','ADMIN'), PC.updateProject);
router.delete('/:id',                        authorize('MANAGER','ADMIN'), PC.deleteProject);
router.post('/:id/developers',               authorize('MANAGER','ADMIN'), PC.assignDevelopers);
router.delete('/:id/developers/:devId',      authorize('MANAGER','ADMIN'), PC.removeDeveloper);
router.post('/:id/progress',                 authorize('MANAGER','ADMIN'), PC.postProgressUpdate);
router.get('/:id/progress',                  PC.listProgressUpdates);

export default router;
