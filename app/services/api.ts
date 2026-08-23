import Constants from 'expo-constants';

// Automatically detect the host computer's IP address on the local network (for physical device testing with Expo Go)
const getLocalDevIp = () => {
  const hostUri = Constants.expoConfig?.hostUri;
  if (!hostUri) return 'localhost';
  const ip = hostUri.split(':')[0];
  return ip || 'localhost';
};

const devIp = getLocalDevIp();
const API_BASE_URL = `http://${devIp}:5000/api`;
const AI_BASE_URL = `http://${devIp}:8000/api/ai`;

console.log(`[Gullak API] Base URL: ${API_BASE_URL}`);

// In-memory token (also backed by AsyncStorage via AuthContext)
let authToken: string | null = null;

// Helper to make authenticated API requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }
  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`);
  }
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  try {
    const response = await fetch(url, { ...options, headers });
    const json = await response.json();
    return json;
  } catch (error: any) {
    console.warn(`[API] Request to ${url} failed: ${error.message}`);
    throw error;
  }
}

export const apiService = {
  // Token management (called by AuthContext)
  setToken(token: string | null) {
    authToken = token;
  },
  getToken() {
    return authToken;
  },

  // ═══════════════════════════════════════
  // AUTH
  // ═══════════════════════════════════════
  async register(name: string, email: string, phone: string, password: string) {
    return fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    });
  },

  async login(identifier: string, password: string) {
    return fetchAPI('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    });
  },

  async getMe() {
    return fetchAPI('/users/me');
  },

  // ═══════════════════════════════════════
  // PORTFOLIO & INVESTMENTS
  // ═══════════════════════════════════════
  async getPortfolio() {
    const res = await fetchAPI('/invest/portfolio');
    return res.success ? res.data : null;
  },

  async getPortfolioHistory(period: '1W' | '1M' | '3M' | '1Y' = '1M') {
    const res = await fetchAPI(`/invest/portfolio/history?period=${period}`);
    return res.success ? res.data : [];
  },

  // ═══════════════════════════════════════
  // PAYMENTS (Real Razorpay flow)
  // ═══════════════════════════════════════
  async createPaymentOrder(amount: number, notes: Record<string, string> = {}) {
    return fetchAPI('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ amount, notes }),
    });
  },

  async verifyPayment(params: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
    amount: number;
    goalId?: string;
    allocation?: any;
    isMock?: boolean;
  }) {
    return fetchAPI('/payments/verify', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  async getPaymentHistory(page = 1, limit = 20) {
    const res = await fetchAPI(`/payments/history?page=${page}&limit=${limit}`);
    return res.success ? res.data : { transactions: [], pagination: {} };
  },

  // ═══════════════════════════════════════
  // TRANSACTIONS
  // ═══════════════════════════════════════
  async getTransactions(params: {
    page?: number;
    limit?: number;
    type?: string;
    category?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  } = {}) {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined).map(([k, v]) => [k, String(v)]))
    );
    const res = await fetchAPI(`/transactions?${query}`);
    return res.success ? res.data : { transactions: [], pagination: {} };
  },

  async getTransaction(id: string) {
    const res = await fetchAPI(`/transactions/${id}`);
    return res.success ? res.data : null;
  },

  async getWeeklySummary() {
    const res = await fetchAPI('/transactions/summary/weekly');
    return res.success ? res.data : { weeklyInvested: 0, weeklyRoundUps: 0, roundUpCount: 0 };
  },

  // ═══════════════════════════════════════
  // GOALS
  // ═══════════════════════════════════════
  async getGoals() {
    const res = await fetchAPI('/goals');
    if (!res.success) return [];
    return res.data.map((g: any) => ({
      id: g._id,
      title: g.title,
      emoji: g.emoji,
      color: g.color,
      current: g.financial?.currentAmount || 0,
      target: g.financial?.targetAmount || 0,
      category: g.category,
      targetDate: g.timeline?.targetDate,
      status: g.status,
    }));
  },

  async createGoal(data: {
    title: string;
    targetAmount: number;
    targetDate: string;
    category: string;
    emoji: string;
    color: string;
  }) {
    return fetchAPI('/goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async contributeGoal(goalId: string, amount: number, paymentDetails?: any) {
    return fetchAPI(`/goals/${goalId}/contribute`, {
      method: 'POST',
      body: JSON.stringify({ amount, ...paymentDetails }),
    });
  },

  async deleteGoal(goalId: string) {
    return fetchAPI(`/goals/${goalId}`, { method: 'DELETE' });
  },

  // ═══════════════════════════════════════
  // AI INSIGHTS & CHAT
  // ═══════════════════════════════════════
  async chatWithAI(message: string, sessionId?: string) {
    return fetchAPI('/insights/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    });
  },

  async getChatHistory(sessionId?: string, page = 1) {
    const query = sessionId ? `?sessionId=${sessionId}&page=${page}` : `?page=${page}`;
    const res = await fetchAPI(`/insights/history${query}`);
    return res.success ? res.data : [];
  },

  async getWeeklyInsight() {
    const res = await fetchAPI('/insights/weekly');
    return res.success ? res.data : null;
  },

  // ═══════════════════════════════════════
  // USER PROFILE & STATS
  // ═══════════════════════════════════════
  async getUserStats() {
    const res = await fetchAPI('/users/stats');
    return res.success ? res.data : null;
  },

  async updateProfile(updates: { name?: string; avatar?: string; riskProfile?: string }) {
    return fetchAPI('/users/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  },

  async getReferralInfo() {
    const res = await fetchAPI('/users/referral');
    return res.success ? res.data : null;
  },

  async getBlockchainAudit(page = 1) {
    const res = await fetchAPI(`/users/blockchain-audit?page=${page}`);
    return res.success ? res.data : { events: [], pagination: {} };
  },
};

export default apiService;
