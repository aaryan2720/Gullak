const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['debit', 'credit', 'investment', 'withdrawal'], required: true },
  category: { type: String, enum: ['round_up', 'manual', 'auto_invest', 'goal_contribution'], required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  source: {
    type: { type: String, enum: ['bank', 'upi', 'wallet'], required: true },
    accountId: { type: mongoose.Schema.Types.ObjectId },
    transactionId: { type: String } // Gateway transaction ID (e.g. Razorpay payment ID)
  },
  destination: {
    type: { type: String, enum: ['investment_wallet', 'bank', 'goal'] },
    accountId: { type: mongoose.Schema.Types.ObjectId },
    goalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }
  },
  investment: {
    isInvestment: { type: Boolean, default: false },
    allocation: {
      indexFunds: { type: Number, default: 0 },
      digitalGold: { type: Number, default: 0 },
      bonds: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    units: [{
      instrumentType: { type: String, enum: ['index_fund', 'gold', 'bond'] },
      instrumentId: { type: String },
      units: { type: Number },
      pricePerUnit: { type: Number },
      totalValue: { type: Number }
    }]
  },
  roundUp: {
    isRoundUp: { type: Boolean, default: false },
    originalAmount: { type: Number },
    roundedAmount: { type: Number },
    difference: { type: Number }
  },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'failed', 'reversed'], default: 'pending' },
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    reason: { type: String }
  }],
  fees: {
    platformFee: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    gatewayFee: { type: Number, default: 0 },
    total: { type: Number, default: 0 }
  },
  blockchainReceipt: {
    txHash: { type: String },
    blockNumber: { type: Number },
    verified: { type: Boolean, default: false }
  },
  metadata: {
    description: { type: String },
    merchantName: { type: String },
    merchantCategory: { type: String },
    location: { type: String },
    notes: { type: String }
  },
  completedAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', TransactionSchema);
