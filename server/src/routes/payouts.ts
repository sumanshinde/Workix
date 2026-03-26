import { Router } from 'express';
import { setupPayoutMethod, requestPayout, adminProcessPayout, getPayoutStats, getAdminPayoutRequests, getMyPayoutMethod } from '../controllers/payouts';
import { protect, authorize } from '../middleware/auth';

const router = Router();

router.post('/setup', protect, setupPayoutMethod);
router.get('/method', protect, getMyPayoutMethod);
router.post('/request', protect, requestPayout);
router.get('/admin/requests', protect, authorize(['admin']), getAdminPayoutRequests);
router.post('/admin/process', protect, authorize(['admin']), adminProcessPayout);
router.get('/user/:userId', protect, getPayoutStats);

export default router;
