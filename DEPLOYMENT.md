# Deployment & Domain Connection Guide 🚀

Follow these steps to deploy your **BharatGig** marketplace and connect your custom domain.

## 1. Hosting Platforms (Recommended)
- **Frontend**: [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
- **Backend**: [Render](https://render.com), [Railway](https://railway.app), or [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
- **Database**: [MongoDB Atlas](https://www.mongodb.com/atlas/database)

---

## 2. DNS Instructions (Connecting Your Domain)

If you purchased a domain from GoDaddy, Namecheap, or Google Domains, follow these steps:

### A. Pointing to the Frontend
Go to your DNS provider's dashboard and add these records:

| Type | Name | Content / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` | `76.76.21.21` (Vercel IP) | Points your root domain |
| **CNAME** | `www` | `cname.vercel-dns.com` | Points the www version |

### B. Redirects (www to non-www)
Most modern hosting platforms (like Vercel) handle this automatically. Simply add both `yourdomain.com` and `www.yourdomain.com` in the hosting settings, and select one as the primary. The other will automatically redirect.

---

## 3. SSL (HTTPS)
SSL is **Auto-enabled** by default on Vercel, Netlify, and Render. 
- You do **not** need to purchase an SSL certificate separately.
- Once the DNS propagates (usually 1-2 hours), the platform will automatically issue a Let's Encrypt certificate.

---

## 4. Environment Variables Configuration
Ensure these are set in your deployment dashboard:

### Backend (.env)
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
RAZORPAY_KEY_ID=your_razorpay_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
FRONTEND_URL=https://your-domain.com
```

### Frontend (.env)
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

---

## 5. Deployment Steps (Step-by-Step)

1. **Database**: Create a project in MongoDB Atlas, white-list `0.0.0.0/0` (or the IP of your backend), and get the URI.
2. **Backend**: 
   - Push your code to GitHub.
   - Connect GitHub to [Render.com](https://render.com).
   - Use `npm install` for build and `node server/src/index.js` for start.
   - Add your `.env` variables.
3. **Frontend**:
   - Connect GitHub to [Vercel](https://vercel.com).
   - Vercel automatically detects Next.js.
   - Add `NEXT_PUBLIC_API_URL`.
   - Hit "Deploy".

## Summary Table for DNS
| Hostname | Type | Value |
| :--- | :--- | :--- |
| `bharatgig.com` | `A` | `76.76.21.21` |
| `www.bharatgig.com` | `CNAME` | `cname.vercel-dns.com` |

---
**Need Help?** Verify your DNS propagation at [whatsmydns.net](https://whatsmydns.net).
