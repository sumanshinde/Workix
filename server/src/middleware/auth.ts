import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'GigIndia_dev_secret_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired.' });
  }
};

// Alias used across all routes
export const protect = authenticate;

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    // Admins bypass all role checks
    if (req.user && req.user.role === 'admin') {
      return next();
    }

    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Role (${req.user?.role || 'none'}) is not authorized to access this resource` });
    }
    next();
  };
};
