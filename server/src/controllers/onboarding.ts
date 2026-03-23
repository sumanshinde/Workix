import { Request, Response } from 'express';
import Onboarding from '../models/Onboarding';
import User from '../models/User';

export const getOnboardingStatus = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    let onboarding = await Onboarding.findOne({ userId });
    
    if (!onboarding) {
       onboarding = await Onboarding.create({ userId });
    }
    
    res.json(onboarding);
  } catch (err: any) {
    res.status(500).json({ message: 'Status failed', error: err.message });
  }
};

export const setRole = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { role } = req.body;
    
    const onboarding = await Onboarding.findOneAndUpdate(
       { userId }, 
       { role, $addToSet: { completedSteps: 'role_selection' }, progress: 20 }, 
       { new: true }
    );
    
    // Also sync the user model role
    await User.findByIdAndUpdate(userId, { role });

    res.json({ message: 'Role assigned', onboarding });
  } catch (err: any) {
    res.status(500).json({ message: 'Set role failed', error: err.message });
  }
};

export const updateOnboardingStep = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { step } = req.body;

    const onboarding = await Onboarding.findOne({ userId });
    if (!onboarding) return res.status(404).json({ message: 'Onboarding data not found' });

    if (!onboarding.completedSteps.includes(step)) {
       onboarding.completedSteps.push(step);
       // Dynamic progress calculation based on role
       const totalRequired = onboarding.role === 'client' ? 4 : 5;
       onboarding.progress = Math.min(100, (onboarding.completedSteps.length / totalRequired) * 100);
       
       if (onboarding.progress >= 100) {
          onboarding.isCompleted = true;
       }
       await onboarding.save();
    }

    res.json({ message: 'Step updated', onboarding });
  } catch (err: any) {
    res.status(500).json({ message: 'Step update failed', error: err.message });
  }
};

export const claimOnboardingReward = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const onboarding = await Onboarding.findOne({ userId });
    
    if (!onboarding || !onboarding.isCompleted) return res.status(400).json({ message: 'Onboarding not completed' });
    if (onboarding.onboardingRewardClaimed) return res.status(400).json({ message: 'Reward already claimed' });

    onboarding.onboardingRewardClaimed = true;
    await onboarding.save();

    // Reward Logic: 1 free bid (or equivalent credits) 
    await User.findByIdAndUpdate(userId, { $inc: { freeBids: 1, credits: 50 } });

    res.json({ message: 'Reward claimed! +1 Free Bid added.' });
  } catch (err: any) {
    res.status(500).json({ message: 'Reward failed', error: err.message });
  }
};
