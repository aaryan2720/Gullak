const mongoose = require('mongoose');

const MilestoneSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  percentage: { type: Number, required: true },
  reached: { type: Boolean, default: false },
  reachedAt: { type: Date },
  reward: {
    type: { type: String, enum: ['badge', 'points', 'message'] },
    value: { type: mongoose.Schema.Types.Mixed }
  }
});

const GoalSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  emoji: { type: String, default: '🎯' },
  color: { type: String, default: '#6C63FF' },
  financial: {
    targetAmount: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    contributionFrequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
    suggestedContribution: { type: Number, default: 0 }
  },
  timeline: {
    startDate: { type: Date, default: Date.now },
    targetDate: { type: Date, required: true },
    expectedCompletionDate: { type: Date },
    actualCompletionDate: { type: Date }
  },
  category: {
    type: String,
    enum: ['gadgets', 'travel', 'education', 'emergency', 'custom'],
    default: 'custom'
  },
  priority: { type: String, enum: ['high', 'medium', 'low'], default: 'medium' },
  milestones: [MilestoneSchema],
  social: {
    isShared: { type: Boolean, default: false },
    visibility: { type: String, enum: ['private', 'friends', 'public'], default: 'private' },
    members: [{
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      role: { type: String, enum: ['owner', 'contributor'], default: 'contributor' },
      contribution: { type: Number, default: 0 },
      joinedAt: { type: Date, default: Date.now }
    }],
    clubId: { type: mongoose.Schema.Types.ObjectId }
  },
  automation: {
    autoContribute: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'weekly' },
    lastContribution: { type: Date },
    nextContribution: { type: Date }
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'paused', 'cancelled'],
    default: 'active'
  },
  analytics: {
    averageContribution: { type: Number, default: 0 },
    contributionCount: { type: Number, default: 0 },
    daysActive: { type: Number, default: 0 },
    completionProbability: { type: Number, default: 0 },
    projectedCompletion: { type: Date }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Goal', GoalSchema);
