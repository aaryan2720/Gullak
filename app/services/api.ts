import { Alert } from 'react-native';

const API_BASE_URL = 'http://localhost:5000/api';
const AI_BASE_URL = 'http://localhost:8000/api/ai';

// In-memory token storage
let authToken: string | null = null;
let currentUser: any | null = null;

// Mock fallback databases (to preserve state locally in-memory if backend is offline)
let mockPortfolio = {
  summary: { totalInvested: 0, currentValue: 0, totalReturns: 0, returnPercentage: 0 },
  holdings: [
    { instrumentType: 'index_fund', instrumentName: 'Nifty 50 Index Fund', investedAmount: 0, currentValue: 0, returns: 0, returnPercentage: 0, allocation: 60 },
    { instrumentType: 'digital_gold', instrumentName: 'SafeGold Digital Gold', investedAmount: 0, currentValue: 0, returns: 0, returnPercentage: 0, allocation: 30 },
    { instrumentType: 'bond', instrumentName: 'HDFC Corp Bonds Fund', investedAmount: 0, currentValue: 0, returns: 0, returnPercentage: 0, allocation: 10 }
  ],
  assetAllocation: { equity: 60, debt: 10, gold: 30, other: 0 }
};

let mockGoals = [
  { id: 1, title: 'New iPhone', emoji: '📱', color: '#4CAF50', current: 5000, target: 30000, category: 'gadgets', targetDate: '2025-12-31' },
  { id: 2, title: 'Goa Trip', emoji: '🌴', color: '#FF9800', current: 1500, target: 15000, category: 'travel', targetDate: '2025-10-31' }
];

export const setToken = (token: string | null) => {
  authToken = token;
};

export const getToken = () => authToken;

// Helper to make API requests with automatic JWT headers
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.append('Content-Type', 'application/json');
  if (authToken) {
    headers.append('Authorization', `Bearer ${authToken}`);
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, { ...options, headers });
    const json = await response.json();
    return json;
  } catch (error) {
    console.log(`Connection to ${url} failed. Offline fallback mode active.`);
    throw error;
  }
}

export const apiService = {
  // 1. AUTHENTICATION
  async register(name: string, email: string, phone: string, password: string) {
    try {
      const res = await fetchAPI('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, phone, password })
      });
      if (res.success) {
        authToken = res.data.token;
        currentUser = res.data.user;
      }
      return res;
    } catch (err) {
      // Local fallback registration
      authToken = 'mock_jwt_token_gullak_' + Math.random().toString();
      currentUser = { id: 'usr_mock', name, email, phone, kycStatus: 'pending' };
      return {
        success: true,
        data: { token: authToken, user: currentUser }
      };
    }
  },

  async login(identifier: string, password: string) {
    try {
      const res = await fetchAPI('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ identifier, password })
      });
      if (res.success) {
        authToken = res.data.token;
        currentUser = res.data.user;
      }
      return res;
    } catch (err) {
      // Local fallback login
      authToken = 'mock_jwt_token_gullak_login';
      currentUser = { id: 'usr_mock', name: 'Rahul Sharma', email: 'rahul@example.com', phone: '+919876543210', kycStatus: 'verified' };
      return {
        success: true,
        data: { token: authToken, user: currentUser }
      };
    }
  },

  // 2. PORTFOLIO & INVESTMENTS
  async getPortfolio() {
    try {
      const res = await fetchAPI('/invest/portfolio');
      if (res.success) {
        // Sync local mock database with database results
        mockPortfolio = res.data;
        return res.data;
      }
      return mockPortfolio;
    } catch (err) {
      return mockPortfolio;
    }
  },

  async investManual(amount: number, allocation: any, goalId?: number | string) {
    try {
      const res = await fetchAPI('/invest/manual', {
        method: 'POST',
        body: JSON.stringify({ amount, allocation, goalId })
      });
      if (res.success && !goalId) {
        // Sync portfolio summary locally
        mockPortfolio.summary.totalInvested += amount;
        mockPortfolio.summary.currentValue = mockPortfolio.summary.totalInvested * 1.05;
        mockPortfolio.summary.totalReturns = mockPortfolio.summary.currentValue - mockPortfolio.summary.totalInvested;
        mockPortfolio.summary.returnPercentage = 5.0;
      }
      return res;
    } catch (err) {
      // Local fallback calculation
      mockPortfolio.summary.totalInvested += amount;
      mockPortfolio.summary.currentValue = mockPortfolio.summary.totalInvested * 1.05;
      mockPortfolio.summary.totalReturns = mockPortfolio.summary.currentValue - mockPortfolio.summary.totalInvested;
      mockPortfolio.summary.returnPercentage = 5.0;
      
      if (goalId) {
        const goalIndex = mockGoals.findIndex(g => g.id === goalId);
        if (goalIndex !== -1) {
          mockGoals[goalIndex].current += amount;
        }
      }

      const mockHash = '0x' + Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
      return {
        success: true,
        data: {
          transactionId: 'txn_mock_' + Math.random().toString(36).substring(7),
          amount,
          status: 'completed',
          razorpayPaymentId: 'pay_Gullak_mock_' + Math.random().toString(36).substring(7).toUpperCase(),
          blockchainReceipt: {
            txHash: mockHash,
            blockNumber: 17290145,
            verified: true
          }
        }
      };
    }
  },

  // 3. GOALS
  async getGoals() {
    try {
      const res = await fetchAPI('/goals');
      if (res.success) {
        // Map database schema values to goals components
        const mappedGoals = res.data.map((g: any) => ({
          id: g._id,
          title: g.title,
          emoji: g.emoji,
          color: g.color,
          current: g.financial.currentAmount,
          target: g.financial.targetAmount,
          category: g.category,
          targetDate: g.timeline.targetDate
        }));
        return mappedGoals;
      }
      return mockGoals;
    } catch (err) {
      return mockGoals;
    }
  },

  async createGoal(title: string, targetAmount: number, targetDate: string, category: string, emoji: string, color: string) {
    try {
      const res = await fetchAPI('/goals', {
        method: 'POST',
        body: JSON.stringify({ title, targetAmount, targetDate, category, emoji, color })
      });
      return res;
    } catch (err) {
      // Local fallback create
      const newGoal = {
        id: mockGoals.length + 1,
        title,
        emoji,
        color,
        current: 0,
        target: targetAmount,
        category,
        targetDate
      };
      mockGoals.push(newGoal);
      return { success: true, data: newGoal };
    }
  },

  async contributeGoal(goalId: number | string, amount: number) {
    try {
      const res = await fetchAPI(`/goals/${goalId}/contribute`, {
        method: 'POST',
        body: JSON.stringify({ amount })
      });
      return res;
    } catch (err) {
      const goalIndex = mockGoals.findIndex(g => g.id === goalId);
      if (goalIndex !== -1) {
        mockGoals[goalIndex].current += amount;
      }
      return { success: true };
    }
  },

  // 4. CHAT AI COACH
  async askAICoach(message: string, riskProfile: string) {
    try {
      // Package payload context for AI processing
      const payload = {
        message,
        userId: currentUser?.id || 'usr_mock',
        riskProfile,
        portfolio: {
          totalInvested: mockPortfolio.summary.totalInvested,
          currentValue: mockPortfolio.summary.currentValue,
          totalReturns: mockPortfolio.summary.totalReturns,
          returnPercentage: mockPortfolio.summary.returnPercentage
        },
        goals: mockGoals.map(g => ({
          title: g.title,
          targetAmount: g.target,
          currentAmount: g.current,
          targetDate: g.targetDate
        }))
      };

      const response = await fetch(`${AI_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const res = await response.json();
      return res;
    } catch (err) {
      // Local rule-based AI fallback client-side if AI server is offline
      const query_lower = message.toLowerCase();
      let response_text = "";
      let suggested: string[] = [];

      if (["hi", "hello", "hey", "gullak"].some(w => query_lower.includes(w))) {
        response_text = `Hello! I am your Gullak AI Advisor. Based on your ${riskProfile} risk profile, I can help you optimize your portfolio, suggest goal contributions, or explain financial concepts. What's on your mind today?`;
        suggested = ["Show my returns summary", "Am I on track for my goals?", "Explain mutual funds"];
      } else if (["portfolio", "returns", "invested", "investment", "money"].some(w => query_lower.includes(w))) {
        response_text = `Your portfolio is looking healthy! You have invested a total of ₹${mockPortfolio.summary.totalInvested.toLocaleString()}, which is currently valued at ₹${mockPortfolio.summary.currentValue.toLocaleString()}. This represents a return of ₹${mockPortfolio.summary.totalReturns.toLocaleString()} (${mockPortfolio.summary.returnPercentage}%). Given your ${riskProfile} profile, I suggest keeping 60% in Nifty Index Funds, 30% in Digital Gold, and 10% in Corporate Bonds.`;
        suggested = ["How do round-ups work?", "Set up an auto-invest rule"];
      } else if (["goal", "target", "iphone", "vacation", "save"].some(w => query_lower.includes(w))) {
        response_text = "I see your active goals. To reach these targets faster, I suggest setting up a weekly Auto-Contribute of ₹100. Based on your spending, you can easily save an extra ₹400/month by enabling the Auto Round-up agent!";
        suggested = ["Create a new goal", "What are suggested goals for Gen-Z?"];
      } else {
        response_text = `Interesting question! Under your ${riskProfile} risk profile, my main recommendation is to maintain disciplined micro-savings. Saving just ₹20 daily through round-ups adds up to ₹7,300/year, compounding at an average of 12% in index funds. How else can I assist your financial journey?`;
        suggested = ["Show my returns summary", "Explain Digital Gold"];
      }

      return {
        success: true,
        response: response_text,
        agentUsed: "Local Failover Client Agent",
        suggestedActions: suggested
      };
    }
  }
};
