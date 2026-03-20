import { Router } from 'express';
import { createDispute, getDisputes, resolveDispute, rejectDispute } from '../controllers/disputes';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

router.post('/create', authenticate, createDispute);
router.get('/', authenticate, authorize(['admin']), getDisputes);
router.put('/:id/resolve', authenticate, authorize(['admin']), resolveDispute);
router.put('/:id/reject', authenticate, authorize(['admin']), rejectDispute);

export default router;
