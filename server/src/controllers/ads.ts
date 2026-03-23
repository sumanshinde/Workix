import { Request, Response } from 'express';
import Ad from '../models/Ad';
import User from '../models/User';

export const createAd = async (req: Request, res: Response) => {
  try {
    const { title, description, image, adType, target, location, latitude, longitude, budget } = req.body;
    const ownerId = (req as any).user.id;
    const ad = new Ad({ title, description, image, adType, target, location, latitude, longitude, ownerId, budget });
    await ad.save();
    res.status(201).json(ad);
  } catch (err: any) {
    res.status(500).json({ message: 'Ad creation failed', error: err.message });
  }
};

export const getAds = async (req: Request, res: Response) => {
  try {
    const { target, lat, lng } = req.query;
    const query: any = { isActive: true };
    if (target) query.target = { $in: [target, 'BOTH'] };
    
    // Simple spatial sort if coordinates provided
    const ads = await Ad.find(query).sort({ createdAt: -1 }).limit(5);
    res.json(ads);
  } catch (err: any) {
    res.status(500).json({ message: 'Fetch ads failed', error: err.message });
  }
};

export const getNearbyFreelancers = async (req: Request, res: Response) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) return res.status(400).json({ message: 'Coordinates required' });

    const radius = 0.5; // Roughly 50km box
    const users = await User.find({
      role: 'freelancer',
      latitude: { $gte: Number(lat) - radius, $lte: Number(lat) + radius },
      longitude: { $gte: Number(lng) - radius, $lte: Number(lng) + radius }
    }).select('name avatar role rating locationName skills').limit(20);
    
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: 'Nearby search failed', error: err.message });
  }
};
