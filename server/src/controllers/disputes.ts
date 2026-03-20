import { Request, Response } from 'express';
import Dispute from '../models/Dispute';
import Escrow from '../models/Escrow';
import { initiateRefund } from '../services/paymentService';
import User from '../models/User';
import { createNotification } from '../services/notificationService';
import { sendEmail } from '../services/emailService';

export const createDispute = async (req: Request, res: Response) => {
  try {
    const { escrowId, raisedBy, reason, description, evidence } = req.body;

    const escrow = await Escrow.findById(escrowId);
    if (!escrow) return res.status(404).json({ message: 'Escrow not found' });

    // Freeze the escrow
    escrow.status = 'disputed';
    await escrow.save();

    const dispute = new Dispute({
      escrowId,
      clientId: escrow.clientId,
      freelancerId: escrow.freelancerId,
      raisedBy,
      reason,
      description,
      evidence,
      status: 'open'
    });

    await dispute.save();

    // Notify both parties
    await createNotification(
      escrow.freelancerId.toString(),
      'Dispute Raised',
      `A dispute has been raised on your current project. Funds have been frozen.`,
      'dispute',
      '/dashboard/projects'
    );

    const freelancer: any = await User.findById(escrow.freelancerId);
    if (freelancer) {
      await sendEmail(
        freelancer.email,
        'Urgent: Project Dispute - BharatGig',
        'A dispute has been raised regarding your recent project. Please visit the dashboard to review the case.'
      );
    }

    res.status(201).json(dispute);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create dispute', error: err });
  }
};

export const getDisputes = async (req: Request, res: Response) => {
  try {
    const disputes = await Dispute.find()
      .populate('clientId', 'name email')
      .populate('freelancerId', 'name email')
      .populate('raisedBy', 'name')
      .populate('escrowId')
      .sort({ createdAt: -1 });
    res.json(disputes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch disputes', error: err });
  }
};

export const resolveDispute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { action, adminNotes } = req.body; // action: 'refund_to_client' or 'release_to_freelancer'

    const dispute = await Dispute.findById(id).populate('escrowId');
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

    const escrow: any = dispute.escrowId;

    if (action === 'refund_to_client') {
      // Logic for Razorpay Refund
      if (escrow.paymentId) {
        await initiateRefund(escrow.paymentId);
      }
      escrow.status = 'refunded';
      dispute.resolution = 'refund_to_client';
    } else if (action === 'release_to_freelancer') {
      // Logic for Release to Wallet
      await User.findByIdAndUpdate(escrow.freelancerId, {
        $inc: { walletBalance: escrow.netFreelancerAmount }
      });
      escrow.status = 'released';
      dispute.resolution = 'release_to_freelancer';
    }

    await escrow.save();
    dispute.status = 'resolved';
    dispute.adminNotes = adminNotes;
    dispute.resolvedAt = new Date();
    await dispute.save();

    // Notify parties of resolution
    await createNotification(
      escrow.clientId.toString(),
      'Dispute Resolved',
      `Your dispute has been resolved: ${action.replace(/_/g, ' ')}`,
      'dispute'
    );
    await createNotification(
      escrow.freelancerId.toString(),
      'Dispute Resolved',
      `The dispute on your project has been resolved: ${action.replace(/_/g, ' ')}`,
      'dispute'
    );

    res.json({ message: 'Dispute resolved successfully', dispute });
  } catch (err) {
    res.status(500).json({ message: 'Failed to resolve dispute', error: err });
  }
};

export const rejectDispute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { adminNotes } = req.body;

    const dispute = await Dispute.findById(id).populate('escrowId');
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

    const escrow: any = dispute.escrowId;
    
    // Unfreeze escrow - back to escrowed status
    escrow.status = 'escrowed';
    await escrow.save();

    dispute.status = 'rejected';
    dispute.adminNotes = adminNotes;
    await dispute.save();

    res.json({ message: 'Dispute rejected', dispute });
  } catch (err) {
    res.status(500).json({ message: 'Failed to reject dispute', error: err });
  }
};
