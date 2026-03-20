import { Request, Response } from 'express';
import PlatformFee from '../models/PlatformFee';
import { delCache } from '../utils/redis';
import Transaction from '../models/Transaction';
import { calculateServiceFees, getActiveFees } from '../services/feeService';
import { catchAsync } from '../utils/catchAsync';

export const getPlatformFees = catchAsync(async (req: Request, res: Response) => {
  const fees = await getActiveFees();
  res.status(200).json({
    status: 'success',
    data: fees
  });
});

export const updatePlatformFees = catchAsync(async (req: Request, res: Response) => {
  const { clientFeePercent, freelancerFeePercent } = req.body;
  const fees = await PlatformFee.findOneAndUpdate(
    { isActive: true },
    { clientFeePercent, freelancerFeePercent },
    { new: true, upsert: true }
  );
  
  await delCache('platform_fees_active');

  res.status(200).json({
    status: 'success',
    data: fees
  });
});

export const computeFeeBreakdown = catchAsync(async (req: Request, res: Response) => {
  const { amount } = req.body; 
  const breakdown = await calculateServiceFees(amount * 100);
  res.status(200).json({
    status: 'success',
    data: breakdown
  });
});

export const getTransactions = catchAsync(async (req: Request, res: Response) => {
  const transactions = await Transaction.find().sort({ createdAt: -1 }).populate('clientId freelancerId');
  res.status(200).json({
    status: 'success',
    results: transactions.length,
    data: transactions
  });
});
