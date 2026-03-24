import mongoose from 'mongoose';

const adPricingTierSchema = new mongoose.Schema({
  perDay: { type: Number, required: true },
  minDays: { type: Number, default: 1 },
  maxDays: { type: Number, default: 30 },
}, { _id: false });

const platformSettingsSchema = new mongoose.Schema({
  // Pay-as-you-go model
  requirementPostFee: { type: Number, default: 500 },  // ₹5 in paise
  freelancerEarnFixed: { type: Number, default: 900 },  // ₹9 in paise
  platformMarginPaise: { type: Number, default: 400 },  // ₹4 in paise

  // Ad pricing (in paise per day)
  adPricing: {
    post:     { type: adPricingTierSchema, default: { perDay: 1000, minDays: 1, maxDays: 30 } },
    image:    { type: adPricingTierSchema, default: { perDay: 2500, minDays: 1, maxDays: 30 } },
    category: { type: adPricingTierSchema, default: { perDay: 5000, minDays: 3, maxDays: 90 } },
  },

  // Subscription plans
  subscriptionPlans: [{
    name: { type: String },
    price: { type: Number }, // in paise
    duration: { type: Number }, // in days
    features: [{ type: String }],
  }],

  // Third-party API config (encrypted in prod)
  thirdParty: {
    mapProvider: { type: String, default: 'google' },
    mapApiKey: { type: String, default: '' },
    paymentGateway: { type: String, default: 'razorpay' },
  },

  isActive: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model('PlatformSettings', platformSettingsSchema);
