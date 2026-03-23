import { Request, Response } from 'express';
import ReadyApp from '../models/ReadyApp';

export const getReadyApps = async (req: Request, res: Response) => {
  try {
    const apps = await ReadyApp.find({}).populate('developerId', 'name avatar');
    res.json(apps);
  } catch (err: any) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};

export const createReadyApp = async (req: Request, res: Response) => {
  try {
    const { title, description, buyPrice, demoUrl, images, features, category } = req.body;
    const developerId = (req as any).user.id;
    const app = new ReadyApp({ title, description, buyPrice, demoUrl, images, features, developerId, category });
    await app.save();
    res.status(201).json(app);
  } catch (err: any) {
    res.status(500).json({ message: 'Creation failed', error: err.message });
  }
};

export const getAppById = async (req: Request, res: Response) => {
  try {
    const app = await ReadyApp.findById(req.params.id).populate('developerId', 'name avatar');
    if (!app) return res.status(404).json({ message: 'App not found' });
    res.json(app);
  } catch (err: any) {
    res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};
