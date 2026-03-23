import { Router } from 'express';
import { getReferralStats, validateReferralCode, submitReferral } from '../controllers/referrals';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, getReferralStats);
router.post('/submit', authenticate, submitReferral);
router.get('/validate', validateReferralCode);

export default router;
