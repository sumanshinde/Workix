import { Router } from 'express';
import { getOnboardingStatus, setRole, updateOnboardingStep, claimOnboardingReward } from '../controllers/onboarding';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/status', protect, getOnboardingStatus);
router.post('/role', protect, setRole);
router.post('/step', protect, updateOnboardingStep);
router.post('/reward/claim', protect, claimOnboardingReward);

export default router;
