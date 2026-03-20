import Notification from '../models/Notification';
import { io } from '../index';

export const createNotification = async (userId: string, title: string, message: string, type: string = 'system', link?: string) => {
  try {
    const notification = new Notification({
      userId,
      title,
      message,
      type,
      link
    });

    await notification.save();

    // Emit real-time notification if user is online
    if (io) {
      io.to(userId).emit('new_notification', notification);
    }

    return notification;
  } catch (err) {
    console.error('Failed to create notification:', err);
  }
};

export const getUserNotifications = async (userId: string) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 }).limit(20);
};

export const markAsRead = async (notificationId: string) => {
  return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
};
