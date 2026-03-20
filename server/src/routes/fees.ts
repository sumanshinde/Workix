import { Router } from 'express';
import { getPlatformFees, updatePlatformFees, computeFeeBreakdown, getTransactions } from '../controllers/fees';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, getPlatformFees);
router.put('/', authenticate, authorize(['admin']), updatePlatformFees);
router.post('/calculate', authenticate, computeFeeBreakdown);
router.get('/transactions', authenticate, authorize(['admin']), getTransactions);

export default router;
