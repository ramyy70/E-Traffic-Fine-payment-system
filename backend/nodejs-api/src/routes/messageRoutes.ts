import { Router } from 'express';
import { sendMessage, getMessagesForUser } from '../controllers/messageController';

const router = Router();

router.post('/', sendMessage);
router.get('/:userId', getMessagesForUser);

export default router;
