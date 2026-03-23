// Central API client for BharatGig frontend ↔ backend communication
// Backend base URL — change to your deployment URL in production
const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// ── Helper ───────────────────────────────────────────────────────────────────
const getToken = () => {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('token') || '';
};

async function request<T = any>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...((options.headers as Record<string, string>) || {}),
      },
      credentials: 'include',
      ...options,
    });
  } catch (error: any) {
    // Silently fail for tracking APIs to prevent UI breakage if backend is unreachable
    if (path.includes('/reports/track')) return {} as T;
    
    // Convert ugly "Failed to fetch" browser network errors into user-friendly ones
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error('Our servers are currently unreachable. Please make sure the backend API is running.');
    }
    
    throw error; // Re-throw for others so UI loaders drop properly
  }

  if (!res.ok) {
    // Silently fail for hidden tracking/analytics to prevent UI breakage during ad campaigns
    if (path.includes('/reports/track')) return {} as T;

    const err: any = await res.json().catch(() => ({ message: res.statusText }));
    const error: any = new Error(err.message || 'Request failed');
    error.status = res.status;
    throw error;
  }

  return res.json();
}

// ── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data: { name: string; email: string; password: string; role: string; referralCode?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  me: () => request('/auth/me'),
  logout: () => request('/auth/logout'),
  updateProfile: (data: { name?: string; avatar?: string; description?: string; skills?: string[] }) =>
    request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),
  getProfile: (id: string) => request(`/auth/profile/${id}`),

  // OTP Auth
  sendOTP: (phone: string) => 
    request('/auth/otp/send', { method: 'POST', body: JSON.stringify({ phone }) }),
  verifyOTP: (data: { phone: string; code: string; role?: string }) =>
    request('/auth/otp/verify', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Jobs ─────────────────────────────────────────────────────────────────────
export const jobsAPI = {
  getAll: (params?: {
    category?: string; search?: string; budgetMin?: number;
    budgetMax?: number; experienceLevel?: string; sort?: string;
  }) => {
    const q = new URLSearchParams(params as any).toString();
    return request(`/jobs${q ? '?' + q : ''}`);
  },

  getById:  (id: string)               => request(`/jobs/${id}`),
  getMy:    ()                          => request('/jobs/my'),
  create:   (data: any)                => request('/jobs',        { method: 'POST',   body: JSON.stringify(data) }),
  generateAI: (title: string, category: string) => request('/jobs/generate-ai', { method: 'POST', body: JSON.stringify({ title, category }) }),
  update:   (id: string, data: any)    => request(`/jobs/${id}`,  { method: 'PUT',    body: JSON.stringify(data) }),
  delete:   (id: string)               => request(`/jobs/${id}`,  { method: 'DELETE' }),
  getMatches: (id: string) => request(`/jobs/${id}/matches`),
};

// ── Proposals ────────────────────────────────────────────────────────────────
export const proposalsAPI = {
  submit: (data: { jobId: string; coverLetter: string; bidAmount: number; deliveryDays: number }) =>
    request('/proposals', { method: 'POST', body: JSON.stringify(data) }),
  
  generateAI: (jobId: string, freelancerProfile: string) =>
    request('/proposals/generate-ai', { method: 'POST', body: JSON.stringify({ jobId, freelancerProfile }) }),

  getMy:           ()                               => request('/proposals/my'),
  getForJob:       (jobId: string)                  => request(`/proposals/job/${jobId}`),
  updateStatus:    (id: string, status: string)     =>
    request(`/proposals/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
};

// ── Reviews ──────────────────────────────────────────────────────────────────
export const reviewsAPI = {
  create: (data: { contractId: string; revieweeId: string; rating: number; comment: string }) =>
    request('/reviews', { method: 'POST', body: JSON.stringify(data) }),

  getForUser: (userId: string) => request(`/reviews/user/${userId}`),
};

// ── Notifications ────────────────────────────────────────────────────────────
export const notificationsAPI = {
  getAll:  () => request('/notifications'),
  markRead: (id: string) => request(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllRead: () => request('/notifications/read-all', { method: 'PATCH' }),
};

// ── Contracts ────────────────────────────────────────────────────────────────
export const contractsAPI = {
  create: (data: { jobId: string; proposalId: string; freelancerId: string; amount: number; escrowId?: string }) =>
    request('/contracts', { method: 'POST', body: JSON.stringify(data) }),

  getMy:        ()                                     => request('/contracts/my'),
  submitWork:   (data: { contractId: string; content: string; attachments?: string[] }) =>
    request('/contracts/submit-work', { method: 'POST', body: JSON.stringify(data) }),
    
  approveWork:  (data: { contractId: string; submissionId: string }) =>
    request('/contracts/approve-work', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Payments ─────────────────────────────────────────────────────────────────
export const paymentsAPI = {
  createOrder: (data: { amount: number; jobId: string; clientId: string; freelancerId: string }) =>
    request('/payments/create-order', { method: 'POST', body: JSON.stringify(data) }),

  verify: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) =>
    request('/payments/verify', { method: 'POST', body: JSON.stringify(data) }),

  createGlobal: (data: { amount: number; currency: string; country: string }) => 
    request('/payments/create-global', { method: 'POST', body: JSON.stringify(data) }),
  getWallet:    () => request('/payments/wallet'),
  withdraw:     (data: { amount: number }) => 
    request('/payments/withdraw', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Tax & GST ────────────────────────────────────────────────────────────────
export const taxAPI = {
  getSummary: () => request('/tax/summary'),
  getInvoices: () => request('/tax/invoices'),
};

// ── Referrals ────────────────────────────────────────────────────────────────
export const referralAPI = {
  getStats: (userId: string) => request(`/referrals/stats/${userId}`),
  validate: (code: string)   => request(`/referrals/validate?code=${code}`),
};

// ── Platform Fees ────────────────────────────────────────────────────────────
export const feesAPI = {
  getFees:        ()            => request('/platform-fees'),
  updateFees:     (data: any)   => request('/platform-fees', { method: 'PUT', body: JSON.stringify(data) }),
  calculate:      (amount: number) => request('/platform-fees/calculate', { method: 'POST', body: JSON.stringify({ amount }) }),
  getTransactions: ()           => request('/platform-fees/transactions'),
};

// ── Analytics ──────────────────────────────────────────────────────────────
export const analyticsAPI = {
  track: (event: string, category: string, metadata?: any) =>
    request('/reports/track', { method: 'POST', body: JSON.stringify({ event, category, metadata }) }),
  
  getSummary: () => request('/reports/analytics'),
};

// ── Subscriptions ────────────────────────────────────────────────────────────
export const subscriptionAPI = {
  create: (userId: string) => request('/subscriptions/create', { method: 'POST', body: JSON.stringify({ userId }) }),
  getStatus: (userId: string) => request(`/subscriptions/status/${userId}`),
};

// ── Leads & CRM ──────────────────────────────────────────────────────────────
export const leadsAPI = {
  submit: (data: any) => request('/leads', { method: 'POST', body: JSON.stringify(data) }),
  getAll: () => request('/leads'),
  updateStatus: (id: string, status: string) => request(`/leads/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status }) }),
  addNote: (id: string, text: string) => request(`/leads/${id}/notes`, { method: 'POST', body: JSON.stringify({ text }) }),
};

export const shortlistsAPI = {
  create: (data: any) => request('/shortlists/create', { method: 'POST', body: JSON.stringify(data) }),
  get: (id: string) => request(`/shortlists/${id}`),
  approve: (id: string, freelancerUserId: string) => request(`/shortlists/${id}/approve`, { method: 'POST', body: JSON.stringify({ freelancerUserId }) }),
};

export const onboardingAPI = {
  getStatus: () => request('/onboarding/status'),
  setRole: (role: string) => request('/onboarding/role', { method: 'POST', body: JSON.stringify({ role }) }),
  updateStep: (step: string) => request('/onboarding/step', { method: 'POST', body: JSON.stringify({ step }) }),
  claimReward: () => request('/onboarding/reward/claim', { method: 'POST' }),
};

export const adminAnalyticsAPI = {
  getGrowth:     () => request('/admin/analytics/growth'),
  getFunnel:     () => request('/admin/analytics/funnel'),
  getPerformers: () => request('/admin/analytics/performers'),
};

export const experimentAPI = {
  getVariant: (name: string, userId: string) => request(`/experiments/assign?name=${name}&userId=${userId}`),
  track:      (name: string, userId: string, revenue: number = 0) => request('/experiments/track', { method: 'POST', body: JSON.stringify({ name, userId, revenue }) }),
  getAll:     () => request('/experiments/all'),
};

// ── Dashboard Aggregator ─────────────────────────────────────────────────────
export const dashboardAPI = {
  getStats: () => request('/dashboard/stats'),

  freelancer: async () => {
    try {
      const [proposals, contracts] = await Promise.all([
        proposalsAPI.getMy().catch(() => []),
        contractsAPI.getMy().catch(() => []),
      ]);
      return { proposals, contracts };
    } catch (e) {
      return { proposals: [], contracts: [] };
    }
  },

  client: async () => {
    try {
      const [jobs, contracts] = await Promise.all([
        jobsAPI.getMy().catch(() => []),
        contractsAPI.getMy().catch(() => []),
      ]);
      return { jobs, contracts };
    } catch (e) {
      return { jobs: [], contracts: [] };
    }
  },
};

// Legacy compatibility (old authService / jobService calls)
export const authService = {
  register: authAPI.register,
  login:    authAPI.login,
};

export const jobService = {
  getAll:  jobsAPI.getAll,
  getById: jobsAPI.getById,
  create:  jobsAPI.create,
};

export const gigService = {
  getAll:  jobsAPI.getAll,
  getById: jobsAPI.getById,
};

export const adminAPI = {
  getActivityLogs: () => request('/admin/activity'),
  getMessages: () => request('/admin/messages'),
  getUserActivities: (id: string) => request(`/admin/users/${id}/activities`),
  getDashboardStats: () => request('/admin/dashboard/stats'),
  getAllDisputes: () => request('/admin/disputes'),
  resolveDispute: (data: any) => request('/admin/disputes/resolve', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Orders ───────────────────────────────────────────────────────────────────
export const ordersAPI = {
  createInstant: (data: { jobId: string; freelancerId: string; amount: number }) => 
    request('/orders/instant-hire', { method: 'POST', body: JSON.stringify(data) }),
  verifyPayment: (data: any) => 
    request('/orders/verify-payment', { method: 'POST', body: JSON.stringify(data) }),
};

// ── Milestones ──────────────────────────────────────────────────────────────
export const milestonesAPI = {
  create:  (data: any) => request('/milestones/create', { method: 'POST', body: JSON.stringify(data) }),
  fund:    (id: string) => request(`/milestones/${id}/fund`, { method: 'POST' }),
  release: (id: string) => request(`/milestones/${id}/release`, { method: 'POST' }),
  getByOrder: (orderId: string) => request(`/milestones/order/${orderId}`),
};

// ── Disputes ─────────────────────────────────────────────────────────────────
export const disputesAPI = {
  create:  (data: any) => request('/disputes/create', { method: 'POST', body: JSON.stringify(data) }),
  getById: (id: string) => request(`/disputes/${id}`),
  getAll:  ()            => request('/disputes'),
  resolve: (id: string, data: any) => request(`/disputes/${id}/resolve`, { method: 'PUT', body: JSON.stringify(data) }),
};

// ── Profile Optimization ──────────────────────────────────────────────────────
export const profileAPI = {
  getAnalysis: () => request('/profile/analysis'),
  improve:     (data: { action: string }) => request('/profile/improve', { method: 'POST', body: JSON.stringify(data) }),
  getCreditScore: () => request('/profile/credit-score'),
};
