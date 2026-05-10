import { Router } from 'express';
import { issueFine, getFinesForDriver, getFineById, payFine, getPaymentsForDriver, getAllFines, getAdminStats } from '../controllers/fineController';

const router = Router();

router.get('/stats', getAdminStats);
router.post('/issue', issueFine);
router.get('/driver/:driverId', getFinesForDriver);
router.get('/payments/:driverId', getPaymentsForDriver);
router.get('/all', getAllFines);
router.get('/:id', getFineById);
router.post('/:id/pay', payFine);

export default router;
