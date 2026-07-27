import { Router } from 'express';
import * as MC from './message.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.use(authenticate);

// Get all conversations for the user (manager sees all, client sees theirs)
router.get('/conversations', MC.getConversations);

// Create a new conversation
router.post('/conversations', MC.createConversation);

// Get all messages for a conversation
router.get('/:id', MC.getMessages);

// Send a message to a conversation
router.post('/:id', MC.sendMessage);

export default router;
