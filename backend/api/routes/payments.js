const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const Goal = require('../models/Goal');
const BlockchainEvent = require('../models/BlockchainEvent');
const { logToPolygonLedger } = require('../services/blockchain');

let Razorpay;
try {
  Razorpay = require('razorpay');
} catch (e) {
  console.warn('[Payments] Razorpay package not found. Payment creation will use mock mode.');
}

const getRazorpayInstance = () => {
  if (!Razorpay || !process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// @route    POST /api/payments/create-order
// @desc     Create a Razorpay order server-side (required for payment verification)
// @access   Private
router.post('/create-order', auth, async (req, res) => {
  const { amount, currency = 'INR', notes = {} } = req.body;

  if (!amount || amount < 1) {
    return res.status(400).json({ success: false, error: { code: 'INVALID_AMOUNT', message: 'Amount must be at least ₹1' } });
  }

  const razorpay = getRazorpayInstance();

  if (!razorpay) {
    // Mock mode for development without real Razorpay keys
    const mockOrderId = 'order_mock_' + Math.random().toString(36).substring(2, 14).toUpperCase();
    console.log(`[Payments] Mock mode: Generated order ${mockOrderId} for ₹${amount}`);
    return res.json({
      success: true,
      data: {
        orderId: mockOrderId,
        amount: amount * 100,
        currency,
        keyId: 'rzp_test_mock',
        isMock: true,
      }
    });
  }

  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Razorpay uses paise
      currency,
      receipt: `gullak_${req.user}_${Date.now()}`,
      notes: {
        userId: req.user.toString(),
        ...notes,
      },
    });

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
        isMock: false,
      }
    });
  } catch (err) {
    console.error('[Payments] Razorpay order creation failed:', err.message);
    res.status(500).json({ success: false, error: { code: 'ORDER_FAILED', message: err.message } });
  }
});

// @route    POST /api/payments/verify
// @desc     Verify Razorpay payment signature (HMAC-SHA256) and complete transaction
// @access   Private
router.post('/verify', auth, async (req, res) => {
  const {
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    amount,
    goalId,
    allocation,
    isMock,
  } = req.body;

  // Verify HMAC-SHA256 signature (only for real payments)
  if (!isMock) {
    const body = razorpayOrderId + '|' + razorpayPaymentId;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body)
      .digest('hex');

    if (expectedSignature !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_SIGNATURE', message: 'Payment verification failed. Signature mismatch.' }
      });
    }
  }

  try {
    // 1. Log initial transaction as processing
    const transaction = new Transaction({
      userId: req.user,
      type: 'investment',
      category: goalId ? 'goal_contribution' : 'manual',
      amount,
      source: {
        type: 'upi',
        transactionId: razorpayPaymentId,
      },
      destination: {
        type: goalId ? 'goal' : 'investment_wallet',
        goalId: goalId || undefined,
      },
      investment: {
        isInvestment: true,
        allocation: allocation || { indexFunds: 60, digitalGold: 30, bonds: 10 },
      },
      status: 'processing',
      statusHistory: [{ status: 'processing', reason: 'Payment verified' }],
    });
    await transaction.save();

    // 2. Write to Polygon blockchain ledger
    const blockchainResult = await logToPolygonLedger(
      req.user.toString(),
      transaction._id.toString(),
      goalId ? 'goal_contribution' : 'investment',
      amount
    );

    // 3. Update transaction with blockchain receipt
    transaction.blockchainReceipt = blockchainResult;
    transaction.status = 'completed';
    transaction.completedAt = new Date();
    transaction.statusHistory.push({ status: 'completed', reason: 'Blockchain confirmed' });
    await transaction.save();

    // 4. Save blockchain event to indexed collection
    if (blockchainResult.txHash) {
      const event = new BlockchainEvent({
        userId: req.user,
        transactionId: transaction._id,
        txHash: blockchainResult.txHash,
        blockNumber: blockchainResult.blockNumber,
        contractAddress: process.env.GULLAK_LEDGER_ADDRESS || '0x0000',
        action: goalId ? 'goal_contribution' : 'investment',
        amount,
        verified: blockchainResult.verified,
        network: 'polygon_mumbai',
        explorerUrl: `https://mumbai.polygonscan.com/tx/${blockchainResult.txHash}`,
      });
      await event.save();
    }

    // 5. Update portfolio summary
    let portfolio = await Portfolio.findOne({ userId: req.user });
    if (!portfolio) {
      portfolio = new Portfolio({ userId: req.user });
    }
    portfolio.summary.totalInvested = (portfolio.summary.totalInvested || 0) + amount;
    portfolio.summary.currentValue = portfolio.summary.totalInvested * 1.05;
    portfolio.summary.totalReturns = portfolio.summary.currentValue - portfolio.summary.totalInvested;
    portfolio.summary.returnPercentage = 5.0;
    await portfolio.save();

    // 6. Update goal if applicable
    if (goalId) {
      await Goal.findByIdAndUpdate(goalId, {
        $inc: { 'financial.currentAmount': amount }
      });
    }

    res.json({
      success: true,
      data: {
        transactionId: transaction._id,
        razorpayPaymentId,
        amount,
        blockchainReceipt: blockchainResult,
        status: 'completed',
      }
    });
  } catch (err) {
    console.error('[Payments] verify error:', err);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// @route    POST /api/payments/webhook
// @desc     Razorpay webhook endpoint (for server-side payment event notifications)
// @access   Public (but verified via Razorpay-Signature header)
router.post('/webhook', express.raw({ type: 'application/json' }), (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET;

  if (secret) {
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(req.body)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }
  }

  const event = JSON.parse(req.body.toString());
  console.log('[Webhook] Razorpay event received:', event.event);

  // Handle payment.captured event
  if (event.event === 'payment.captured') {
    const payment = event.payload.payment.entity;
    console.log(`[Webhook] Payment captured: ${payment.id} ₹${payment.amount / 100}`);
    // Additional processing can be done here if needed
  }

  res.json({ received: true });
});

// @route    GET /api/payments/history
// @desc     Get paginated payment history for user
// @access   Private
router.get('/history', auth, async (req, res) => {
  const { page = 1, limit = 20, type, status } = req.query;
  const query = { userId: req.user };
  if (type) query.type = type;
  if (status) query.status = status;

  try {
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .populate('destination.goalId', 'title emoji'),
      Transaction.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / limit),
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

module.exports = router;
