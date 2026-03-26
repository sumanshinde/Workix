import User from '../models/User';
import Proposal from '../models/Proposal';
import Job from '../models/Job';
import ActivityLog from '../models/ActivityLog';

/**
 * LeadLockService handles the "Fair-Bid" logic:
 * 1. Deducts credits from freelancers when they bid.
 * 2. Automatically refunds credits if the client doesn't open the proposal or hire anyone within 4 days.
 * 3. Calculates Hire Rate for clients to show transparency.
 */
export const LeadLockService = {
  /**
   * Deducts credits for a proposal submission
   */
  deductCredits: async (freelancerId: string, creditCost: number) => {
    const user = await User.findById(freelancerId);
    if (!user) throw new Error('User not found');

    // Skip deduction for GigIndia Pro users or Admins
    if (user.subscriptionStatus === 'pro' || user.role === 'admin') {
      console.log(`[LEAD_LOCK] Skipping credit deduction for Pro/Admin user ${freelancerId}`);
      return;
    }

    if (user.availableCredits < creditCost) {
      throw new Error('Insufficient bidding credits. Please upgrade to Pro.');
    }

    user.availableCredits -= creditCost;
    await user.save();

    await ActivityLog.create({
      userId: freelancerId,
      action: 'credits_deducted',
      details: { amount: creditCost, reason: 'Proposal Submission' }
    });
  },

  /**
   * Checks for proposals eligible for refund (not viewed/hired after 4 days)
   * This should be called by a cron job once a day.
   */
  processAutoRefunds: async () => {
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);

    // Find proposals older than 4 days that are still 'pending' or 'viewed' (but not hired/accepted)
    // and haven't been refunded yet.
    const eligibleProposals = await Proposal.find({
      status: { $in: ['pending', 'viewed'] },
      creditStatus: 'paid',
      createdAt: { $lte: fourDaysAgo }
    }).populate('jobId');

    let refundCount = 0;

    for (const proposal of eligibleProposals) {
      const job: any = proposal.jobId;
      
      // If the job is still open or hasn't selected THIS guy
      if (job && job.status === 'open') {
        // Refund the credits
        const freelancer = await User.findById(proposal.freelancerId);
        if (freelancer) {
          freelancer.availableCredits += proposal.creditCost;
          await freelancer.save();

          proposal.creditStatus = 'refunded';
          proposal.status = 'refunded';
          await proposal.save();

          await ActivityLog.create({
            userId: proposal.freelancerId,
            action: 'credits_refunded',
            details: { 
              amount: proposal.creditCost, 
              reason: 'Fair-Bid: Client inactivity for 4 days',
              jobId: job._id 
            }
          });

          refundCount++;
        }
      }
    }

    return refundCount;
  },

  /**
   * Calculates a client's "Hire Rate" based on historical jobs
   */
  getClientHireMetrics: async (clientId: string) => {
    const totalJobs = await Job.countDocuments({ clientId });
    const hiredJobs = await Job.countDocuments({ 
      clientId, 
      status: { $in: ['in_progress', 'completed'] } 
    });

    const hireRate = totalJobs > 0 ? (hiredJobs / totalJobs) * 100 : 0;
    
    // Avg Response Time (Mock for now, would normally calculate from Message/Proposal timestamps)
    const avgResponseTime = '2-4 hours'; 

    return {
      hireRate: Math.round(hireRate),
      avgResponseTime,
      totalJobs
    };
  }
};
