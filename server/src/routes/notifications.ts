import { Router } from 'express';
import { getNotifications, updateNotificationReadStatus, markAllNotificationsAsRead } from '../controllers/notifications';
import { protect } from '../middleware/auth';

const router = Router();

router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, updateNotificationReadStatus);
router.post('/read-all', protect, markAllNotificationsAsRead);

export default router;
