const mongoose = require('mongoose');

const RoundUpSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  // Unique hash to prevent duplicate SMS ingestion
  smsId: { type: String, required: true, unique: true },

  // Original transaction
  originalAmount: { type: Number, required: true },
  roundedAmount:  { type: Number, required: true },
  roundUpDelta:   { type: Number, required: true }, // = roundedAmount - originalAmount

  // Merchant info extracted from SMS
  merchant:    { type: String, default: 'Unknown Merchant' },
  upiRef:      { type: String },
  bankName:    { type: String },
  smsBody:     { type: String }, // raw SMS for debugging

  // Lifecycle
  status: {
    type: String,
    enum: ['pending', 'approved', 'skipped', 'invested'],
    default: 'pending',
  },

  // Set when status = 'invested'
  investedVehicle:  { type: String, enum: ['mutual_fund', 'gold', null], default: null },
  investedAt:       { type: Date },
  investmentTxId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },

  // When user approved/skipped
  actionAt: { type: Date },
}, {
  timestamps: true,
});

// Index for fast queries
RoundUpSchema.index({ userId: 1, status: 1, createdAt: -1 });
RoundUpSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('RoundUp', RoundUpSchema);
