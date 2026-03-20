import { Request, Response } from 'express';
import Proposal from '../models/Proposal';
import Job from '../models/Job';

// ── Submit proposal ─────────────────────────────────────────────────────────
export const submitProposal = async (req: Request, res: Response) => {
  try {
    const freelancerId = (req as any).user?.id;
    const { jobId, coverLetter, bidAmount, deliveryDays } = req.body;

    const existing = await Proposal.findOne({ jobId, freelancerId });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const job = await Job.findById(jobId);
    if (!job || job.status !== 'open') return res.status(400).json({ message: 'Job not available' });

    const proposal = new Proposal({ jobId, freelancerId, coverLetter, bidAmount, deliveryDays });
    await proposal.save();
    res.status(201).json(proposal);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// ── Get proposals for a job (client) ───────────────────────────────────────
export const getJobProposals = async (req: Request, res: Response) => {
  try {
    const proposals = await Proposal.find({ jobId: req.params.jobId })
      .populate('freelancerId', 'name avatar skills rating');
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// ── Get my proposals (freelancer) ───────────────────────────────────────────
export const getMyProposals = async (req: Request, res: Response) => {
  try {
    const freelancerId = (req as any).user?.id;
    const proposals = await Proposal.find({ freelancerId })
      .populate('jobId', 'title category budget status')
      .sort({ createdAt: -1 });
    res.json(proposals);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// ── Accept / Reject proposal (client) ──────────────────────────────────────
export const updateProposalStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body; // 'accepted' | 'rejected'
    const proposal = await Proposal.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    // If accepted, close job to new proposals
    if (status === 'accepted') {
      await Job.findByIdAndUpdate(proposal.jobId, { status: 'in_progress' });
    }
    res.json(proposal);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
