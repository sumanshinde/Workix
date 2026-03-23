import { Router } from 'express';
import { createInstantOrder, verifyHirePayment } from '../controllers/orders';
import { protect } from '../middleware/auth';

const router = Router();

router.post('/instant-hire', protect, createInstantOrder);
router.post('/verify-payment', protect, verifyHirePayment);

export default router;
