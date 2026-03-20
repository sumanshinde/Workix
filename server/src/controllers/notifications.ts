import { Request, Response } from 'express';
import { getUserNotifications, markAsRead } from '../services/notificationService';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const notifications = await getUserNotifications(userId as string);
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: err });
  }
};

export const updateNotificationReadStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await markAsRead(id as string);
    res.json(notification);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update notification', error: err });
  }
};
