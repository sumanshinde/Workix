import { Router } from 'express';
import { getProfileAnalysis, improveProfile } from '../controllers/profile';
import { getCreditScore } from '../controllers/creditScore';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/analysis', protect, getProfileAnalysis);
router.post('/improve', protect, improveProfile);
router.get('/credit-score', protect, getCreditScore);

export default router;
