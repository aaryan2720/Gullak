const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const RoundUp = require('../models/RoundUp');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { routeInvestment, getMarketPrices } = require('../services/investment');

// ---------------------------------------------------------------------------
// POST /api/roundups/sms-ingest
// Receive a parsed SMS transaction from the mobile app, compute round-up,
// and create a pending round-up record (idempotent via smsId hash).
// ---------------------------------------------------------------------------
router.post('/sms-ingest', auth, async (req, res) => {
  const { amount, merchant, upiRef, bankName, smsBody, smsTimestamp } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: { code: 'INVALID_AMOUNT', message: 'Amount must be a positive number' } });
  }

  // Round-up calculation
  const roundedAmount = Math.ceil(amount / 10) * 10;
  const roundUpDelta = roundedAmount - amount;

  // Skip if already a perfect multiple of 10 (₹0 delta)
  if (roundUpDelta === 0) {
    return res.json({ success: true, data: { skipped: true, reason: 'Amount is already a multiple of 10' } });
  }

  // Generate a unique smsId to prevent duplicate ingestion
  const smsId = crypto
    .createHash('sha256')
    .update(`${req.user}-${amount}-${upiRef || ''}-${smsTimestamp || Date.now()}`)
    .digest('hex')
    .substring(0, 32);

  try {
    // Upsert — idempotent on smsId
    const existing = await RoundUp.findOne({ smsId });
    if (existing) {
      return res.json({ success: true, data: { duplicate: true, roundUp: existing } });
    }

    const roundUp = await RoundUp.create({
      userId: req.user,
      smsId,
      originalAmount: amount,
      roundedAmount,
      roundUpDelta,
      merchant: merchant || 'Unknown Merchant',
      upiRef,
      bankName,
      smsBody,
      status: 'pending',
    });

    res.status(201).json({ success: true, data: { roundUp } });
  } catch (err) {
    if (err.code === 11000) {
      // Duplicate key — already exists
      return res.json({ success: true, data: { duplicate: true } });
    }
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ---------------------------------------------------------------------------
// GET /api/roundups/pending
// Fetch all pending round-ups for the user awaiting approval
// ---------------------------------------------------------------------------
router.get('/pending', auth, async (req, res) => {
  try {
    const pending = await RoundUp.find({ userId: req.user, status: 'pending' })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json({ success: true, data: { roundUps: pending, count: pending.length } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ---------------------------------------------------------------------------
// GET /api/roundups/vault
// Current accumulated vault balance + market prices for display
// ---------------------------------------------------------------------------
router.get('/vault', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user).select('preferences.roundUp');
    const vaultBalance = user?.preferences?.roundUp?.vaultBalance || 0;
    const threshold = user?.preferences?.roundUp?.threshold || 50;
    const preferredVehicle = user?.preferences?.roundUp?.preferredVehicle || 'auto';

    // Count approved (not yet invested) round-ups contributing to vault
    const [approvedAgg] = await RoundUp.aggregate([
      { $match: { userId: req.user, status: 'approved' } },
      { $group: { _id: null, total: { $sum: '$roundUpDelta' }, count: { $sum: 1 } } },
    ]);

    const prices = getMarketPrices();

    res.json({
      success: true,
      data: {
        vaultBalance,
        threshold,
        progress: Math.min((vaultBalance / threshold) * 100, 100),
        canInvest: vaultBalance >= threshold,
        preferredVehicle,
        approvedCount: approvedAgg?.count || 0,
        marketPrices: prices,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ---------------------------------------------------------------------------
// POST /api/roundups/:id/approve
// User approves a pending round-up — adds delta to vault balance
// ---------------------------------------------------------------------------
router.post('/:id/approve', auth, async (req, res) => {
  try {
    const roundUp = await RoundUp.findOne({ _id: req.params.id, userId: req.user, status: 'pending' });
    if (!roundUp) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Pending round-up not found' } });
    }

    // Mark as approved
    roundUp.status = 'approved';
    roundUp.actionAt = new Date();
    await roundUp.save();

    // Add delta to user's vault balance
    await User.updateOne(
      { _id: req.user },
      { $inc: { 'preferences.roundUp.vaultBalance': roundUp.roundUpDelta } }
    );

    // Fetch updated vault
    const user = await User.findById(req.user).select('preferences.roundUp');
    const vaultBalance = user?.preferences?.roundUp?.vaultBalance || 0;
    const threshold = user?.preferences?.roundUp?.threshold || 50;

    res.json({
      success: true,
      data: {
        roundUp,
        vault: {
          balance: vaultBalance,
          threshold,
          canInvest: vaultBalance >= threshold,
          progress: Math.min((vaultBalance / threshold) * 100, 100),
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ---------------------------------------------------------------------------
// POST /api/roundups/:id/skip
// User skips/dismisses a pending round-up
// ---------------------------------------------------------------------------
router.post('/:id/skip', auth, async (req, res) => {
  try {
    const roundUp = await RoundUp.findOneAndUpdate(
      { _id: req.params.id, userId: req.user, status: 'pending' },
      { status: 'skipped', actionAt: new Date() },
      { new: true }
    );
    if (!roundUp) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Pending round-up not found' } });
    }
    res.json({ success: true, data: { roundUp } });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ---------------------------------------------------------------------------
// POST /api/roundups/invest
// Trigger investment of accumulated vault balance
// Body: { vehicle: 'mutual_fund' | 'gold' | 'auto', goalId?: string }
// ---------------------------------------------------------------------------
router.post('/invest', auth, async (req, res) => {
  const { vehicle, goalId } = req.body;

  try {
    const user = await User.findById(req.user).select('preferences.roundUp');
    const vaultBalance = user?.preferences?.roundUp?.vaultBalance || 0;
    const threshold = user?.preferences?.roundUp?.threshold || 50;

    if (vaultBalance < threshold) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'BELOW_THRESHOLD',
          message: `Vault balance ₹${vaultBalance} is below threshold ₹${threshold}. Keep approving round-ups!`
        }
      });
    }

    const investVehicle = vehicle || user?.preferences?.roundUp?.preferredVehicle || 'auto';

    // Call investment service (stub / live API)
    const receipt = await routeInvestment(req.user, vaultBalance, investVehicle, goalId);

    if (!receipt.success) {
      return res.status(502).json({ success: false, error: { code: 'INVESTMENT_FAILED', message: 'Investment API failed' } });
    }

    // Create a Transaction record for this investment
    const tx = await Transaction.create({
      userId: req.user,
      type: 'investment',
      category: 'round_up',
      amount: vaultBalance,
      currency: 'INR',
      source: { type: 'wallet' },
      destination: {
        type: 'investment_wallet',
        goalId: goalId || undefined,
      },
      investment: {
        isInvestment: true,
        allocation: investVehicle === 'gold'
          ? { indexFunds: 0, digitalGold: 100, bonds: 0, other: 0 }
          : { indexFunds: 100, digitalGold: 0, bonds: 0, other: 0 },
      },
      roundUp: { isRoundUp: true },
      status: 'processing',
      metadata: {
        description: `Round-up vault investment — ${receipt.instrumentName}`,
        merchantName: receipt.provider || receipt.amc || 'Gullak Invest',
      },
      blockchainReceipt: {
        txHash: receipt.receiptHash,
        verified: false,
      },
    });

    // Mark all approved round-ups as invested
    await RoundUp.updateMany(
      { userId: req.user, status: 'approved' },
      { status: 'invested', investedVehicle: investVehicle, investedAt: new Date(), investmentTxId: tx._id }
    );

    // Reset vault balance
    await User.updateOne(
      { _id: req.user },
      { $set: { 'preferences.roundUp.vaultBalance': 0 } }
    );

    res.json({
      success: true,
      data: {
        transaction: tx,
        receipt,
        amountInvested: vaultBalance,
        vehicle: investVehicle,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// ---------------------------------------------------------------------------
// GET /api/roundups/history
// Past round-up history with optional status filter
// ---------------------------------------------------------------------------
router.get('/history', auth, async (req, res) => {
  const { status, page = 1, limit = 30 } = req.query;
  const query = { userId: req.user };
  if (status) query.status = status;

  try {
    const [roundUps, total] = await Promise.all([
      RoundUp.find(query)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit)),
      RoundUp.countDocuments(query),
    ]);

    // Stats
    const [stats] = await RoundUp.aggregate([
      { $match: { userId: req.user } },
      { $group: {
        _id: null,
        totalSaved: { $sum: { $cond: [{ $in: ['$status', ['approved', 'invested']] }, '$roundUpDelta', 0] } },
        totalInvested: { $sum: { $cond: [{ $eq: ['$status', 'invested'] }, '$roundUpDelta', 0] } },
        totalRoundUps: { $sum: 1 },
        approvedCount: { $sum: { $cond: [{ $eq: ['$status', 'approved'] }, 1, 0] } },
      }}
    ]);

    res.json({
      success: true,
      data: {
        roundUps,
        pagination: { page: Number(page), limit: Number(limit), total, pages: Math.ceil(total / Number(limit)) },
        stats: stats || { totalSaved: 0, totalInvested: 0, totalRoundUps: 0, approvedCount: 0 },
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

module.exports = router;
