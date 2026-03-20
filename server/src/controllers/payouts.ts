import { Request, Response } from 'express';
import PayoutMethod from '../models/PayoutMethod';
import PayoutRequest from '../models/PayoutRequest';
import User from '../models/User';
import { createNotification } from '../services/notificationService';
import { sendEmail } from '../services/emailService';
import { createContact, createFundAccount, createPayout } from '../services/paymentService';

export const setupPayoutMethod = async (req: Request, res: Response) => {
  try {
    const { userId, name, email, contact, accountType, details } = req.body;

    const razorpayContact = await createContact(name, email, contact);
    const fundAccount = await createFundAccount(razorpayContact.id, accountType, details);

    const payoutMethod = new PayoutMethod({
      userId,
      contactId: razorpayContact.id,
      fundAccountId: fundAccount.id,
      accountType,
      details
    });

    await payoutMethod.save();
    res.status(201).json(payoutMethod);
  } catch (err) {
    res.status(500).json({ message: 'Failed to setup payout method', error: err });
  }
};

export const requestPayout = async (req: Request, res: Response) => {
  try {
    const { userId, amount } = req.body; // amount in INR

    const payoutMethod = await PayoutMethod.findOne({ userId });
    if (!payoutMethod) {
      return res.status(400).json({ message: 'Payout method not configured' });
    }

    // In real app, check user's available balance here
    
    const payoutRequest = new PayoutRequest({
      userId,
      amount: amount * 100,
      payoutMethodId: payoutMethod._id,
      status: 'pending'
    });

    await payoutRequest.save();
    res.status(201).json(payoutRequest);
  } catch (err) {
    res.status(500).json({ message: 'Payout request failed', error: err });
  }
};

export const adminProcessPayout = async (req: Request, res: Response) => {
  try {
    const { requestId, action } = req.body; // action: 'approve' or 'reject'
    const payoutRequest = await PayoutRequest.findById(requestId).populate('payoutMethodId');

    if (!payoutRequest) return res.status(404).json({ message: 'Request not found' });
    if (payoutRequest.status !== 'pending') return res.status(400).json({ message: 'Request already processed' });

    if (action === 'reject') {
      payoutRequest.status = 'rejected';
      await payoutRequest.save();
      return res.json({ message: 'Payout rejected', payoutRequest });
    }

    // Process with Razorpay
    const fundAccountId = (payoutRequest.payoutMethodId as any).fundAccountId;
    const razorpayPayout = await createPayout(fundAccountId, payoutRequest.amount);

    payoutRequest.status = 'processing';
    payoutRequest.payoutId = razorpayPayout.id;
    await payoutRequest.save();

    const user: any = payoutRequest.userId;

    // Send alerts
    await createNotification(
      user._id,
      'Payout Initiated',
      `Your withdrawal request for ₹${payoutRequest.amount / 100} is being processed.`,
      'payout',
      '/dashboard/earnings'
    );

    await sendEmail(
      user.email,
      'Payout Request Update - BharatGig',
      `We've started processing your payout of ₹${payoutRequest.amount / 100}. It should reach your account soon.`
    );

    res.json({ message: 'Payout initiated', payoutRequest });
  } catch (err) {
    res.status(500).json({ message: 'Admin processing failed', error: err });
  }
};

export const getPayoutStats = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const requests = await PayoutRequest.find({ userId }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payout stats', error: err });
  }
};

export const getAdminPayoutRequests = async (req: Request, res: Response) => {
  try {
    const requests = await PayoutRequest.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch admin payout requests', error: err });
  }
};
