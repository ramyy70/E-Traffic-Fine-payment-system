import { Router } from 'express';
import { getAllUsers, suspendUser, updateUserProfile } from '../controllers/userController';

const router = Router();

router.get('/', getAllUsers);
router.put('/:id/suspend', suspendUser);
router.put('/:id/profile', updateUserProfile);

export default router;
