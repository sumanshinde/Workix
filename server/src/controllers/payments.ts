import { Request, Response } from 'express';
import Escrow from '../models/Escrow';
import Transaction from '../models/Transaction';
import User from '../models/User';
import { createRazorpayOrder, verifyPaymentSignature, initiateRefund } from '../services/paymentService';
import { calculateServiceFees } from '../services/feeService';
import { createNotification } from '../services/notificationService';
import { sendEmail } from '../services/emailService';
import { processReferralReward } from '../services/referralService';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const { amount, jobId, gigId, clientId, freelancerId } = req.body;

    const fees = await calculateServiceFees(amount * 100);
    const order = await createRazorpayOrder(
      fees.totalPayable / 100, 
      `receipt_${Date.now()}`,
      {
        originalAmount: fees.originalAmount,
        clientFee: fees.clientFee,
        freelancerFee: fees.freelancerFee,
        jobId,
        freelancerId
      }
    );

    const escrow = new Escrow({
      orderId: order.id,
      jobId,
      gigId,
      clientId,
      freelancerId,
      originalAmount: fees.originalAmount,
      clientFee: fees.clientFee,
      freelancerFee: fees.freelancerFee,
      totalAmount: fees.totalPayable,
      netFreelancerAmount: fees.netFreelancerAmount,
      status: 'created'
    });

    await escrow.save();

    res.status(201).json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency
    });
  } catch (err) {
    res.status(500).json({ message: 'Order creation failed', error: err });
  }
};

export const verifyPayment = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

    if (!isValid) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    const escrow = await Escrow.findOneAndUpdate(
      { orderId: razorpay_order_id },
      { 
        paymentId: razorpay_payment_id, 
        status: 'escrowed', 
        paymentStatus: 'captured' 
      },
      { new: true }
    );

    if (escrow) {
      await Transaction.create({
        escrowId: escrow._id,
        clientId: escrow.clientId,
        freelancerId: escrow.freelancerId,
        originalAmount: escrow.originalAmount,
        clientFee: escrow.clientFee,
        freelancerFee: escrow.freelancerFee,
        platformRevenue: escrow.clientFee + escrow.freelancerFee,
        netFreelancerAmount: escrow.netFreelancerAmount,
        status: 'pending' // Initial status for transaction, will be 'completed' on release
      });

      // REFERRAL LOGIC: Process reward if this is the client's first payment
      await processReferralReward(escrow.clientId as unknown as string);
    }

    res.json({ message: 'Payment verified, escrowed, and logged.' });
  } catch (err) {
    res.status(500).json({ message: 'Verification failed', error: err });
  }
};

export const releasePayment = async (req: Request, res: Response) => {
  try {
    const { escrowId } = req.params;
    
    const escrow = await Escrow.findById(escrowId).populate('clientId freelancerId');
    if (!escrow) return res.status(404).json({ message: 'Escrow record not found' });
    if (escrow.status !== 'escrowed') return res.status(400).json({ message: 'Funds are not in escrow or already processed' });

    const client: any = escrow.clientId;
    const freelancer: any = escrow.freelancerId;

    // Update freelancer's wallet
    await User.findByIdAndUpdate(freelancer._id, {
      $inc: { walletBalance: escrow.netFreelancerAmount }
    });

    // Mark escrow as released
    escrow.status = 'released';
    await escrow.save();

    // Update transaction status
    await Transaction.findOneAndUpdate(
      { escrowId: escrow._id },
      { status: 'completed' }
    );

    // NOTIFICATIONS
    await createNotification(
      freelancer._id,
      'Funds Released!',
      `₹${escrow.netFreelancerAmount / 100} has been added to your wallet for your project with ${client.name}.`,
      'payment',
      '/dashboard/withdraw'
    );

    await createNotification(
      client._id,
      'Project Completed',
      `You have released the funds for ${freelancer.name}. Don't forget to leave a review!`,
      'system',
      `/profile/${freelancer._id}`
    );

    // EMAIL ALERTS
    await sendEmail(
      freelancer.email,
      'Payment Received - BharatGig',
      `Congratulations! ₹${escrow.netFreelancerAmount / 100} has been credited to your BharatGig wallet.`
    );

    res.json({ 
      message: 'Funds released to freelancer wallet successfully', 
      netAmount: escrow.netFreelancerAmount / 100,
      escrow 
    });
  } catch (err) {
    res.status(500).json({ message: 'Release failed', error: err });
  }
};

export const refundPayment = async (req: Request, res: Response) => {
  try {
    const { escrowId } = req.params;
    const escrow = await Escrow.findById(escrowId);

    if (!escrow || !escrow.paymentId) {
      return res.status(404).json({ message: 'Payment record not found' });
    }

    const refund = await initiateRefund(escrow.paymentId);
    
    escrow.status = 'refunded';
    await escrow.save();

    res.json({ message: 'Refund initiated successfully', refund });
  } catch (err) {
    res.status(500).json({ message: 'Refund failed', error: err });
  }
};
