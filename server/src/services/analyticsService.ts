import Analytics from '../models/Analytics';
import ActivityLog from '../models/ActivityLog';
import User from '../models/User';
import Job from '../models/Job';
import Order from '../models/Order';
import Onboarding from '../models/Onboarding';
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

export const getGrowthMetrics = async () => {
    const totalUsers = await User.countDocuments();
    const freelancers = await User.countDocuments({ role: 'freelancer' });
    const clients = await User.countDocuments({ role: 'client' });
    
    const activeJobs = await Job.countDocuments({ status: 'open' });
    const totalHires = await Order.countDocuments();
    
    // Revenue calculations (GMV = total paid orders amount)
    const revenueData = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { 
          _id: null, 
          totalGMV: { $sum: '$amount' },
          platformFees: { $sum: { $multiply: ['$amount', 0.1] } } 
      }}
    ]);

    const { totalGMV = 0, platformFees = 0 } = revenueData[0] || {};
    const aov = totalHires > 0 ? totalGMV / totalHires : 0;

    return {
      users: { total: totalUsers, freelancers, clients },
      activity: { activeJobs, totalHires },
      revenue: { totalGMV, platformFees, aov }
    };
};

export const getFunnelData = async () => {
    const totalSignups = await User.countDocuments();
    const completedOnboarding = await Onboarding.countDocuments({ isCompleted: true });
    const postedJobs = await Job.distinct('clientId').then(ids => ids.length);
    const completedHires = await Order.distinct('clientId').then(ids => ids.length);

    return [
      { stage: 'Signups', count: totalSignups, dropoff: 0 },
      { stage: 'Onboarding', count: completedOnboarding, dropoff: totalSignups > 0 ? Math.round((1 - (completedOnboarding / totalSignups)) * 100) : 0 },
      { stage: 'Job Posting', count: postedJobs, dropoff: completedOnboarding > 0 ? Math.round((1 - (postedJobs / completedOnboarding)) * 100) : 0 },
      { stage: 'First Hire', count: completedHires, dropoff: postedJobs > 0 ? Math.round((1 - (completedHires / postedJobs)) * 100) : 0 },
    ];
};

export const getTrendingPerformance = async () => {
    // Top 5 freelancers by completed orders
    const topFreelancers = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: '$freelancerId', earning: { $sum: '$amount' }, count: { $sum: 1 } } },
      { $sort: { earning: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' }
    ]);

    return { topFreelancers };
};
