import { Router } from 'express';
import { getGrowthStats, getFunnelStats, getTopPerformers } from '../controllers/analytics';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.get('/growth', protect, authorize(['admin']), getGrowthStats);
router.get('/funnel', protect, authorize(['admin']), getFunnelStats);
router.get('/performers', protect, authorize(['admin']), getTopPerformers);

export default router;
