import { Request, Response } from 'express';
import User from '../models/User';
import Order from '../models/Order';
import Invoice from '../models/Invoice';
import { Wallet } from '../models/Wallet';
import Dispute from '../models/Dispute';
import Milestone from '../models/Milestone';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user: any = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Orders & Progress
    const activeOrders = await Order.find({ 
      $or: [{ clientId: userId }, { freelancerId: userId }],
      status: 'active' 
    }).populate('jobId');

    // 2. Financials
    const wallet = await Wallet.findOne({ userId }) || { balance: 0, currency: 'INR' };
    const invoices = await Invoice.find({ userId });
    const totalEarnings = invoices.reduce((acc, inv) => acc + inv.baseAmount, 0);
    const totalGst = invoices.reduce((acc, inv) => acc + inv.gstAmount, 0);

    // 3. Activity & Trust
    const openDisputes = await Dispute.countDocuments({ 
       $or: [{ freelancerId: userId }, { raisedBy: userId }],
       status: { $in: ['open', 'reviewing'] } 
    });

    res.json({
       summary: {
          earnings: totalEarnings / 100,
          activeOrders: activeOrders.length,
          pendingPayments: wallet.balance / 100, // For freelancer it is what they have
          profileScore: user.trustScore || 75
       },
       orders: activeOrders,
       wallet,
       tax: {
          gst: totalGst / 100,
          invoices: invoices.length
       },
       trust: {
          score: user.trustScore || 75,
          disputes: openDisputes
       },
       role: user.role
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Dashboard failed', error: err.message });
  }
};
