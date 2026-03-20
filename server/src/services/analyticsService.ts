import Analytics from '../models/Analytics';
import ActivityLog from '../models/ActivityLog';
import { io } from '../index';

export const trackEvent = async (event: string, category: string, userId?: string, metadata?: any) => {
  try {
    const log = new Analytics({
      event,
      category,
      userId,
      metadata
    });
    await log.save();

    let mappedAction = event;
    if (event.includes('login')) mappedAction = 'login';
    if (event.includes('signup')) mappedAction = 'signup';
    if (event.includes('job') || event.includes('gig')) mappedAction = 'job_post';
    if (event.includes('payment') || event.includes('checkout')) mappedAction = 'payment';
    if (event.includes('referral')) mappedAction = 'referral';

    const actLog = new ActivityLog({
      userId,
      action: mappedAction,
      details: metadata
    });
    await actLog.save();

    const populated = await actLog.populate('userId', 'name email role');
    io.emit('new_activity', populated);

    console.log(`[Event Logged]: ${event} | ${category}`);
  } catch (err) {
    console.error('Analytics track failure:', err);
  }
};

export const getConversionStats = async (category?: string) => {
  // Aggregate stats logic (simplified)
  return Analytics.aggregate([
    { $match: category ? { category } : {} },
    { $group: { _id: '$event', count: { $sum: 1 } } }
  ]);
};
