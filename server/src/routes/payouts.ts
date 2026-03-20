import { Router } from 'express';
import { setupPayoutMethod, requestPayout, adminProcessPayout, getPayoutStats, getAdminPayoutRequests } from '../controllers/payouts';

const router = Router();

router.post('/setup', setupPayoutMethod);
router.post('/request', requestPayout);
router.get('/admin/requests', getAdminPayoutRequests);
router.post('/admin/process', adminProcessPayout);
router.get('/user/:userId', getPayoutStats);

export default router;
