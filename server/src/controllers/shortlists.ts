import { Request, Response } from 'express';
import Shortlist from '../models/Shortlist';
import Lead from '../models/Lead';
import Order from '../models/Order';
import User from '../models/User';

export const createShortlist = async (req: Request, res: Response) => {
  try {
    const { leadId, freelancers, notes } = req.body;
    
    // 1. Create Shortlist
    const shortlist = await Shortlist.create({ 
      leadId, 
      freelancers, 
      notes, 
      status: 'sent' 
    });

    // 2. Mark Lead as Managed
    await Lead.findByIdAndUpdate(leadId, { isManagedLead: true, status: 'qualified' });

    res.status(201).json({ success: true, message: 'Shortlist created and sent', shortlist });
  } catch (err: any) {
    res.status(500).json({ message: 'Shortlist creation failed', error: err.message });
  }
};

export const getShortlistForClient = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const shortlist = await Shortlist.findById(id)
      .populate('leadId')
      .populate('freelancers.userId', 'name role trustScore skills avatar');
    
    if (!shortlist) return res.status(404).json({ message: 'Shortlist not found' });
    res.json(shortlist);
  } catch (err: any) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

export const approveShortlist = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { freelancerUserId } = req.body;

    const shortlist = await Shortlist.findById(id).populate('leadId');
    if (!shortlist) return res.status(404).json({ message: 'Shortlist not found' });

    // 1. Mark as Approved
    shortlist.status = 'approved';
    await shortlist.save();

    // 2. Auto-Create Active Order (Simulated Hire)
    // In production, we'd trigger a payment flow first.
    // For now, we create the order directly to finalize the match.
    const lead = shortlist.leadId as any;
    
    // We assume the lead has a 'userId' if they signed up, 
    // or we treat them as a Guest Client for this specific order.
    const order = await Order.create({
       clientId: lead._id, // In a real app, this would be the actual Client User ID
       freelancerId: freelancerUserId,
       amount: 1000000, // INR 10,000 example
       status: 'active',
       isPaid: true
    });

    res.json({ message: 'Hire finalized! Active order created.', order });
  } catch (err: any) {
    res.status(500).json({ message: 'Approval failed', error: err.message });
  }
};
