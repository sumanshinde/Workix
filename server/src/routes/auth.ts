import { Router } from 'express';
import { register, login, googleLogin, logout } from '../controllers/auth';
import { protect } from '../middleware/auth';
import User from '../models/User';

const router = Router();

// Public
router.post('/register', register);
router.post('/login',    login);
router.post('/google',   googleLogin);
router.get('/logout',    logout);


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
    res.json(user);
  } catch { res.status(500).json({ message: 'Server error' }); }
});

export default router;
