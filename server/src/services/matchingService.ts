import User from '../models/User';
import Job from '../models/Job';

interface ScoreBreakdown {
  skillScore: number;
  trustScore: number;
  proBoost: number;
  activityScore: number;
  budgetFitScore: number;
  experienceScore: number;
}

const matchCache = new Map<string, { data: any; expires: number }>();

export const MatchingService = {
  /**
   * Calculates a match score (0-100) for a freelancer against a specific job.
   */
  calculateScore: (freelancer: any, job: any): { total: number; breakdown: ScoreBreakdown } => {
    // 1. Skill Match (40%) - Simple Intersection
    const jobSkills = new Set((job.skills || []).map((s: string) => s.toLowerCase()));
    const matchingSkills = (freelancer.skills || []).filter((s: string) => jobSkills.has(s.toLowerCase()));
    
    const skillScore = jobSkills.size > 0 
      ? Math.min(100, (matchingSkills.length / jobSkills.size) * 100) 
      : 50;

    // 2. Trust Score (20%)
    const trustScore = freelancer.trustScore || 0;

    // 3. Pro Boost (15%)
    const proBoost = freelancer.subscriptionStatus === 'pro' ? 100 : 0;

    // 4. Activity Score (10%)
    const hoursSinceActive = (Date.now() - new Date(freelancer.lastActive || Date.now()).getTime()) / (1000 * 60 * 60);
    const activityScore = Math.max(0, 100 - (hoursSinceActive / 24) * 10);

    // 5. Budget Fit (10%)
    const budgetFitScore = 100;

    // 6. Experience (5%)
    const experienceScore = Math.min(100, ((freelancer.completedJobs || 0) / 10) * 100);

    const total = (
      (skillScore * 0.40) +
      (trustScore * 0.20) +
      (proBoost * 0.15) +
      (activityScore * 0.10) +
      (budgetFitScore * 0.10) +
      (experienceScore * 0.05)
    );

    return {
      total: Math.round(total),
      breakdown: { skillScore: Math.round(skillScore), trustScore, proBoost, activityScore, budgetFitScore, experienceScore }
    };
  },

  /**
   * Retrieves top matched freelancers for a job with caching.
   */
  getTopMatches: async (jobId: string, limit: number = 5) => {
    // Check Cache
    const cached = matchCache.get(jobId);
    if (cached && cached.expires > Date.now()) {
      return cached.data;
    }

    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');

    // 1. Fetch relevant freelancers (e.g. at least 1 matching skill or active)
    const freelancers = await User.find({ 
      role: 'freelancer',
      isFlagged: false
    }).sort({ lastActive: -1 }).limit(50);

    // 2. Compute scores
    const scoredList = freelancers.map(f => {
      const { total, breakdown } = MatchingService.calculateScore(f, job);
      return { 
        freelancer: f, 
        matchScore: total, 
        breakdown 
      };
    });

    const result = scoredList
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, limit);

    // Set Cache (5 mins)
    matchCache.set(jobId, { data: result, expires: Date.now() + 5 * 60 * 1000 });

    return result;
  }
};
