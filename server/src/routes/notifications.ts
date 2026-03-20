import { Router } from 'express';
import { getNotifications, updateNotificationReadStatus } from '../controllers/notifications';

const router = Router();

router.get('/:userId', getNotifications);
router.put('/:id/read', updateNotificationReadStatus);

export default router;
