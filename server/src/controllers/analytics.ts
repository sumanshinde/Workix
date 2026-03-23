import { Request, Response } from 'express';
import * as AnalyticsService from '../services/AnalyticsService';

export const getGrowthStats = async (req: Request, res: Response) => {
  try {
    const stats = await AnalyticsService.getGrowthMetrics();
    res.json(stats);
  } catch (err: any) {
    res.status(500).json({ message: 'Metric aggregation failed', error: err.message });
  }
};

export const getFunnelStats = async (req: Request, res: Response) => {
  try {
    const funnel = await AnalyticsService.getFunnelData();
    res.json(funnel);
  } catch (err: any) {
    res.status(500).json({ message: 'Funnel analysis failed', error: err.message });
  }
};

export const getTopPerformers = async (req: Request, res: Response) => {
  try {
     const data = await AnalyticsService.getTrendingPerformance();
     res.json(data);
  } catch (err: any) {
     res.status(500).json({ message: 'Performance analysis failed', error: err.message });
  }
};
