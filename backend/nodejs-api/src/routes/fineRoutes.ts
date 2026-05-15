import { Router } from 'express';
import { issueFine, getFinesForDriver, getFineById, payFine, getPaymentsForDriver, getAllFines, getAdminStats, createPayPalOrder, capturePayPalOrder } from '../controllers/fineController';

const router = Router();

router.get('/stats', getAdminStats);
router.post('/issue', issueFine);
router.get('/driver/:driverId', getFinesForDriver);
router.get('/payments/:driverId', getPaymentsForDriver);
router.get('/all', getAllFines);
router.get('/:id', getFineById);
router.post('/:id/pay', payFine);
router.post('/:id/paypal/create-order', createPayPalOrder);
router.post('/:id/paypal/capture-order', capturePayPalOrder);

export default router;
