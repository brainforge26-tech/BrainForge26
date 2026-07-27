import { Router } from 'express';
import * as FC from './file.controller';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { upload } from '../../middlewares/upload';

const router = Router();

router.use(authenticate);

// We define route relative to /projects/:projectId/files in server.ts
router.post('/:projectId/files', authorize('MANAGER', 'ADMIN'), upload.single('file'), FC.uploadFile);
router.get('/:projectId/files', authorize('MANAGER', 'ADMIN', 'CLIENT'), FC.getFiles);
router.delete('/:projectId/files/:fileId', authorize('MANAGER', 'ADMIN'), FC.deleteFile);

export default router;
