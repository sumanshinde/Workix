import { Request, Response } from 'express';
import Contract from '../models/Contract';
import Job from '../models/Job';
import Proposal from '../models/Proposal';
import Escrow from '../models/Escrow';

// ── Create Contract (Hire Freelancer) ──────────────────────────────────────
export const createContract = async (req: Request, res: Response) => {
  try {
    const { jobId, proposalId, freelancerId, amount, escrowId } = req.body;
    const clientId = (req as any).user?.id;

    // Verify job owner
    const job = await Job.findOne({ _id: jobId, clientId });
    if (!job) return res.status(403).json({ message: 'Unauthorized to hire for this job' });

    // Verify proposal
    const proposal = await Proposal.findById(proposalId);
    if (!proposal) return res.status(404).json({ message: 'Proposal not found' });

    // Create contract
    const contract = new Contract({
      jobId,
      proposalId,
      clientId,
      freelancerId,
      amount,
      escrowId,
      status: 'active',
      paymentStatus: escrowId ? 'escrowed' : 'pending'
    });

    await contract.save();

    // Update job status
    job.status = 'in_progress';
    await job.save();

    // Update proposal status
    proposal.status = 'accepted';
    await proposal.save();

    res.status(201).json(contract);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// ── Get My Contracts ────────────────────────────────────────────────────────
export const getMyContracts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const role = (req as any).user?.role;

    const query = role === 'client' ? { clientId: userId } : { freelancerId: userId };
    const contracts = await Contract.find(query)
      .populate('jobId', 'title category')
      .populate('clientId', 'name avatar')
      .populate('freelancerId', 'name avatar')
      .sort({ createdAt: -1 });

    res.json(contracts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// ── Submit Work ─────────────────────────────────────────────────────────────
export const submitWork = async (req: Request, res: Response) => {
  try {
    const { contractId, content, attachments } = req.body;
    const freelancerId = (req as any).user?.id;

    const contract = await Contract.findOne({ _id: contractId, freelancerId });
    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    contract.workSubmission.push({
      content,
      attachments,
      status: 'pending'
    });

    await contract.save();
    res.json({ message: 'Work submitted successfully', contract });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

// ── Approve Work & Complete Contract ────────────────────────────────────────
export const approveWork = async (req: Request, res: Response) => {
  try {
    const { contractId, submissionId } = req.body;
    const clientId = (req as any).user?.id;

    const contract = await Contract.findOne({ _id: contractId, clientId });
    if (!contract) return res.status(404).json({ message: 'Contract not found' });

    const submission = contract.workSubmission.id(submissionId);
    if (!submission) return res.status(404).json({ message: 'Submission not found' });

    submission.status = 'approved';
    contract.status = 'completed';
    
    await contract.save();

    // Update job status to completed
    await Job.findByIdAndUpdate(contract.jobId, { status: 'completed' });

    res.json({ message: 'Work approved and contract completed', contract });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
