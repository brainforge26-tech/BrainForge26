import { Router } from 'express';
import * as CC from './client.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';

const router = Router();
router.use(authenticate, authorize('CLIENT'));

router.get('/stats',                              CC.getDashboardStats);
router.get('/profile',                            CC.getMyProfile);
router.patch('/profile',                          CC.updateMyProfile);
router.get('/projects',                           CC.getMyProjects);
router.get('/projects/:id',                       CC.getMyProjectById);
router.get('/payments',                           CC.getMyPayments);
router.get('/files',                              CC.getMyFiles);
router.get('/conversation',                       CC.getConversation);
router.get('/conversation/:conversationId/messages', CC.getMessages);
router.post('/messages',                          CC.sendMessage);
router.patch('/conversation/:conversationId/read', CC.markRead);

export default router;
