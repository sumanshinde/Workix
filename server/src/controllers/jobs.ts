import { Request, Response } from 'express';
import Job from '../models/Job';

// ── Create job ──────────────────────────────────────────────────────────────
export const createJob = async (req: Request, res: Response) => {
  try {
    const { title, description, category, budget, budgetType, skills, experienceLevel, deadline, scope } = req.body;
    const clientId = (req as any).user?.id;
    const job = new Job({ title, description, category, budget, budgetType, skills, experienceLevel, deadline, scope, clientId, status: 'open' });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
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

// ── Get single job ──────────────────────────────────────────────────────────
export const getJobById = async (req: Request, res: Response) => {
  try {
    const job = await Job.findById(req.params.id).populate('clientId', 'name avatar email');
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
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
