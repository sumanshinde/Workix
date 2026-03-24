import { Request, Response } from 'express';
import User from '../models/User';

export const saveLocation = async (req: Request, res: Response) => {
  try {
    const { lat, lng, address } = req.body;
    const userId = (req as any).user.id;

    if (lat === undefined || lng === undefined || !address) {
      return res.status(400).json({ message: 'latitude, longitude, and address are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.location = { lat, lng, address };
    // Synchronize legacy fields for backward compatibility
    user.latitude = lat;
    user.longitude = lng;
    user.address = address;
    user.locationName = address.split(',')[0]; // Simple fallback
    await user.save();

    res.json({ message: 'Location saved successfully', location: user.location });
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to save location', error: error.message });
  }
};

export const getLocation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const user = await User.findById(userId).select('location');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.location || {});
  } catch (error: any) {
    res.status(500).json({ message: 'Failed to retrieve location', error: error.message });
  }
};
