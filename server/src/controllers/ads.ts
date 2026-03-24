import { Request, Response } from 'express';
import Ad from '../models/Ad';
import User from '../models/User';
import PlatformSettings from '../models/PlatformSettings';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService';
import { createNotification } from '../services/notificationService';

// Get active platform settings
const getAdPricing = async () => {
  let settings = await PlatformSettings.findOne({ isActive: true }).lean();
  if (!settings) {
    settings = await PlatformSettings.create({}) as any;
  }
  return settings!.adPricing;
};

// ── AUTO CALCULATE AD PRICE ──────────────────────────────────────────────────
export const calculateAdPrice = async (req: Request, res: Response) => {
  try {
    const { adType, durationDays } = req.body;
    const pricing = await getAdPricing();

    const tier = (pricing as any)[adType] || (pricing as any).post;
    const days = Math.min(Math.max(durationDays || 1, tier.minDays), tier.maxDays);
    const totalPaise = tier.perDay * days;

    res.json({
      adType,
      durationDays: days,
      pricePerDay: tier.perDay,
      totalPrice: totalPaise,
      totalDisplay: `₹${totalPaise / 100}`,
      minDays: tier.minDays,
      maxDays: tier.maxDays,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Price calculation failed', error: err.message });
  }
};

// ── CREATE AD (with payment) ─────────────────────────────────────────────────
export const createAd = async (req: Request, res: Response) => {
  try {
    const { title, description, image, adType, target, location, latitude, longitude, budget, durationDays, category } = req.body;
    const ownerId = (req as any).user.id;

    // Calculate price
    const pricing = await getAdPricing();
    const type = adType || 'post';
    const tier = (pricing as any)[type] || (pricing as any).post;
    const days = Math.min(Math.max(durationDays || 7, tier.minDays), tier.maxDays);
    const totalPrice = tier.perDay * days;

    const ad = new Ad({
      title, description, image, adType: type, target: target || 'BOTH',
      location, latitude, longitude, ownerId, budget: budget || 0,
      durationDays: days,
      pricePerDay: tier.perDay,
      totalPrice,
      category: category || '',
      status: 'pending_payment',
    });

    await ad.save();

    // Create Razorpay order for ad payment
    const amountRupees = totalPrice / 100;
    const order = await createRazorpayOrder(amountRupees, `ad_${ad._id}`, {
      type: 'ad_payment',
      adId: String(ad._id),
    });

    res.status(201).json({
      ad,
      payment: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        totalDisplay: `₹${amountRupees}`,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Ad creation failed', error: err.message });
  }
};

// ── VERIFY AD PAYMENT & ACTIVATE ─────────────────────────────────────────────
export const verifyAdPayment = async (req: Request, res: Response) => {
  try {
    const { adId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) return res.status(400).json({ message: 'Invalid payment signature' });

    const now = new Date();
    const ad = await Ad.findById(adId);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    ad.isPaid = true;
    ad.paymentId = razorpay_payment_id;
    ad.status = 'active';
    ad.isActive = true;
    ad.startsAt = now;
    ad.expiresAt = new Date(now.getTime() + ad.durationDays * 24 * 60 * 60 * 1000);
    await ad.save();

    await createNotification(
      String(ad.ownerId),
      'Ad is Live! 📢',
      `Your ad "${ad.title}" is now running for ${ad.durationDays} days.`,
      'system',
      '/ads/dashboard'
    );

    res.json({ message: 'Ad payment verified. Your ad is now live!', ad });
  } catch (err: any) {
    res.status(500).json({ message: 'Ad payment verification failed', error: err.message });
  }
};

// ── GET ADS (public, with expiry filtering) ──────────────────────────────────
export const getAds = async (req: Request, res: Response) => {
  try {
    const { target, lat, lng, category } = req.query;
    const now = new Date();
    const query: any = {
      isActive: true,
      status: 'active',
      $or: [
        { expiresAt: { $exists: false } },
        { expiresAt: { $gt: now } },
      ],
    };
    if (target) query.target = { $in: [target, 'BOTH'] };
    if (category) query.category = category;

    const ads = await Ad.find(query)
      .populate('ownerId', 'name avatar')
      .sort({ isBoosted: -1, createdAt: -1 })
      .limit(10);

    res.json(ads);
  } catch (err: any) {
    res.status(500).json({ message: 'Fetch ads failed', error: err.message });
  }
};

// ── GET MY ADS (user dashboard) ──────────────────────────────────────────────
export const getMyAds = async (req: Request, res: Response) => {
  try {
    const ownerId = (req as any).user.id;
    const ads = await Ad.find({ ownerId }).sort({ createdAt: -1 });
    res.json(ads);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch your ads', error: err.message });
  }
};

// ── TRACK AD CLICK ───────────────────────────────────────────────────────────
export const trackAdClick = async (req: Request, res: Response) => {
  try {
    const { adId } = req.params;
    await Ad.findByIdAndUpdate(adId, { $inc: { clicks: 1 } });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ message: 'Track failed' });
  }
};

// ── TRACK AD VIEW ────────────────────────────────────────────────────────────
export const trackAdView = async (req: Request, res: Response) => {
  try {
    const { adId } = req.params;
    await Ad.findByIdAndUpdate(adId, { $inc: { views: 1 } });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ message: 'Track failed' });
  }
};

// ── NEARBY FREELANCERS (preserved) ───────────────────────────────────────────
export const getNearbyFreelancers = async (req: Request, res: Response) => {
  try {
    const { lat, lng, city, pincode } = req.query;

    // Support city/pincode text search alongside coordinates
    if (city || pincode) {
      const query: any = { role: 'freelancer', isBlocked: { $ne: true } };
      if (city) query.city = { $regex: new RegExp(String(city), 'i') };
      if (pincode) query.pincode = String(pincode);
      
      const users = await User.find(query)
        .select('name avatar role rating locationName skills city pincode completedJobs avgResponseTime')
        .limit(30);
      return res.json(users);
    }

    if (!lat || !lng) return res.status(400).json({ message: 'Provide coordinates or city/pincode' });

    const radius = 0.5; // Roughly 50km box
    const users = await User.find({
      role: 'freelancer',
      isBlocked: { $ne: true },
      latitude: { $gte: Number(lat) - radius, $lte: Number(lat) + radius },
      longitude: { $gte: Number(lng) - radius, $lte: Number(lng) + radius }
    }).select('name avatar role rating locationName skills city pincode completedJobs').limit(20);
    
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: 'Nearby search failed', error: err.message });
  }
};
