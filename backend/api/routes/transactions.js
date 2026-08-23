const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');

// @route    GET /api/transactions
// @desc     Paginated transaction history with filtering
// @access   Private
router.get('/', auth, async (req, res) => {
  const { page = 1, limit = 20, type, category, status, startDate, endDate } = req.query;
  const query = { userId: req.user };

  if (type) query.type = type;
  if (category) query.category = category;
  if (status) query.status = status;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  try {
    const [transactions, total] = await Promise.all([
      Transaction.find(query)
        .sort({ createdAt: -1 })
        .skip((Number(page) - 1) * Number(limit))
        .limit(Number(limit))
        .populate('destination.goalId', 'title emoji color'),
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
          pages: Math.ceil(total / Number(limit)),
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// @route    GET /api/transactions/:id
// @desc     Get single transaction with blockchain receipt
// @access   Private
router.get('/:id', auth, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      userId: req.user
    }).populate('destination.goalId', 'title emoji color');

    if (!transaction) {
      return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Transaction not found' } });
    }

    res.json({ success: true, data: transaction });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

// @route    GET /api/transactions/summary/weekly
// @desc     Get weekly transaction summary for the home dashboard
// @access   Private
router.get('/summary/weekly', auth, async (req, res) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const [invested, roundUps, totalCount] = await Promise.all([
      Transaction.aggregate([
        { $match: { userId: req.user, type: 'investment', status: 'completed', createdAt: { $gte: weekAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Transaction.aggregate([
        { $match: { userId: req.user, category: 'round_up', status: 'completed', createdAt: { $gte: weekAgo } } },
        { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
      ]),
      Transaction.countDocuments({ userId: req.user, createdAt: { $gte: weekAgo } }),
    ]);

    res.json({
      success: true,
      data: {
        weeklyInvested: invested[0]?.total || 0,
        weeklyRoundUps: roundUps[0]?.total || 0,
        roundUpCount: roundUps[0]?.count || 0,
        totalTransactions: totalCount,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: err.message } });
  }
});

module.exports = router;
