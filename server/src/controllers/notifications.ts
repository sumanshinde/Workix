import { Request, Response } from 'express';
import { getUserNotifications, markAsRead, markAllAsRead } from '../services/notificationService';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const notifications = await getUserNotifications(userId as string);
    res.json(notifications);
  } catch (err: any) {
    res.status(500).json({ message: 'Fetch notifications failed', error: err.message });
  }
};

export const updateNotificationReadStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await markAsRead(id as string);
    res.json(notification);
  } catch (err: any) {
    res.status(500).json({ message: 'Status update failed', error: err.message });
  }
};

export const markAllNotificationsAsRead = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    await markAllAsRead(userId);
    res.json({ message: 'All marked as read' });
  } catch (err: any) {
    res.status(500).json({ message: 'Bulk update failed', error: err.message });
  }
};
