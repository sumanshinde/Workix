import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
}

export const errorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  console.error(`[Error] ${err.message}`, {
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  // Log to Analytics
  try {
    const { trackEvent } = require('../services/AnalyticsService');
    const userId = (req as any).user?.id || 'anonymous';
    trackEvent('api_error', 'system', userId, {
      message: err.message,
      path: req.path,
      statusCode: err.statusCode
    });
  } catch (logErr) {
    // Silent fail for logging errors
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
