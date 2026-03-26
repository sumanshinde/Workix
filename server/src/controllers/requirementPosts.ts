import { Request, Response } from 'express';
import RequirementPost from '../models/RequirementPost';
import User from '../models/User';
import PlatformSettings from '../models/PlatformSettings';
import { createRazorpayOrder, verifyPaymentSignature } from '../services/paymentService';
import { createNotification } from '../services/notificationService';

// Get active platform settings (or defaults)
const getSettings = async () => {
  let settings = await PlatformSettings.findOne({ isActive: true }).lean();
  if (!settings) {
    settings = await PlatformSettings.create({});
  }
  return settings;
};

// ── CREATE REQUIREMENT POST (draft) ──────────────────────────────────────────
export const createRequirementPost = async (req: Request, res: Response) => {
  try {
    const { title, category, location, city, pincode, budget, description, image, features, isBoosted } = req.body;
    const userId = (req as any).user.id;

    if (!title || !category || !budget || !description) {
      return res.status(400).json({ message: 'Title, category, budget, and description are required.' });
    }

    const settings = await getSettings();
    
    // Fee calculation logic
    const baseFee = settings.requirementPostFee; // e.g. 500 paise (₹5)
    const boostFee = isBoosted ? 49900 : 0;        // e.g. 49900 paise (₹499)
    const totalFee = baseFee + boostFee;

    const post = new RequirementPost({
      title: title.trim(),
      category,
      location: location || '',
      city: city || '',
      pincode: pincode || '',
      budget,
      description: description.trim(),
      image,
      features: features || [],
      isBoosted: !!isBoosted,
      userId,
      feePaid: totalFee,
      status: 'pending_payment',
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    });

    await post.save();

    // Create Razorpay order for the total fee
    const feeInRupees = totalFee / 100;
    const order = await createRazorpayOrder(feeInRupees, `req_${post._id}`, {
      type: 'requirement_post',
      postId: String(post._id),
      isBoosted: String(!!isBoosted),
    });

    res.status(201).json({
      post,
      payment: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        feeDisplay: `₹${feeInRupees}`,
      },
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to create requirement post', error: err.message });
  }
};

// ── VERIFY PAYMENT & ACTIVATE POST ──────────────────────────────────────────
export const verifyRequirementPayment = async (req: Request, res: Response) => {
  try {
    const { postId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) return res.status(400).json({ message: 'Invalid payment signature' });

    const post = await RequirementPost.findByIdAndUpdate(
      postId,
      { isPaid: true, paymentId: razorpay_payment_id, status: 'active' },
      { new: true }
    );

    if (!post) return res.status(404).json({ message: 'Requirement post not found' });

    // Notify user
    await createNotification(
      post.userId.toString(),
      'Requirement Published! 🎉',
      `Your requirement "${post.title}" is now live on the marketplace.`,
      'system',
      '/marketplace'
    );

    // Find and notify matching freelancers nearby
    const matchQuery: any = { role: 'freelancer', isBlocked: { $ne: true } };
    if (post.city) matchQuery.city = { $regex: new RegExp(post.city, 'i') };
    
    const nearbyFreelancers = await User.find(matchQuery).select('_id').limit(20);
    
    for (const fl of nearbyFreelancers) {
      await createNotification(
        fl._id.toString(),
        'New Requirement Near You! 📍',
        `"${post.title}" — Budget ₹${post.budget}. Check it out!`,
        'lead',
        `/requirements/${post._id}`
      );
    }

    await RequirementPost.findByIdAndUpdate(postId, {
      matchedFreelancers: nearbyFreelancers.map(f => f._id),
    });

    res.json({ message: 'Payment verified. Requirement is now live!', post });
  } catch (err: any) {
    res.status(500).json({ message: 'Payment verification failed', error: err.message });
  }
};

// ── GET ALL ACTIVE REQUIREMENTS ──────────────────────────────────────────────
export const getRequirementPosts = async (req: Request, res: Response) => {
  try {
    const { category, city, pincode, search } = req.query;
    const query: any = { status: 'active' };

    if (category) query.category = category;
    if (city) query.city = { $regex: new RegExp(String(city), 'i') };
    if (pincode) query.pincode = pincode;
    if (search) query.$text = { $search: String(search) };

    const posts = await RequirementPost.find(query)
      .populate('userId', 'name avatar rating city')
      .sort({ isBoosted: -1, createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch requirements', error: err.message });
  }
};

// ── GET MY REQUIREMENT POSTS ─────────────────────────────────────────────────
export const getMyRequirementPosts = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const posts = await RequirementPost.find({ userId }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ message: 'Failed to fetch your requirements', error: err.message });
  }
};

// ── GET SINGLE REQUIREMENT ───────────────────────────────────────────────────
export const getRequirementById = async (req: Request, res: Response) => {
  try {
    const post = await RequirementPost.findById(req.params.id)
      .populate('userId', 'name avatar rating city locationName')
      .populate('matchedFreelancers', 'name avatar rating skills city');

    if (!post) return res.status(404).json({ message: 'Requirement not found' });

    // Increment views
    post.views += 1;
    await post.save();

    res.json(post);
  } catch (err: any) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

// ── RESPOND TO REQUIREMENT (freelancer) ──────────────────────────────────────
export const respondToRequirement = async (req: Request, res: Response) => {
  try {
    const { postId } = req.body;
    const freelancerId = (req as any).user.id;

    const post = await RequirementPost.findById(postId);
    if (!post || post.status !== 'active') {
      return res.status(404).json({ message: 'Requirement not found or inactive' });
    }

    // Credit freelancer ₹9
    const settings = await getSettings();
    const earnAmount = settings.freelancerEarnFixed; // in paise

    await User.findByIdAndUpdate(freelancerId, {
      $inc: { walletBalance: earnAmount },
    });

    post.responses += 1;
    if (!post.matchedFreelancers.includes(freelancerId)) {
      post.matchedFreelancers.push(freelancerId);
    }
    await post.save();

    // Notify the poster
    const freelancer = await User.findById(freelancerId).select('name');
    await createNotification(
      post.userId.toString(),
      'New Response! 💬',
      `${freelancer?.name || 'A freelancer'} responded to "${post.title}".`,
      'lead',
      `/requirements/${post._id}`
    );

    res.json({
      message: `Response recorded. ₹${earnAmount / 100} credited to your wallet.`,
      earnedAmount: earnAmount / 100,
    });
  } catch (err: any) {
    res.status(500).json({ message: 'Response failed', error: err.message });
  }
};
