import { Router } from 'express';
import { register, login, googleLogin, logout, sendOTP, verifyOTP } from '../controllers/auth';
import { protect } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimiter';
import User from '../models/User';

const router = Router();

// Public
router.post('/register',   authLimiter, register);
router.post('/login',      authLimiter, login);
router.post('/google',     authLimiter, googleLogin);
router.get('/logout',      logout);

// OTP Auth (Mobile-First)
router.post('/otp/send',   authLimiter, sendOTP);
router.post('/otp/verify', authLimiter, verifyOTP);


// Protected — get current user
router.get('/me', protect, async (req: any, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Protected — update profile
router.put('/me', protect, async (req: any, res) => {
  try {
    const allowed = ['name', 'avatar', 'description', 'skills'];
    const update: any = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) update[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user.id, update, { new: true }).select('-password');
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

// Public — get freelancer profile
router.get('/profile/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -referralCode');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // ── Retention Trigger: Notification to Freelancer ────────────────────────
    if (user.role === 'freelancer') {
      const { createNotification } = require('../services/notificationService');
      await createNotification(
        user._id,
        '👀 New Profile View',
        'A potential client just viewed your GigIndia profile. Keep it updated!',
        'profile_view',
        '/profile/me'
      );
    }

    res.json(user);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

export default router;
