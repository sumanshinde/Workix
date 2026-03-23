import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LeadLockService } from '../server/src/services/leadLockService';

dotenv.config();

/**
 * Lead Lock Cron Job:
 * This script should run every 24 hours to automatically refund credits 
 * to freelancers if a client remains inactive for 4 days after proposal submission.
 */
async function runLeadLockMaintenance() {
  console.log('── Running Lead Lock Maintenance ──');
  
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/fiverr_clone');
    console.log('✅ Connected to MongoDB Clusters');

    const refundCount = await LeadLockService.processAutoRefunds();
    
    console.log(`✅ Maintenance Complete. Total Credits Refunded: ${refundCount}`);
  } catch (err) {
    console.error('❌ Maintenance Failed:', err);
  } finally {
    await mongoose.disconnect();
  }
}

runLeadLockMaintenance();
