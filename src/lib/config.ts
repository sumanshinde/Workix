export const BRANDING = {
  name: 'BharatGig',
  altName: 'BharatGig',
  displayName: 'BharatGig',
  shortName: 'BG',
  companyName: 'BharatGig Solutions',
  logoZap: true,
  theme: {
    bg: '#ffffff',
    surface: '#ffffff',
    surfaceElevated: '#f9fafb',
    border: '#e5e7eb',
    
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    accent: '#3b82f6',
    
    success: '#16a34a',
    warning: '#f59e0b',
    danger: '#dc2626',
    
    textPrimary: '#111827',
    textSecondary: '#4b5563',
    textMuted: '#6b7280',
  },
  seo: {
    title: 'BharatGig — India\'s Premium AI-Powered Freelance Marketplace',
    description: 'Connect with verified professionals and high-quality projects. BharatGig is the leading platform for elite freelance talent in India.',
  },
  // Pay-as-you-go marketplace pricing defaults (in INR)
  marketplace: {
    requirementPostFee: 5,     // ₹5 to post a requirement
    freelancerEarnFixed: 9,    // ₹9 freelancer earns per lead
    platformMargin: 4,         // ₹4 margin (₹9 - ₹5)
  },
  // Ad pricing defaults (INR per day by type)
  adPricing: {
    post:     { perDay: 10, minDays: 1, maxDays: 30 },
    image:    { perDay: 25, minDays: 1, maxDays: 30 },
    category: { perDay: 50, minDays: 3, maxDays: 90 },
  },
};
