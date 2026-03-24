import { Router } from 'express';
import {
  createAd, getAds, getNearbyFreelancers,
  calculateAdPrice, verifyAdPayment, getMyAds,
  trackAdClick, trackAdView,
} from '../controllers/ads';
import { authenticate } from '../middleware/auth';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit ad creation to prevent spam (max 5 ads per hour)
const adCreateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { message: 'Too many ads created. Please try again later.' },
});

router.post('/calculate-price', authenticate, calculateAdPrice);     // Calculate ad price
router.post('/', authenticate, adCreateLimiter, createAd);           // Create ad + payment order
router.post('/verify-payment', authenticate, verifyAdPayment);       // Verify payment & activate
router.get('/', getAds);                                              // Public: get active ads
router.get('/my', authenticate, getMyAds);                           // Auth: user's ad dashboard
router.get('/nearby', getNearbyFreelancers);                         // Public: nearby freelancers
router.post('/:adId/click', trackAdClick);                           // Track click
router.post('/:adId/view', trackAdView);                             // Track view

export default router;
