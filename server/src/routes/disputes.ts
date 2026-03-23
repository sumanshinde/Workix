import { Router } from 'express';
import { raiseDispute, resolveDispute, getDispute, getDisputes } from '../controllers/disputes';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/create', protect, raiseDispute);
router.get('/', protect, getDisputes);
router.get('/:id', protect, getDispute);
router.put('/:id/resolve', protect, authorize(['admin']), resolveDispute);

export default router;
