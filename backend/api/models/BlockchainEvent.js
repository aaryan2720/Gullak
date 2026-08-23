const mongoose = require('mongoose');

const BlockchainEventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', index: true },
  txHash: { type: String, required: true, unique: true, index: true },
  blockNumber: { type: Number, required: true, index: true },
  blockHash: { type: String },
  contractAddress: { type: String, required: true },
  action: { type: String, required: true }, // 'investment', 'goal_contribution', 'round_up'
  amount: { type: Number, required: true },
  gasUsed: { type: Number },
  from: { type: String }, // wallet address that signed
  network: { type: String, default: 'polygon_mumbai' },
  verified: { type: Boolean, default: false },
  explorerUrl: { type: String }, // e.g. https://mumbai.polygonscan.com/tx/0x...
  rawLog: { type: mongoose.Schema.Types.Mixed }, // full event log for debugging
}, {
  timestamps: true
});

// Compound index for efficient user audit trail queries
BlockchainEventSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('BlockchainEvent', BlockchainEventSchema);
