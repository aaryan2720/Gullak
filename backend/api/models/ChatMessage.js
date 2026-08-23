const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  sessionId: { type: String, index: true }, // groups messages per conversation session
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  agentUsed: { type: String, default: 'rule-based' }, // 'gpt-4o', 'rule-based', etc.
  suggestedActions: [{ type: String }],
  portfolioSnapshot: { // context at time of message
    totalInvested: { type: Number },
    currentValue: { type: Number },
    riskProfile: { type: String },
  },
  metadata: {
    tokens: { type: Number },
    latencyMs: { type: Number },
  }
}, {
  timestamps: true
});

ChatMessageSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);
