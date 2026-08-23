const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const BlockchainEvent = require('../models/BlockchainEvent');

// @route    GET /api/users/me
// @desc     Get current user's full profile
// @access   Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-passwordHash');
    if (!user) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// @route    PATCH /api/users/profile
// @desc     Update user profile (name, avatar, preferences)
// @access   Private
router.patch('/profile', auth, async (req, res) => {
  const { name, avatar, riskProfile, preferences } = req.body;
  const updateFields = {};
  if (name) updateFields['personalInfo.name'] = name;
  if (avatar) updateFields['personalInfo.avatar'] = avatar;
  if (riskProfile) updateFields['investmentPreferences.riskProfile'] = riskProfile;
  if (preferences) updateFields['preferences'] = preferences;

  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { $set: updateFields },
      { new: true, select: '-passwordHash' }
    );
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// @route    GET /api/users/stats
// @desc     Get user stats: XP, level, streaks, badges
// @access   Private
router.get('/stats', auth, async (req, res) => {
  try {
    const [user, txCount, portfolio] = await Promise.all([
      User.findById(req.user).select('gamification referral'),
      Transaction.countDocuments({ userId: req.user, status: 'completed' }),
      Portfolio.findOne({ userId: req.user }),
    ]);

    const totalInvested = portfolio?.summary?.totalInvested || 0;

    // Calculate level from XP
    const xp = user?.gamification?.totalXP || 0;
    const level = Math.floor(xp / 100) + 1;

    res.json({
      success: true,
      data: {
        xp,
        level,
        streak: user?.gamification?.currentStreak || 0,
        longestStreak: user?.gamification?.longestStreak || 0,
        badges: user?.gamification?.badges || [],
        totalTransactions: txCount,
        totalInvested,
        nextLevelXp: level * 100,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// @route    GET /api/users/referral
// @desc     Get referral info and list of referred users
// @access   Private
router.get('/referral', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('referral personalInfo.name');
    const referredCount = await User.countDocuments({ 'referral.referredBy': user.referral?.code });
    res.json({
      success: true,
      data: {
        code: user.referral?.code,
        link: `https://gullak.app/join/${user.referral?.code}`,
        referredCount,
        rewardEarned: referredCount * 50, // ₹50 per referral
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// @route    GET /api/users/blockchain-audit
// @desc     Get user's blockchain audit trail
// @access   Private
router.get('/blockchain-audit', auth, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  try {
    const [events, total] = await Promise.all([
      BlockchainEvent.find({ userId: req.user })
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('transactionId', 'amount type category'),
      BlockchainEvent.countDocuments({ userId: req.user }),
    ]);

    res.json({
      success: true,
      data: {
        events,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

module.exports = router;
