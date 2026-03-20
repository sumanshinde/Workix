import { Router } from 'express';
import { getReferralStats, validateReferralCode } from '../controllers/referrals';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/stats/:userId', authenticate, getReferralStats);
router.get('/validate', validateReferralCode); // Public validation for sign-up form

export default router;
