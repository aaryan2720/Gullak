const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const axios = require('axios');
const ChatMessage = require('../models/ChatMessage');
const Portfolio = require('../models/Portfolio');
const Goal = require('../models/Goal');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// @route    POST /api/insights/chat
// @desc     Send message to AI Coach and persist conversation
// @access   Private
router.post('/chat', auth, async (req, res) => {
  const { message, sessionId } = req.body;
  if (!message?.trim()) {
    return res.status(400).json({ success: false, error: { code: 'EMPTY_MESSAGE', message: 'Message cannot be empty' } });
  }

  try {
    // Fetch user context for AI
    const [portfolio, goals] = await Promise.all([
      Portfolio.findOne({ userId: req.user }),
      Goal.find({ userId: req.user, status: 'active' }).limit(5),
    ]);

    const startTime = Date.now();

    // Call FastAPI AI service
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/api/ai/chat`, {
      message,
      userId: req.user.toString(),
      riskProfile: portfolio?.riskProfile || 'moderate',
      portfolio: portfolio ? {
        totalInvested: portfolio.summary.totalInvested,
        currentValue: portfolio.summary.currentValue,
        totalReturns: portfolio.summary.totalReturns,
        returnPercentage: portfolio.summary.returnPercentage,
      } : null,
      goals: goals.map(g => ({
        title: g.title,
        targetAmount: g.financial.targetAmount,
        currentAmount: g.financial.currentAmount,
        targetDate: g.targetDate,
      })),
    }, { timeout: 10000 });

    const latencyMs = Date.now() - startTime;
    const aiData = aiResponse.data;

    // Save user message
    await ChatMessage.create({
      userId: req.user,
      sessionId: sessionId || `session_${req.user}_${Date.now()}`,
      role: 'user',
      content: message,
      portfolioSnapshot: {
        totalInvested: portfolio?.summary?.totalInvested || 0,
        currentValue: portfolio?.summary?.currentValue || 0,
        riskProfile: portfolio?.riskProfile || 'moderate',
      },
    });

    // Save AI response
    const saved = await ChatMessage.create({
      userId: req.user,
      sessionId: sessionId || `session_${req.user}_${Date.now()}`,
      role: 'assistant',
      content: aiData.response,
      agentUsed: aiData.agentUsed || 'unknown',
      suggestedActions: aiData.suggestedActions || [],
      metadata: { latencyMs },
    });

    res.json({
      success: true,
      data: {
        response: aiData.response,
        agentUsed: aiData.agentUsed,
        suggestedActions: aiData.suggestedActions || [],
        messageId: saved._id,
        latencyMs,
      }
    });
  } catch (err) {
    console.error('[Insights] AI chat error:', err.message);

    // Return rule-based fallback even when AI service is down
    const fallback = getRuleBasedFallback(req.body.message);
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

// @route    GET /api/insights/history
// @desc     Get AI chat history for user
// @access   Private
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

// @route    GET /api/insights/weekly
// @desc     Get AI-generated weekly financial summary
// @access   Private
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
