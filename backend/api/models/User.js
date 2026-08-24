const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  personalInfo: {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    avatar: { type: String }
  },
  auth: {
    passwordHash: { type: String, required: true },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    twoFactorEnabled: { type: Boolean, default: false },
    biometricEnabled: { type: Boolean, default: false }
  },
  kyc: {
    status: { type: String, enum: ['pending', 'submitted', 'verified', 'rejected'], default: 'pending' },
    aadharNumber: { type: String }, // Encrypted
    panNumber: { type: String },    // Encrypted
    verifiedAt: { type: Date },
    verifiedBy: { type: String }
  },
  preferences: {
    riskProfile: { type: String, enum: ['conservative', 'moderate', 'aggressive'], default: 'moderate' },
    investmentStyle: { type: String, enum: ['passive', 'active', 'balanced'], default: 'balanced' },
    autoInvest: {
      enabled: { type: Boolean, default: false },
      frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'monthly' },
      amount: { type: Number, default: 100 }
    },
    roundUp: {
      enabled: { type: Boolean, default: false },
      roundUpTo: { type: Number, default: 10 },          // always 10 for now
      maxPerTransaction: { type: Number, default: 50 },
      threshold: { type: Number, default: 50 },           // accumulate until this amount before investing
      preferredVehicle: { type: String, enum: ['mutual_fund', 'gold', 'auto'], default: 'auto' },
      smsParsingEnabled: { type: Boolean, default: false },
      vaultBalance: { type: Number, default: 0 },         // accumulated but not yet invested
    },
    notifications: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: false },
      frequency: { type: String, enum: ['instant', 'daily', 'weekly'], default: 'instant' }
    },
    theme: { type: String, enum: ['light', 'dark', 'auto'], default: 'auto' },
    language: { type: String, enum: ['en', 'hi'], default: 'en' }
  },
  subscription: {
    plan: { type: String, enum: ['free', 'premium'], default: 'free' },
    validUntil: { type: Date },
    autoRenew: { type: Boolean, default: false },
    paymentMethod: { type: String }
  },
  referral: {
    code: { type: String, unique: true },
    referredBy: { type: String },
    referrals: [{ type: String }],
    rewardPoints: { type: Number, default: 0 }
  },
  stats: {
    totalInvested: { type: Number, default: 0 },
    currentValue: { type: Number, default: 0 },
    totalReturns: { type: Number, default: 0 },
    streakDays: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    goalsCompleted: { type: Number, default: 0 },
    lessonsCompleted: { type: Number, default: 0 },
    badgesEarned: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', UserSchema);
