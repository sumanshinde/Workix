import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'bharatgig_dev_secret_key_2026';

const sendToken = (user: any, statusCode: number, res: Response) => {
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as any,
  };

  res.cookie('token', token, cookieOptions);

  res.status(statusCode).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    token // Send token in body for mobile/legacy support
  });
};

export const logout = async (req: Request, res: Response) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: 'User logged out' });
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { name, email, providerId, image } = req.body;
    let user: any = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        googleId: providerId,
        role: 'freelancer', // Default role for social login
        avatar: image,
      });
      await user.save();
    } else {
      if (!user.googleId) user.googleId = providerId;
      if (!user.avatar) user.avatar = image;
      await user.save();
    }
    
    const { trackEvent } = await import('../services/analyticsService');
    await trackEvent('login_google', 'onboarding', user._id, { role: user.role });

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password, role, referralCode: usedCode } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const personalCode = `BHARAT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    let referrer: any = null;
    if (usedCode) {
      referrer = await User.findOne({ referralCode: usedCode });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ 
      name, 
      email, 
      password: hashedPassword, 
      role, 
      referralCode: personalCode,
      referredBy: referrer ? referrer._id : undefined
    });

    await user.save();

    if (referrer) {
      try {
        const ReferralModel = require('../models/Referral').default;
        await ReferralModel.create({
          referrerId: referrer._id,
          referredUserId: user._id,
          status: 'joined',
          metadata: { userRole: role, ipAddress: req.ip }
        });
      } catch (err) { console.error('Referral creation failed', err); }
    }

    const { trackEvent } = await import('../services/analyticsService');
    await trackEvent('signup_complete', 'onboarding', String(user._id), { role, referral: !!referrer });

    sendToken(user, 201, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user: any = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const { trackEvent } = await import('../services/analyticsService');
    await trackEvent('login_credentials', 'onboarding', user._id, { role: user.role });

    sendToken(user, 200, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};
