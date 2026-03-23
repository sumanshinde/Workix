import { Request, Response } from 'express';
import { ExperimentService } from '../services/ExperimentService';

export const getAssignedVariant = async (req: Request, res: Response) => {
  try {
     const { name, userId } = req.query;
     const variant = await ExperimentService.getAssignedVariant(name as string, userId as string || 'anonymous');
     res.json({ variant });
  } catch (err: any) {
     res.status(500).json({ message: 'Assignment failed', error: err.message });
  }
};

export const trackExperimentConversion = async (req: Request, res: Response) => {
  try {
     const { name, userId, revenue } = req.body;
     await ExperimentService.trackConversion(name as string, userId as string || 'anonymous', revenue);
     res.json({ success: true });
  } catch (err: any) {
     res.status(500).json({ message: 'Tracking failed', error: err.message });
  }
};

export const listAllExperiments = async (req: Request, res: Response) => {
  try {
     const list = await ExperimentService.listExperiments();
     res.json(list);
  } catch (err: any) {
     res.status(500).json({ message: 'Fetch failed', error: err.message });
  }
};
