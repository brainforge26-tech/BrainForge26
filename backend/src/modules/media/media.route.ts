import { Router } from 'express';
import { authenticate, authorize } from '../../middlewares/authenticate';
import { upload } from '../../middlewares/upload';
import * as mediaController from './media.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN'));

router.get('/', mediaController.getAllMedia);
router.post('/upload', upload.single('file'), mediaController.uploadMedia);
router.delete('/:id', mediaController.deleteMedia);

export default router;
