const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');

// @route    GET api/goals
// @desc     Get all goals of logged-in user
// @access   Private
router.get('/', auth, async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user, status: { $ne: 'cancelled' } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: goals });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Error fetching goals' } });
  }
});

// @route    POST api/goals
// @desc     Create a new goal
// @access   Private
router.post('/', auth, async (req, res) => {
  const { title, description, targetAmount, targetDate, category, emoji, color, autoContribute } = req.body;

  if (!title || !targetAmount || !targetDate) {
    return res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Title, target amount, and target date are required' }
    });
  }

  try {
    // Generate initial milestones (33%, 66%, 100%)
    const milestones = [
      { amount: Math.floor(targetAmount * 0.33), percentage: 33, reached: false },
      { amount: Math.floor(targetAmount * 0.66), percentage: 66, reached: false },
      { amount: targetAmount, percentage: 100, reached: false }
    ];

    const newGoal = new Goal({
      userId: req.user,
      title,
      description,
      emoji: emoji || '🎯',
      color: color || '#6C63FF',
      financial: {
        targetAmount,
        currentAmount: 0,
        suggestedContribution: Math.ceil(targetAmount / 12) // Default linear monthly amount
      },
      timeline: {
        targetDate: new Date(targetDate)
      },
      category: category || 'custom',
      milestones,
      automation: {
        autoContribute: autoContribute?.enabled || false,
        amount: autoContribute?.amount || 0,
        frequency: autoContribute?.frequency || 'weekly'
      }
    });

    const goal = await newGoal.save();
    res.status(200).json({ success: true, data: goal });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Error creating goal' } });
  }
});

// @route    POST api/goals/:id/contribute
// @desc     Directly contribute to a goal (if not utilizing Razorpay manual invest router)
// @access   Private
router.post('/:id/contribute', auth, async (req, res) => {
  const { amount } = req.body;

  if (!amount || amount <= 0) {
    return res.status(400).json({ success: false, error: { code: 'INVALID_AMOUNT', message: 'Contribution amount must be positive' } });
  }

  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user });
    if (!goal) {
      return res.status(404).json({ success: false, error: { code: 'GOAL_NOT_FOUND', message: 'Goal not found' } });
    }

    goal.financial.currentAmount += amount;
    goal.analytics.contributionCount += 1;

    // Check milestones
    goal.milestones.forEach(m => {
      if (!m.reached && goal.financial.currentAmount >= m.amount) {
        m.reached = true;
        m.reachedAt = Date.now();
      }
    });

    if (goal.financial.currentAmount >= goal.financial.targetAmount) {
      goal.status = 'completed';
      goal.actualCompletionDate = Date.now();
    }

    await goal.save();
    res.status(200).json({ success: true, data: goal });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Error adding contribution' } });
  }
});

// @route    DELETE api/goals/:id
// @desc     Soft delete/cancel a goal
// @access   Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findOne({ _id: req.params.id, userId: req.user });
    if (!goal) {
      return res.status(404).json({ success: false, error: { code: 'GOAL_NOT_FOUND', message: 'Goal not found' } });
    }

    goal.status = 'cancelled';
    await goal.save();
    res.status(200).json({ success: true, message: 'Goal removed successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message: 'Error removing goal' } });
  }
});

module.exports = router;
