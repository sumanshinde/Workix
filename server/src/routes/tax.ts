import { Router } from 'express';
import { getTaxSummary, getInvoices } from '../controllers/tax';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/summary', protect, getTaxSummary);
router.get('/invoices', protect, getInvoices);

export default router;
