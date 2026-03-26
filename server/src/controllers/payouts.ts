import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import PayoutMethod from '../models/PayoutMethod';
import PayoutRequest from '../models/PayoutRequest';
import User from '../models/User';
import { createNotification } from '../services/notificationService';
import { sendEmail } from '../services/emailService';
import { createContact, createFundAccount, createPayout } from '../services/paymentService';

export const getMyPayoutMethod = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const payoutMethod = await PayoutMethod.findOne({ userId });
    res.json(payoutMethod || null);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payout method', error: err });
  }
};

export const setupPayoutMethod = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { name, email, contact, accountType, details } = req.body;

    const razorpayContact = await createContact(name, email, contact);
    const fundAccount = await createFundAccount(razorpayContact.id, accountType, details);

    const payoutMethod = await PayoutMethod.findOneAndUpdate(
      { userId },
      {
        userId,
        contactId: razorpayContact.id,
        fundAccountId: fundAccount.id,
        accountType,
        details,
        isVerified: true
      },
      { upsert: true, new: true }
    );

    res.status(201).json(payoutMethod);
  } catch (err) {
    res.status(500).json({ message: 'Failed to setup payout method', error: err });
  }
};

export const requestPayout = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const { amount } = req.body; // amount in INR
    const amountInPaise = Math.round(amount * 100);

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.walletBalance < amountInPaise) {
      return res.status(400).json({ message: 'Insufficient balance in your GigIndia wallet.' });
    }

    const payoutMethod = await PayoutMethod.findOne({ userId });
    if (!payoutMethod) {
      return res.status(400).json({ message: 'Withdrawal destination not configured. Please setup your bank account or UPI first.' });
    }

    // Deduct balance (Lock it)
    user.walletBalance -= amountInPaise;
    await user.save();
    
    const payoutRequest = new PayoutRequest({
      userId,
      amount: amountInPaise,
      payoutMethodId: payoutMethod._id,
      status: 'pending'
    });

    await payoutRequest.save();
    res.status(201).json(payoutRequest);
  } catch (err: any) {
    res.status(500).json({ message: 'Payout request failed', error: err.message });
  }
};

export const adminProcessPayout = async (req: AuthRequest, res: Response) => {
  try {
    const { requestId, action, adminNotes } = req.body; // action: 'approve' or 'reject'
    const payoutRequest = await PayoutRequest.findById(requestId).populate('userId');

    if (!payoutRequest) return res.status(404).json({ message: 'Request not found' });
    if (payoutRequest.status !== 'pending' && payoutRequest.status !== 'processing') {
      return res.status(400).json({ message: 'Request already processed' });
    }

    const user = await User.findById(payoutRequest.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (action === 'reject') {
      payoutRequest.status = 'rejected';
      payoutRequest.adminNotes = adminNotes;
      
      // Refund balance
      user.walletBalance += payoutRequest.amount;
      await user.save();
      await payoutRequest.save();

      await createNotification(
        String(user._id),
        'Payout Rejected',
        `Your withdrawal request for ₹${payoutRequest.amount / 100} was rejected. Reason: ${adminNotes || 'Contact Support'}`,
        'payout'
      );

      return res.json({ message: 'Payout rejected and balance refunded', payoutRequest });
    }

    // Process with Razorpay
    const payoutMethod = await PayoutMethod.findById(payoutRequest.payoutMethodId);
    if (!payoutMethod) return res.status(400).json({ message: 'Payout method missing' });

    const razorpayPayout = await createPayout(payoutMethod.fundAccountId, payoutRequest.amount);

    payoutRequest.status = 'processed'; // Assuming success for now since we're using mocks
    payoutRequest.payoutId = razorpayPayout.id;
    payoutRequest.processedAt = new Date();
    await payoutRequest.save();

    // Send alerts
    await createNotification(
      String(user._id),
      'Payout Processed',
      `Your withdrawal request for ₹${payoutRequest.amount / 100} has been successfully processed.`,
      'payout',
      '/dashboard/withdraw'
    );

    await sendEmail(
      user.email as string,
      'Payout Success - GigIndia',
      `Great news! We've successfully processed your payout of ₹${payoutRequest.amount / 100}. The funds are on their way to your account.`
    );

    res.json({ message: 'Payout processed successfully', payoutRequest });
  } catch (err: any) {
    res.status(500).json({ message: 'Admin processing failed', error: err.message });
  }
};

export const getPayoutStats = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const requests = await PayoutRequest.find({ userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payout stats', error: err });
  }
};

export const getAdminPayoutRequests = async (req: AuthRequest, res: Response) => {
  try {
    const requests = await PayoutRequest.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin payout requests', error: err });
  }
};
