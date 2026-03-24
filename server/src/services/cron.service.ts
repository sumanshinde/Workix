import cron from 'node-cron';
import Subscription from '../models/Subscription';
import User from '../models/User';
import sendEmail from '../utils/sendEmail';

/**
 * 5. Reminder Scheduler (Cron Job)
 * Checks for upcoming subscription renewals and pending payments daily at 9:00 AM
 */
export const startCronJobs = () => {
  // Cron running every day at 09:00 AM Server Time
  cron.schedule('0 9 * * *', async () => {
    try {
      console.log('Running daily reminder scheduler...');

      const now = new Date();
      // Example: Remind 3 days before subscription expires
      const reminderDate = new Date();
      reminderDate.setDate(now.getDate() + 3);

      // Find all subscriptions ending exactly in 3 days
      const upcomingRenewals = await Subscription.find({
        status: 'active',
        currentEnd: {
          $gte: new Date(reminderDate.setHours(0, 0, 0, 0)),
          $lte: new Date(reminderDate.setHours(23, 59, 59, 999))
        }
      }).populate('userId');

      for (const sub of upcomingRenewals) {
        const user = (sub.userId as any);
        if (user && user.email) {
          const message = `Hi ${user.firstName},\n\nYour subscription plan is set to renew automatically in 3 days on ${sub.currentEnd}. Ensure you have sufficient balance.\n\nThanks,\nSaaS Team`;

          try {
            await sendEmail({
              email: user.email,
              subject: 'Upcoming Subscription Renewal Notification',
              message,
            });
            console.log(`Reminder sent to ${user.email} successfully.`);
          } catch (err) {
            console.log(`Failed to send email to ${user.email}`);
          }
        }
      }

    } catch (error) {
      console.error('Error running daily subscriptions reminder cron:', error);
    }
  });

  console.log('Cron jobs initialized successfully.');
};
