import { Router } from 'express';
import { getAllUsers, suspendUser, updateUserProfile, deleteUser } from '../controllers/userController';

const router = Router();

router.get('/', getAllUsers);
router.put('/:id/suspend', suspendUser);
router.put('/:id/profile', updateUserProfile);
router.delete('/:id', deleteUser);

export default router;
