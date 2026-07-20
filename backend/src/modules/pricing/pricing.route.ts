import { Router } from 'express';
import * as PC from './pricing.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';

const router = Router();

// Public — homepage reads active plans
router.get('/', PC.listPlans);
router.get('/:id', PC.getPlan);

// Manager / Admin — write
router.post('/',          authenticate, authorize('MANAGER','ADMIN'), PC.createPlan);
router.patch('/:id',      authenticate, authorize('MANAGER','ADMIN'), PC.updatePlan);
router.delete('/:id',     authenticate, authorize('MANAGER','ADMIN'), PC.deletePlan);
router.post('/reorder',   authenticate, authorize('MANAGER','ADMIN'), PC.reorderPlans);

export default router;
