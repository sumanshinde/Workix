import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import hpp from 'hpp';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';

// Route Imports
import authRoutes from './routes/auth';
import gigRoutes from './routes/gigs';
import jobRoutes from './routes/jobs';
import proposalRoutes from './routes/proposals';
import paymentRoutes from './routes/payments';
import payoutRoutes from './routes/payouts';
import feeRoutes from './routes/fees';
import reportRoutes from './routes/reports';
import disputeRoutes from './routes/disputes';
import reviewRoutes from './routes/reviews';
import notificationRoutes from './routes/notifications';
import referralRoutes from './routes/referrals';
import contractRoutes from './routes/contracts';
import adminRoutes from './routes/admin';
import subscriptionRoutes from './routes/subscriptions';
import orderRoutes from './routes/orders';
import milestoneRoutes from './routes/milestones';
import profileRoutes from './routes/profile';
import taxRoutes from './routes/tax';
import dashboardRoutes from './routes/dashboard';
import leadRoutes from './routes/leads';
import shortlistRoutes from './routes/shortlists';
import onboardingRoutes from './routes/onboarding';
import analyticsRoutes from './routes/analytics';
import experimentRoutes from './routes/experiments';

import { handleStripeWebhook, handleRazorpayWebhook } from './controllers/webhooks';

dotenv.config();

const app = express();

// Webhook handling must be BEFORE express.json() for rawBody verification
app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);
app.post('/api/webhooks/razorpay', handleRazorpayWebhook);
const server = http.createServer(app);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const io = new Server(server, {
  cors: {
    origin: [CLIENT_URL, 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fiverr_clone';

// Middlewares
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(helmet({
  contentSecurityPolicy: false, 
}));
app.use(cors({
  origin: [CLIENT_URL, 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use(compression());

// Global API Rate Limiting
app.use('/api', apiLimiter);

// Health Check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'Healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV 
  });
});

// Route Registration
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/proposals', proposalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/platform-fees', feeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/milestones', milestoneRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/tax', taxRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/shortlists', shortlistRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/admin/analytics', analyticsRoutes);
app.use('/api/experiments', experimentRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'BharatGig API Cluster Operational', status: 'Healthy' });
});

// Error handling
app.use(errorHandler);

mongoose.connect(MONGO_URI)
  .then(() => console.log('Connected to MongoDB Production Instance'))
  .catch((err) => console.error('MongoDB Connection Crash:', err));

server.listen(PORT, () => {
  console.log(`[Prod-Ready] Server cluster running on port ${PORT}`);
});

export { io };
