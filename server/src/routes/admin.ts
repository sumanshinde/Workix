import express from 'express';
import { getActivityLogs, getMessages, getUserActivities, getDashboardStats } from '../controllers/admin';
import { protect, authorize } from '../middleware/auth';

const router = express.Router();

router.get('/activity', protect, authorize(['admin']), getActivityLogs);
router.get('/messages', protect, authorize(['admin']), getMessages);
router.get('/users/:id/activities', protect, authorize(['admin']), getUserActivities);
router.get('/dashboard/stats', protect, authorize(['admin']), getDashboardStats);

export default router;
