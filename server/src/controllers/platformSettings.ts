import { Request, Response } from 'express';
import PlatformSettings from '../models/PlatformSettings';
import User from '../models/User';
import Subscription from '../models/Subscription';
import Ad from '../models/Ad';

// ── GET PLATFORM SETTINGS ────────────────────────────────────────────────────
export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await PlatformSettings.findOne({ isActive: true });
    if (!settings) {
      settings = await PlatformSettings.create({});
    }
    res.json(settings);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch settings', error: err.message });
  }
};

// ── UPDATE PLATFORM SETTINGS ─────────────────────────────────────────────────
export const updateSettings = async (req: Request, res: Response) => {
  try {
    const updates = req.body;
    let settings = await PlatformSettings.findOne({ isActive: true });
    if (!settings) {
      settings = await PlatformSettings.create(updates);
    } else {
      Object.assign(settings, updates);
      await settings.save();
    }
    res.json({ message: 'Settings updated successfully', settings });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update settings', error: err.message });
  }
};

// ── USER MANAGEMENT ──────────────────────────────────────────────────────────
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const { search, role, page = 1, limit = 25 } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: new RegExp(String(search), 'i') } },
        { email: { $regex: new RegExp(String(search), 'i') } },
        { phone: { $regex: new RegExp(String(search), 'i') } },
      ];
    }
    if (role) query.role = role;

    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -aadhaarHash')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch users', error: err.message });
  }
};

// ── BLOCK / UNBLOCK USER ─────────────────────────────────────────────────────
export const toggleBlockUser = async (req: Request, res: Response) => {
  try {
    const { userId, blocked, reason } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked: blocked, blockReason: reason || '' },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ message: blocked ? 'User blocked' : 'User unblocked', user });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update user', error: err.message });
  }
};

// ── GET USER DETAIL ──────────────────────────────────────────────────────────
export const getUserDetail = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).select('-password -aadhaarHash');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const subscription = await Subscription.findOne({ userId: req.params.id });
    const ads = await Ad.find({ ownerId: req.params.id }).countDocuments();

    res.json({ user, subscription, adCount: ads });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to get user detail', error: err.message });
  }
};

// ── SUBSCRIPTION MANAGEMENT ─────────────────────────────────────────────────
export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const subs = await Subscription.find()
      .populate('userId', 'name email role subscriptionStatus')
      .sort({ createdAt: -1 });
    res.json(subs);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch subscriptions', error: err.message });
  }
};

export const updateSubscriptionStatus = async (req: Request, res: Response) => {
  try {
    const { subscriptionId, status } = req.body;
    const sub = await Subscription.findByIdAndUpdate(subscriptionId, { status }, { new: true });
    if (!sub) return res.status(404).json({ message: 'Subscription not found' });

    // Also update user's subscriptionStatus
    const statusMap: any = { active: 'pro', cancelled: 'free', expired: 'free' };
    if (statusMap[status]) {
      await User.findByIdAndUpdate(sub.userId, { subscriptionStatus: statusMap[status] });
    }

    res.json({ message: 'Subscription updated', sub });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to update subscription', error: err.message });
  }
};

// ── AD MANAGEMENT (admin) ────────────────────────────────────────────────────
export const getAllAds = async (req: Request, res: Response) => {
  try {
    const ads = await Ad.find()
      .populate('ownerId', 'name email avatar')
      .sort({ createdAt: -1 });
    res.json(ads);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch ads', error: err.message });
  }
};

export const moderateAd = async (req: Request, res: Response) => {
  try {
    const { adId, action, reason } = req.body; // action: 'approve' | 'reject'
    const update: any = {};

    if (action === 'approve') {
      update.adminApproved = true;
      update.status = 'active';
    } else if (action === 'reject') {
      update.adminApproved = false;
      update.status = 'rejected';
      update.isActive = false;
      update.rejectionReason = reason || 'Violation of platform policies';
    }

    const ad = await Ad.findByIdAndUpdate(adId, update, { new: true });
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    res.json({ message: `Ad ${action}d`, ad });
  } catch (err: any) {
    res.status(500).json({ message: 'Moderation failed', error: err.message });
  }
};
