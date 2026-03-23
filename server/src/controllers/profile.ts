import { Request, Response } from 'express';
import User from '../models/User';
import aiService from '../services/aiService';

export const getProfileAnalysis = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Analyze profile using AI
    const analysis = await aiService.analyzeProfile({
      bio: (user as any).description,
      skills: user.skills,
      pricing: (user as any).hourlyRate,
      trustScore: user.trustScore || 75,
      responseTime: user.avgResponseTime || 60,
      completedJobs: user.completedJobs || 0
    });

    res.json(analysis);
  } catch (err: any) {
    res.status(500).json({ message: 'Analysis failed', error: err.message });
  }
};

export const improveProfile = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { action } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (action === 'rewrite_bio') {
      const newBio = await aiService.rewriteBio((user as any).description || '', user.skills || []);
      (user as any).description = newBio;
      await user.save();
      return res.json({ success: true, bio: newBio });
    }

    res.status(400).json({ message: 'Invalid action' });
  } catch (err: any) {
    res.status(500).json({ message: 'Improvement failed', error: err.message });
  }
};
