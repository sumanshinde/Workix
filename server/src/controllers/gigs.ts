import { Request, Response } from 'express';
import Gig from '../models/Gig';

export const createGig = async (req: Request, res: Response) => {
  try {
    const freelancerId = (req as any).user?.id;
    const { title, description, category, packages, tags } = req.body;
    const gig = new Gig({ freelancerId, title, description, category, packages, tags });
    await gig.save();
    res.status(201).json(gig);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getGigs = async (req: Request, res: Response) => {
  try {
    const { category, search, sort } = req.query;
    const query: any = { status: 'active' };
    if (category) query.category = category;
    if (search)   query.title    = { $regex: search as string, $options: 'i' };

    const sortOrder: any = sort === 'rating' ? { averageRating: -1 }
      : sort === 'price_low'  ? { 'packages.basic.price': 1 }
      : sort === 'price_high' ? { 'packages.basic.price': -1 }
      : { createdAt: -1 };

    const gigs = await Gig.find(query).sort(sortOrder).populate('freelancerId', 'name avatar');
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getGigById = async (req: Request, res: Response) => {
  try {
    const gig = await Gig.findById(req.params.id).populate('freelancerId', 'name avatar rating skills');
    if (!gig) return res.status(404).json({ message: 'Gig not found' });
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const updateGig = async (req: Request, res: Response) => {
  try {
    const freelancerId = (req as any).user?.id;
    const gig = await Gig.findOne({ _id: req.params.id, freelancerId });
    if (!gig) return res.status(404).json({ message: 'Gig not found or unauthorized' });
    Object.assign(gig, req.body);
    await gig.save();
    res.json(gig);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const deleteGig = async (req: Request, res: Response) => {
  try {
    const freelancerId = (req as any).user?.id;
    const gig = await Gig.findOneAndDelete({ _id: req.params.id, freelancerId });
    if (!gig) return res.status(404).json({ message: 'Gig not found or unauthorized' });
    res.json({ message: 'Gig deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getMyGigs = async (req: Request, res: Response) => {
  try {
    const freelancerId = (req as any).user?.id;
    const gigs = await Gig.find({ freelancerId }).sort({ createdAt: -1 });
    res.json(gigs);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};
