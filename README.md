# GigIndia | The AI-First Freelancing Ecosystem

GigIndia is a production-grade, end-to-end platform designed to empower the next generation of digital talent. Built with a robust **Next.js 14+** frontend and a high-performance **Express API Cluster**, it optimizes the entire gig lifecycle from hiring to secure payout.

---

## ⚡ Core Pillars

- **AI-DRIVEN MATCHING**: Intelligent algorithm connecting the right skills to the right budget instantly.
- **SECURE ESCROW CLUSTER**: Full multi-stage payment protection with Razorpay + Stripe integration.
- **STRATEGIC ANALYTICS**: Executive dashboard for growth monitoring and funnel analysis.
- **A/B OPTIMIZATION LAB**: Built-in experiment engine for landing page and CTA split-testing.
- **REFERRAL NETWORK**: Viral multi-tier growth engine for user acquisition.

---

## 🏗️ Technical Architecture

### Frontend (User Interface)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + Framer Motion (Premium SaaS Aesthetic)
- **State**: React Hooks + Local Persistence
- **Matching Hub**: Specialized AI ranking dashboard

### Backend (API Infrastructure)
- **Engine**: Node.js / Express
- **Database**: MongoDB (Production Mongoose Cluster)
- **Security**: Helmet, Rate Limiting, XSS Protection, Mongo-Sanitize
- **Async Traffic**: Socket.io for real-time notification broadcasting

---

## 🚀 One-Click Deployment

### 1. Backend (Render / Heroku)
- Port: `5000` (Enforced `process.env.PORT`)
- Scripts: `npm install && npm run build`
- Start: `node dist/index.js`

### 2. Frontend (Vercel)
- Env: `NEXT_PUBLIC_API_URL`
- Deployment: Git-Hooked Vercel Integration

---

## 📦 Local Setup

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/sumanshinde/Workix
   cd Workix
   ```

2. **Backend Config**:
   ```bash
   cd server
   npm install
   cp .env.example .env
   npm run dev
   ```

3. **Frontend Config**:
   ```bash
   cd ..
   npm install
   npm run dev
   ```

---

## 🔥 Growth Optimization Features
The platform is equipped with `useExperiment()` — our internal engine to split-test conversion flows. 

To track a new experiment:
```tsx
const { variant, trackConversion } = useExperiment('new-checkout-cta');
```

---

## 🛡️ Maintainer & Support
Developed for global scale by the **Workix Engineering Team**.

`GigIndia 2026. Production-Ready Edition.`
