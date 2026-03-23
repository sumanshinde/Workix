import { Request, Response } from 'express';
import Dispute from '../models/Dispute';
import Milestone from '../models/Milestone';
import Order from '../models/Order';
import aiService from '../services/aiService';

export const raiseDispute = async (req: Request, res: Response) => {
  try {
    const { orderId, milestoneId, reason, description } = req.body;
    const raisedBy = (req as any).user.id;

    // 1. Create Dispute Record
    const dispute = await Dispute.create({
      orderId,
      milestoneId,
      raisedBy,
      reason,
      description,
      status: 'open'
    });

    // 2. Lock Milestone status
    if (milestoneId) {
      await Milestone.findByIdAndUpdate(milestoneId, { status: 'disputed' });
    }

    // 3. Trigger AI Analysis (Async)
    const analysis = await aiService.analyzeDispute(
      `${reason}: ${description}`,
      "Chat history placeholder...", // Pull from Chat model if available
      "Milestone description placeholder..."
    );

    dispute.aiSummary = analysis.summary;
    dispute.aiFaultProbability = {
      client: analysis.clientFault,
      freelancer: analysis.freelancerFault
    };
    dispute.aiRecommendedResolution = analysis.recommendation;
    dispute.status = 'reviewing';
    await dispute.save();

    res.json(dispute);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to raise dispute', error: err.message });
  }
};

export const resolveDispute = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { resolution, adminOverride } = req.body;
    const dispute = await Dispute.findById(id);
    if (!dispute) return res.status(404).json({ message: 'Dispute not found' });

    dispute.status = 'resolved';
    dispute.resolution = resolution;
    dispute.adminOverride = adminOverride || false;
    await dispute.save();

    // Update Milestone status based on resolution
    if (dispute.milestoneId) {
       const finalStatus = (resolution === 'release') ? 'released' : 'pending'; 
       await Milestone.findByIdAndUpdate(dispute.milestoneId, { status: finalStatus });
    }

    res.json({ success: true, dispute });
  } catch (err: any) {
    res.status(500).json({ message: 'Resolution failed', error: err.message });
  }
};

export const getDispute = async (req: Request, res: Response) => {
  try {
    const dispute = await Dispute.findById(req.params.id).populate('orderId');
    res.json(dispute);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch dispute', error: err.message });
  }
};

export const getDisputes = async (req: Request, res: Response) => {
  try {
    const disputes = await Dispute.find().sort({ createdAt: -1 });
    res.json(disputes);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch disputes', error: err.message });
  }
};
