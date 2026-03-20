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

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:3001'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fiverr_clone';

// Middelewares
app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
}));
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());
app.use(helmet()); 
app.use(hpp());
app.use(compression());

// Global API Rate Limiting
app.use('/api', apiLimiter);

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

app.get('/', (req, res) => {
  res.json({ message: 'BharatGig API Cluster Operational', status: 'Healthy' });
});

// Final Error Handling Middleware
app.use(errorHandler);

import Message from './models/Message';
import ActivityLog from './models/ActivityLog';

// Socket.io Logic
io.on('connection', (socket) => {
  socket.on('join_chat', (userId) => socket.join(userId));
  socket.on('send_msg', async (data) => {
    try {
      const msg = await Message.create({
        senderId: data.senderId,
        receiverId: data.receiverId,
        text: data.text
      });
      const populatedMsg = await msg.populate([{path: 'senderId', select:'name role'}, {path: 'receiverId'}]);
      io.to(data.receiverId).emit('receive_msg', populatedMsg);
      io.emit('receive_msg', populatedMsg); // Broadcast to admin monitor
      
      const act = await ActivityLog.create({
        userId: data.senderId,
        action: 'message_sent',
        details: { text: data.text, receiverId: data.receiverId }
      });
      const popAct = await act.populate('userId');
      io.emit('new_activity', popAct);

      // Fraud Check
      const lower = data.text.toLowerCase();
      if (lower.includes('whatsapp') || lower.includes('telegram') || lower.includes('pay outside') || lower.includes('skype') || lower.includes('direct payment')) {
        const User = require('./models/User').default;
        await User.findByIdAndUpdate(data.senderId, { $inc: { riskScore: 25 }, isFlagged: true });
        
        const fraudAct = await ActivityLog.create({
          userId: data.senderId,
          action: 'fraud_alert',
          details: { reason: 'Off-platform communication detected', text: data.text }
        });
        const popFraud = await fraudAct.populate('userId');
        io.emit('new_activity', popFraud);
        io.emit('sys_alert', popFraud);
      }
    } catch(err) {
      console.error(err);
    }
  });
});

// Primary Database & Server Launch
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfuly');
    server.listen(PORT, () => {
      console.log(`🚀 Server Cluster Operational on Port ${PORT}`);
    });
  })
  .catch(err => console.error('❌ Database Sync Failure:', err));

export { io };
