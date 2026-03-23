import { Request, Response } from 'express';
import Job from '../models/Job';
import aiService from '../services/aiService';

// ── Create job ──────────────────────────────────────────────────────────────
export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, category, budget, budgetType, skills, experienceLevel, deadline, scope } = req.body;
    const clientId = (req as any).user?.id;
    const job = new Job({ title, description, category, budget, budgetType, skills, experienceLevel, deadline, scope, clientId, status: 'open' });
    const savedJob = await job.save();

    // ── Retention Trigger: Notification to Matching Freelancers ──────────────
    const { createNotification } = require('../services/notificationService');
    const User = require('../models/User').default;
    const matchingFreelancers = await User.find({ 
       role: 'freelancer', 
       skills: { $in: skills } 
    }).limit(3);

    for (const f of matchingFreelancers) {
       await createNotification(
          f._id,
          '🔥 New Job Match For You',
          `A new project for "${title}" matches your top skills. Apply now!`,
          'job_match',
          `/jobs/${savedJob._id}`
       );
    }

    res.status(201).json(savedJob);
  } catch (err: any) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// ── Get all jobs (with filters) ─────────────────────────────────────────────
export const getJobs = async (req: Request, res: Response) => {
  try {
    const { category, search, budgetMin, budgetMax, experienceLevel, status, sort } = req.query;
    const query: any = {};

    if (category)        query.category        = category;
    if (status)          query.status           = status;
    if (experienceLevel) query.experienceLevel  = experienceLevel;
    if (search)          query.title            = { $regex: search as string, $options: 'i' };
    if (budgetMin || budgetMax) {
      query.budget = {};
      if (budgetMin) query.budget.$gte = Number(budgetMin);
      if (budgetMax) query.budget.$lte = Number(budgetMax);
    }

    const sortOrder: any = sort === 'oldest' ? { createdAt: 1 }
      : sort === 'budget_high' ? { budget: -1 }
      : sort === 'budget_low'  ? { budget: 1 }
      : { createdAt: -1 };

    const jobs = await Job.find(query).sort(sortOrder).populate('clientId', 'name avatar');
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

import { LeadLockService } from '../services/leadLockService';

// ── Get single job ──────────────────────────────────────────────────────────
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate('clientId', 'name avatar email riskScore isVerified isKycVerified');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    
    // Add Client Hire Metrics for Lead Lock transparency
    const hireMetrics = await LeadLockService.getClientHireMetrics(job.clientId._id.toString());
    
    // Update views asynchronously
    Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();

    res.json({ 
      ...job.toObject(), 
      clientMetrics: hireMetrics 
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message || 'Server error', error: err });
  }
};

// ── Update job ──────────────────────────────────────────────────────────────
export const updateJob = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const job = await Job.findOne({ _id: req.params.id, clientId });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// ── Delete job ──────────────────────────────────────────────────────────────
export const deleteJob = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const job = await Job.findOneAndDelete({ _id: req.params.id, clientId });
    if (!job) return res.status(404).json({ message: 'Job not found or unauthorized' });
    res.json({ message: 'Job deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// ── Get my jobs (client) ────────────────────────────────────────────────────
export const getMyJobs = async (req: Request, res: Response) => {
  try {
    const clientId = (req as any).user?.id;
    const jobs = await Job.find({ clientId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

import { MatchingService } from '../services/matchingService';

// ── AI: Smart job suggestions (suggestions/desc/skills) ────────────────────
export const getJobMatches = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const matches = await MatchingService.getTopMatches(id as string);
    res.json(matches);
  } catch (err: any) {
    res.status(500).json({ message: 'Matching failed', error: err.message });
  }
};

export const generateJobAI = async (req: Request, res: Response) => {
  try {
    const { title, category } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    
    const description = await aiService.generateJobDescription(title, category || 'General');
    const skills = await aiService.suggestSkills(title, description);
    res.json({ description, skills });
  } catch (err) {
    res.status(500).json({ message: 'AI generation failed', error: err });
  }
};
