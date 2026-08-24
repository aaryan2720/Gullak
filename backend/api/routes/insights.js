const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');
const ChatMessage = require('../models/ChatMessage');
const Portfolio = require('../models/Portfolio');
const Goal = require('../models/Goal');

// ---------------------------------------------------------------------------
// Helper to call Gemini REST API directly in Node
// ---------------------------------------------------------------------------
async function callGemini(prompt, maxTokens = 512) {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-3.7-flash';

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not defined in environment');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;

  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: {
      temperature: 0.7,
      topP: 0.9,
      maxOutputTokens: maxTokens,
    }
  }, {
    headers: { 'Content-Type': 'application/json' },
    timeout: 10000
  });

  const candidates = response.data?.candidates;
  if (!candidates || candidates.length === 0) {
    throw new Error('Gemini API returned no candidates');
  }

  const text = candidates[0].content?.parts?.[0]?.text;
  if (!text) {
    throw new Error('Gemini API returned empty text');
  }

  return text.trim();
}

// ---------------------------------------------------------------------------
// POST /api/insights/chat
// ---------------------------------------------------------------------------
router.post('/chat', auth, async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message?.trim()) {
    return res.status(400).json({ success: false, error: { code: 'EMPTY_MESSAGE', message: 'Message cannot be empty' } });
  }

  let portfolio = null;
  let goals = [];

  try {
    // Fetch context
    [portfolio, goals] = await Promise.all([
      Portfolio.findOne({ userId: req.user }),
      Goal.find({ userId: req.user, status: 'active' }).limit(5),
    ]);
  } catch (err) {
    console.warn('[Insights] Context fetch failed:', err.message);
  }

  const goalsText = goals.length > 0
    ? goals.map(g => `${g.title} (₹${(g.financial?.currentAmount || 0).toFixed(0)}/₹${(g.financial?.targetAmount || 0).toFixed(0)})`).join(', ')
    : 'None';

  const riskProfile = portfolio?.riskProfile || 'moderate';
  const totalInvested = portfolio?.summary?.totalInvested || 0;
  const currentValue = portfolio?.summary?.currentValue || 0;
  const returnPercentage = portfolio?.summary?.returnPercentage || 0;

  const systemPrompt = `You are Gullak AI - a friendly, intelligent personal finance coach for Gen-Z Indians.
The user has a ${riskProfile} risk profile.
Portfolio: Invested Rs ${totalInvested.toFixed(2)}, Current Value Rs ${currentValue.toFixed(2)}, Returns ${returnPercentage.toFixed(1)}%.
Savings goals: ${goalsText}.
Core product: round-up micro-investing (every spend rounded up to Rs 10, spare change invested in Nifty Index Funds or Digital Gold).
Be concise (max 3-4 sentences), encouraging, use INR, avoid jargon, suggest actionable next steps.
Use emojis sparingly. Never mention OpenAI or GPT.`;

  const fullPrompt = `${systemPrompt}\n\nUser: {message}\nGullak AI:`;
  const startTime = Date.now();

  try {
    const aiText = await callGemini(fullPrompt);
    const latencyMs = Date.now() - startTime;

    // Build dynamic suggestions
    const suggestions = ['Show my portfolio'];
    const msgLower = message.toLowerCase();
    if (msgLower.includes('goal')) {
      suggestions.push('Am I on track for my goals?');
    } else if (msgLower.includes('round') || msgLower.includes('sms')) {
      suggestions.push('See my pending round-ups');
    } else {
      suggestions.push('How do round-ups work?');
    }

    // Save user message
    await ChatMessage.create({
      userId: req.user,
      sessionId: sessionId || `session_${req.user}_${Date.now()}`,
      role: 'user',
      content: message,
      portfolioSnapshot: { totalInvested, currentValue, riskProfile },
    });

    // Save AI message
    const saved = await ChatMessage.create({
      userId: req.user,
      sessionId: sessionId || `session_${req.user}_${Date.now()}`,
      role: 'assistant',
      content: aiText,
      agentUsed: `Gemini (${process.env.GEMINI_MODEL || 'gemini-3.7-flash'})`,
      suggestedActions: suggestions,
      metadata: { latencyMs },
    });

    res.json({
      success: true,
      data: {
        response: aiText,
        agentUsed: saved.agentUsed,
        suggestedActions: suggestions,
        messageId: saved._id,
        latencyMs,
      }
    });

  } catch (err) {
    console.error('[Insights] Gemini call failed:', err.message);
    const fallback = getRuleBasedFallback(message);
    res.json({
      success: true,
      data: {
        response: fallback.response,
        agentUsed: 'Rule-Based Fallback (server)',
        suggestedActions: fallback.suggested,
        latencyMs: 0,
      }
    });
  }
});

// ---------------------------------------------------------------------------
// POST /api/insights/spending-analysis
// ---------------------------------------------------------------------------
router.post('/spending-analysis', auth, async (req, res) => {
  const { transactions } = req.body;
  if (!transactions || transactions.length === 0) {
    return res.json({
      success: true,
      data: {
        insights: "No transaction data available yet. Keep using the app and I'll analyse your spending patterns! 📊",
        totalSpent: 0,
        topMerchant: null,
        topMerchantAmount: 0,
        topCategory: null,
        transactionCount: 0,
      }
    });
  }

  let totalSpent = 0;
  const merchantTotals = {};
  const categoryTotals = {};

  transactions.forEach(t => {
    totalSpent += t.amount;
    merchantTotals[t.merchant] = (merchantTotals[t.merchant] || 0) + t.amount;
    const cat = t.category || 'other';
    categoryTotals[cat] = (categoryTotals[cat] || 0) + t.amount;
  });

  const topMerchant = Object.keys(merchantTotals).reduce((a, b) => merchantTotals[a] > merchantTotals[b] ? a : b, null);
  const topCategory = Object.keys(categoryTotals).reduce((a, b) => categoryTotals[a] > categoryTotals[b] ? a : b, null);
  const topMerchantAmount = topMerchant ? merchantTotals[topMerchant] : 0;

  let portfolio = null;
  try {
    portfolio = await Portfolio.findOne({ userId: req.user });
  } catch (err) {
    console.warn('[Insights] Failed to fetch portfolio for spending analysis:', err.message);
  }
  const riskProfile = portfolio?.riskProfile || 'moderate';

  const prompt = `A user spent Rs ${totalSpent.toFixed(0)} across ${transactions.length} transactions this month.
Top merchant: ${topMerchant || 'unknown'} (Rs ${topMerchantAmount.toFixed(0)}).
Top category: ${topCategory || 'other'}.
Risk profile: ${riskProfile}.
In 2 short sentences max: give one specific saving tip and one encouraging micro-investment insight.
Use Rs currency. Be friendly and Gen-Z appropriate.`;

  try {
    const insightText = await callGemini(prompt, 200);
    res.json({
      success: true,
      data: {
        insights: insightText,
        totalSpent,
        topMerchant,
        topMerchantAmount,
        topCategory,
        transactionCount: transactions.length,
      }
    });
  } catch (err) {
    console.error('[Insights] Gemini spending analysis failed:', err.message);
    const fallbackInsight = `You spent Rs ${totalSpent.toFixed(0)} this month. Your biggest expense was ${topMerchant || 'unknown'} — try cutting 10% there to boost your investment vault! 💡`;
    res.json({
      success: true,
      data: {
        insights: fallbackInsight,
        totalSpent,
        topMerchant,
        topMerchantAmount,
        topCategory,
        transactionCount: transactions.length,
      }
    });
  }
});

// ---------------------------------------------------------------------------
// GET /api/insights/history
// ---------------------------------------------------------------------------
router.get('/history', auth, async (req, res) => {
  const { page = 1, limit = 50, sessionId } = req.query;
  const query = { userId: req.user };
  if (sessionId) query.sessionId = sessionId;

  try {
    const messages = await ChatMessage.find(query)
      .sort({ createdAt: 1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ---------------------------------------------------------------------------
// GET /api/insights/weekly
// ---------------------------------------------------------------------------
router.get('/weekly', auth, async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user });
    const totalInvested = portfolio?.summary?.totalInvested || 0;
    const currentValue = portfolio?.summary?.currentValue || 0;
    const returns = currentValue - totalInvested;

    res.json({
      success: true,
      data: {
        summary: totalInvested > 0
          ? `Great week! Your portfolio grew by ₹${Math.abs(returns).toFixed(0)}. Keep up the micro-savings habit! 🎉`
          : `Start your investment journey today! Even ₹10 in spare change adds up. 🚀`,
        tips: [
          'Enable Auto Round-up to save ₹5-15 daily without thinking',
          'Your Index Fund allocation beats inflation by 4-8% annually',
          'Set a goal to stay motivated and track your progress',
        ],
        weeklyGoal: 500,
        weeklyAchieved: Math.min(totalInvested, 500),
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

function getRuleBasedFallback(message) {
  const q = (message || '').toLowerCase();
  if (q.includes('invest') || q.includes('portfolio')) {
    return { response: '📈 Based on your moderate risk profile, I suggest 60% in Nifty Index Funds, 30% in Digital Gold, and 10% in Bonds. Start with ₹500 and let compounding do the rest!', suggested: ['Show my portfolio', 'Set up SIP'] };
  }
  if (q.includes('goal')) {
    return { response: '🎯 Goals are the secret to disciplined saving! Create a goal, set a target date, and let Gullak auto-contribute spare change towards it every day.', suggested: ['Create a goal', 'See my goals'] };
  }
  return { response: '💡 I am here to help you build wealth with micro-savings and smart investing. Ask me anything about your portfolio, goals, or financial concepts!', suggested: ['How do round-ups work?', 'Explain Digital Gold'] };
}

module.exports = router;
