import { Router } from 'express';
import { createAd, getAds, getNearbyFreelancers } from '../controllers/ads';

const router = Router();

router.post('/', createAd);
router.get('/', getAds);
router.get('/nearby', getNearbyFreelancers);

export default router;
