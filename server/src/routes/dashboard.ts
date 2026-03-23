import { Router } from 'express';
import { getDashboardStats } from '../controllers/dashboard';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/stats', protect, getDashboardStats);

export default router;
