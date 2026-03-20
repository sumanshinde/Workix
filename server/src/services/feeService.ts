import { getCache, setCache } from '../utils/redis';
import PlatformFee from '../models/PlatformFee';

export const getActiveFees = async () => {
  const CACHE_KEY = 'platform_fees_active';
  
  // Try cache first
  const cached = await getCache(CACHE_KEY);
  if (cached) return cached;

  let fees = await PlatformFee.findOne({ isActive: true }).lean();
  if (!fees) {
    fees = await PlatformFee.create({ clientFeePercent: 5, freelancerFeePercent: 10 });
  }

  // Store in cache for 1 hour
  await setCache(CACHE_KEY, fees, 3600);
  
  return fees;
};

export const calculateServiceFees = async (amountInPaise: number) => {
  const settings = await getActiveFees();
  
  const clientFee = Math.round(amountInPaise * (settings.clientFeePercent / 100));
  const freelancerFee = Math.round(amountInPaise * (settings.freelancerFeePercent / 100));
  
  return {
    originalAmount: amountInPaise,
    clientFee,
    freelancerFee,
    totalPayable: amountInPaise + clientFee,
    netFreelancerAmount: amountInPaise - freelancerFee,
    platformRevenue: clientFee + freelancerFee,
    feeSettings: settings
  };
};
