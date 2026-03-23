import { Request, Response } from 'express';
import Milestone from '../models/Milestone';
import Order from '../models/Order';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

export const createMilestones = async (req: Request, res: Response) => {
  try {
    const { orderId, milestones } = req.body;
    if (!milestones || milestones.length === 0) return res.status(400).json({ message: 'Milestones required' });

    const created = await Milestone.insertMany(milestones.map((m: any) => ({
      ...m,
      orderId,
      amount: m.amount * 100 // store in paise
    })));

    res.json(created);
  } catch (err: any) {
    res.status(500).json({ message: 'Milestone creation failed', error: err.message });
  }
};

/**
 * Initiates Razorpay payment to fund the milestone. 
 * Held in escrow using "on_hold: 1" logic via Razorpay Route Transfers.
 */
export const fundMilestone = async (req: Request, res: Response) => {
  try {
    const { milestoneId } = req.params;
    const milestone = await Milestone.findById(milestoneId).populate('orderId');
    if (!milestone) return res.status(404).json({ message: 'Milestone not found' });

    const order: any = milestone.orderId;

    // 1. Create Razorpay Payment Order (Escrow)
    const receipt = `milestone_${milestoneId}`;
    const rzpOrder = await createRazorpayOrder(milestone.amount / 100, receipt, { milestoneId, orderId: order._id });

    res.json({ rzpOrder, milestoneId });
  } catch (err: any) {
    res.status(500).json({ message: 'Milestone funding failed', error: err.message });
  }
};

/**
 * Releases the "on_hold" funds from Razorpay Route to the freelancer.
 */
export const releaseMilestone = async (req: Request, res: Response) => {
  try {
    const { milestoneId } = req.params;
    const milestone = await Milestone.findById(milestoneId);
    if (!milestone || milestone.status !== 'funded') return res.status(400).json({ message: 'Invalid milestone status for release' });

    // 1. In Production, we'd call Razorpay Transfers Release API:
    // rzp.transfers.edit(milestone.razorpayTransferId, { on_hold: 0 });
    
    // Mocking Razorpay Release API call
    const success = true; 

    if (success) {
      milestone.status = 'released';
      milestone.releasedAt = new Date();
      await milestone.save();
      
      console.log(`[ESCROW] Funds released for milestone ${milestoneId}`);
    }

    res.json({ success, milestone });
  } catch (err: any) {
    res.status(500).json({ message: 'Release failed', error: err.message });
  }
};
