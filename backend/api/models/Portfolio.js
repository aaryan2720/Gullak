const mongoose = require('mongoose');

const HoldingSchema = new mongoose.Schema({
  instrumentType: { type: String, enum: ['index_fund', 'etf', 'digital_gold', 'bond'], required: true },
  instrumentId: { type: String, required: true },
  instrumentName: { type: String, required: true },
  isin: { type: String },
  units: { type: Number, default: 0 },
  averageBuyPrice: { type: Number, default: 0 },
  currentPrice: { type: Number, default: 0 },
  investedAmount: { type: Number, default: 0 },
  currentValue: { type: Number, default: 0 },
  returns: { type: Number, default: 0 },
  returnPercentage: { type: Number, default: 0 },
  allocation: { type: Number, default: 0 },
  transactions: [{
    transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
    type: { type: String, enum: ['buy', 'sell'] },
    units: { type: Number },
    price: { type: Number },
    amount: { type: Number },
    date: { type: Date, default: Date.now }
  }],
  firstBoughtAt: { type: Date },
  lastUpdated: { type: Date, default: Date.now }
});

const PortfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  summary: {
    totalInvested: { type: Number, default: 0 },
    currentValue: { type: Number, default: 0 },
    totalReturns: { type: Number, default: 0 },
    returnPercentage: { type: Number, default: 0 },
    xirr: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now }
  },
  holdings: [HoldingSchema],
  assetAllocation: {
    equity: { type: Number, default: 0 },
    debt: { type: Number, default: 0 },
    gold: { type: Number, default: 0 },
    other: { type: Number, default: 0 }
  },
  riskMetrics: {
    volatility: { type: Number, default: 0 },
    sharpeRatio: { type: Number, default: 0 },
    maxDrawdown: { type: Number, default: 0 },
    beta: { type: Number, default: 0 }
  },
  performance: [{
    date: { type: Date, default: Date.now },
    value: { type: Number },
    returns: { type: Number }
  }],
  rebalancing: {
    lastRebalanced: { type: Date },
    nextRebalance: { type: Date },
    frequency: { type: String, enum: ['monthly', 'quarterly'], default: 'monthly' },
    autoRebalance: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
