import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'GigIndia_dev_secret_key_2026';

const sendToken = (user: any, statusCode: number, req: Request, res: Response) => {
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

  // ── ENTERPRISE SECURITY: HTTP-ONLY COOKIES ──────────────────────────────────
  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true, // Prevents XSS script from reading token
    secure: process.env.NODE_ENV === 'production' || req.headers['x-forwarded-proto'] === 'https',
    sameSite: (process.env.NODE_ENV === 'production' ? 'none' : 'lax') as any,
  };

  res.cookie('token', token, cookieOptions);

  // In production, we minimize sensitive data in body
  res.status(statusCode).json({
    success: true,
    user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
    // token is sent in Cookie. Retained in body ONLY for specific legacy API consumers
    token: process.env.NODE_ENV === 'production' ? undefined : token 
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
      const personalCode = `BHARAT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
      user = new User({
        name,
        email,
        googleId: providerId,
        role: 'freelancer', // Default role for social login
        avatar: image,
        referralCode: personalCode,
      });
      await user.save();
    } else {
      if (!user.googleId) user.googleId = providerId;
      if (!user.avatar) user.avatar = image;
      await user.save();
    }
    
    const { trackEvent } = await import('../services/AnalyticsService');
    await trackEvent('login_google', 'onboarding', user._id, { role: user.role });

    sendToken(user, 200, req, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role, city, gender, category, referralCode: usedCode } = req.body;
    
    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) return res.status(400).json({ message: 'User with this email or phone already exists' });

    const personalCode = `BHARAT-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

    let referrer: any = null;
    if (usedCode) {
      referrer = await User.findOne({ referralCode: usedCode });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({ 
      name, 
      email, 
      phone,
      city,
      gender,
      category,
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

    const { trackEvent } = await import('../services/AnalyticsService');
    await trackEvent('signup_complete', 'onboarding', String(user._id), { role, referral: !!referrer });

    // ── Strategic Growth: Experiment Conversion Tracking ──────────────────────
    try {
      const { ExperimentService } = require('../services/ExperimentService');
      await ExperimentService.trackConversion('landing-page-hero', String(user._id));
      await ExperimentService.trackConversion('onboarding-flow-v3', String(user._id));
    } catch (e) { console.warn('Exp tracking failed during signup'); }

    sendToken(user, 201, req, res);
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, phone, password } = req.body;

    // ── ENTERPRISE SECURITY: Phone login via OTP ONLY ──────────────────────────
    if (phone) {
      return res.status(403).json({ 
        success: false, 
        message: 'Phone-based login requires OTP verification. Please use the "Login with Phone" flow.' 
      });
    }

    if (!email) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user: any = await User.findOne({ email });
    if (!user || !user.password) return res.status(400).json({ message: 'Invalid credentials. User not found or uses social login.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Invalid credentials' });

    const { trackEvent } = await import('../services/AnalyticsService');
    await trackEvent('login_credentials', 'onboarding', user._id, { role: user.role });

    sendToken(user, 200, req, res);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err });
  }
};

import OTP from '../models/OTP';

const sendOTPToProvider = async (phone: string, code: string, method: 'whatsapp' | 'sms') => {
  console.log(`[AUTH_PROVIDER] Sending ${code} to ${phone} via ${method.toUpperCase()}`);
  
  /**
   * ── PRODUCTION INTEGRATIONS ────────────────────────────────────────────────
   * Option A: Firebase Auth Admin
   * Option B: SMS API (Twilio / MSG91 / Gupshup)
   */
  if (process.env.MSG91_AUTH_KEY) {
      // Example for MSG91 / SMS Pipeline
      // try {
      //   const axios = require('axios');
      //   await axios.post('https://api.msg91.com/api/v5/otp', {
      //     template_id: "YOUR_TEMPLATE_ID", mobile: phone, authkey: process.env.MSG91_AUTH_KEY, otp: code
      //   });
      // } catch (e) { console.error('SMS Provider Error', e); return false; }
  }
  
  return true; 
};

// ── Send OTP (WhatsApp Primary) ─────────────────────────────────────────────
export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phone } = req.body;
    if (!phone) return res.status(400).json({ message: 'Phone number is required' });

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min expiry

    // Delete existing OTP for this phone
    await OTP.deleteMany({ phone });

    // Save hashed OTP
    await OTP.create({ phone, code, expiresAt });

    // Try sending via WhatsApp first, then SMS fallback
    const sent = await sendOTPToProvider(phone, code, 'whatsapp');
    if (!sent) await sendOTPToProvider(phone, code, 'sms');

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'OTP transmission failed', error: err.message });
  }
};

// ── Verify OTP & Login/Register ─────────────────────────────────────────────
export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phone, code, role } = req.body; 
    if (!phone || !code) return res.status(400).json({ message: 'Phone and code required' });

    const otpRecord = (await OTP.findOne({ phone })) as any;
    if (!otpRecord) return res.status(400).json({ message: 'OTP expired or not found' });

    if (otpRecord.attempts >= 5) {
       await OTP.deleteOne({ phone });
       return res.status(403).json({ message: 'Maximum attempts reached. Request new OTP.' });
    }

    const isMatched = await otpRecord.compareOTP(code);
    if (!isMatched) {
      otpRecord.attempts += 1;
      await otpRecord.save();
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // OTP Valid - Proceed to Auth
    let user: any = await User.findOne({ phone });
    let isNewUser = false;

    if (!user) {
      isNewUser = true;
      user = new User({
        name: `User_${phone.slice(-4)}`, // Placeholder name
        phone,
        role: role || 'freelancer', // Default role if not provided
        availableCredits: 10,
        isKycVerified: false
      });
      await user.save();
    }

    // Clear OTP record
    await OTP.deleteOne({ phone });

    // Generate and Set Cookie
    sendToken(user, 200, req, res);
  } catch (err: any) {
    res.status(500).json({ success: false, message: 'Verification failed', error: err.message });
  }
};
