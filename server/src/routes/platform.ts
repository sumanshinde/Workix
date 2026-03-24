import { Router } from 'express';
import {
  getSettings,
  updateSettings,
  getAllUsers,
  toggleBlockUser,
  getUserDetail,
  getAllSubscriptions,
  updateSubscriptionStatus,
  getAllAds,
  moderateAd,
} from '../controllers/platformSettings';
import { authenticate, authorize } from '../middleware/auth';

const router = Router();

// Platform settings (admin only)
router.get('/settings', authenticate, authorize(['admin']), getSettings);
router.put('/settings', authenticate, authorize(['admin']), updateSettings);

// User management (admin only)
router.get('/users', authenticate, authorize(['admin']), getAllUsers);
router.get('/users/:id', authenticate, authorize(['admin']), getUserDetail);
router.post('/users/block', authenticate, authorize(['admin']), toggleBlockUser);

// Subscription management (admin only)
router.get('/subscriptions', authenticate, authorize(['admin']), getAllSubscriptions);
router.post('/subscriptions/update', authenticate, authorize(['admin']), updateSubscriptionStatus);

// Ad management (admin only)
router.get('/ads', authenticate, authorize(['admin']), getAllAds);
router.post('/ads/moderate', authenticate, authorize(['admin']), moderateAd);

export default router;
