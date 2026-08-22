# 🔧 Gullak Backend Requirements & Implementation Guide

## 📋 Overview
This document outlines detailed backend requirements, API specifications, database schemas, and integration guidelines for the Gullak micro-investing platform.

---

## 🏗️ System Architecture

```
┌─────────────────┐
│  Mobile App     │
│  (React Native) │
└────────┬────────┘
         │
         ↓
┌─────────────────┐
│   API Gateway   │
│   (Rate Limit,  │
│   Auth, CORS)   │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
┌─────────┐ ┌──────────────┐
│ Node.js │ │  Python AI   │
│ Express │ │  Service     │
│ Server  │ │  (FastAPI)   │
└────┬────┘ └──────┬───────┘
     │             │
     ↓             ↓
┌─────────────────────┐
│   MongoDB Atlas     │
│   (Primary DB)      │
└─────────────────────┘
     │
     ↓
┌─────────────────────┐
│   Redis Cache       │
│   (Session, Temp)   │
└─────────────────────┘
     │
    ┌┴──────────────────┐
    ↓                   ↓
┌─────────┐      ┌─────────────┐
│ Payment │      │ Investment  │
│ APIs    │      │ APIs        │
│(Razorpay)│     │(Groww/Zerodha)│
└─────────┘      └─────────────┘
```

---

## 🗄️ Database Design

### 1. Users Collection
```javascript
{
  _id: ObjectId("..."),
  personalInfo: {
    name: String,              // "Rahul Sharma"
    email: String,             // "rahul@example.com"
    phone: String,             // "+919876543210"
    dateOfBirth: Date,         // 2000-05-15
    gender: String,            // "male" | "female" | "other"
    avatar: String             // URL to profile picture
  },
  auth: {
    passwordHash: String,
    salt: String,
    lastLogin: Date,
    loginAttempts: Number,
    isLocked: Boolean,
    twoFactorEnabled: Boolean,
    biometricEnabled: Boolean
  },
  kyc: {
    status: String,            // "pending" | "submitted" | "verified" | "rejected"
    aadharNumber: String,      // Encrypted
    panNumber: String,         // Encrypted
    documents: [{
      type: String,            // "aadhar_front", "pan", etc.
      url: String,
      uploadedAt: Date,
      verified: Boolean
    }],
    verifiedAt: Date,
    verifiedBy: String
  },
  preferences: {
    riskProfile: String,       // "conservative" | "moderate" | "aggressive"
    investmentStyle: String,   // "passive" | "active" | "balanced"
    autoInvest: {
      enabled: Boolean,
      frequency: String,       // "daily" | "weekly" | "monthly"
      amount: Number
    },
    roundUp: {
      enabled: Boolean,
      roundUpTo: Number,       // 5, 10, 20, 50
      maxPerTransaction: Number
    },
    notifications: {
      push: Boolean,
      email: Boolean,
      sms: Boolean,
      frequency: String        // "instant" | "daily" | "weekly"
    },
    theme: String,             // "light" | "dark" | "auto"
    language: String           // "en" | "hi"
  },
  subscription: {
    plan: String,              // "free" | "premium"
    validUntil: Date,
    autoRenew: Boolean,
    paymentMethod: String
  },
  referral: {
    code: String,              // Unique referral code
    referredBy: String,        // User ID who referred
    referrals: [String],       // Array of user IDs referred
    rewardPoints: Number
  },
  stats: {
    totalInvested: Number,
    currentValue: Number,
    totalReturns: Number,
    streakDays: Number,
    longestStreak: Number,
    goalsCompleted: Number,
    lessonsCompleted: Number,
    badgesEarned: Number
  },
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date            // Soft delete
}

// Indexes
db.users.createIndex({ "personalInfo.email": 1 }, { unique: true })
db.users.createIndex({ "personalInfo.phone": 1 }, { unique: true })
db.users.createIndex({ "referral.code": 1 }, { unique: true })
db.users.createIndex({ "kyc.panNumber": 1 })
```

### 2. LinkedAccounts Collection
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  accountType: String,         // "bank" | "upi" | "wallet"
  provider: {
    name: String,              // "HDFC Bank", "Google Pay", etc.
    code: String,              // "HDFC", "GPAY"
    logo: String               // URL to logo
  },
  bankDetails: {
    accountNumber: String,     // Encrypted, last 4 visible
    ifscCode: String,
    accountHolderName: String,
    accountType: String,       // "savings" | "current"
    branch: String
  },
  upiDetails: {
    vpa: String,               // UPI ID
    verified: Boolean
  },
  status: String,              // "active" | "pending" | "inactive" | "blocked"
  isPrimary: Boolean,
  verificationMethod: String,  // "penny_drop" | "otp" | "manual"
  verifiedAt: Date,
  linkedAt: Date,
  lastUsed: Date,
  metadata: {
    source: String,            // "manual" | "account_aggregator"
    aggregatorId: String       // If linked via Account Aggregator
  },
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.linkedAccounts.createIndex({ userId: 1, isPrimary: 1 })
db.linkedAccounts.createIndex({ userId: 1, status: 1 })
```

### 3. Transactions Collection
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  type: String,                // "debit" | "credit" | "investment" | "withdrawal"
  category: String,            // "round_up" | "manual" | "auto_invest" | "goal_contribution"
  amount: Number,
  currency: String,            // "INR"
  
  source: {
    type: String,              // "bank" | "upi" | "wallet"
    accountId: ObjectId("..."),
    transactionId: String      // External transaction ID
  },
  
  destination: {
    type: String,              // "investment_wallet" | "bank" | "goal"
    accountId: ObjectId("..."),
    goalId: ObjectId("...")    // If contribution to goal
  },
  
  investment: {
    isInvestment: Boolean,
    allocation: {
      indexFunds: Number,      // Percentage
      digitalGold: Number,
      bonds: Number,
      other: Number
    },
    units: [{
      instrumentType: String,  // "index_fund", "gold", "bond"
      instrumentId: String,
      units: Number,
      pricePerUnit: Number,
      totalValue: Number
    }]
  },
  
  roundUp: {
    isRoundUp: Boolean,
    originalAmount: Number,    // Original transaction amount
    roundedAmount: Number,     // Rounded amount
    difference: Number         // Amount invested
  },
  
  status: String,              // "pending" | "processing" | "completed" | "failed" | "reversed"
  statusHistory: [{
    status: String,
    timestamp: Date,
    reason: String
  }],
  
  fees: {
    platformFee: Number,
    gst: Number,
    gatewayFee: Number,
    total: Number
  },
  
  metadata: {
    description: String,
    merchantName: String,
    merchantCategory: String,
    location: String,
    notes: String
  },
  
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}

// Indexes
db.transactions.createIndex({ userId: 1, createdAt: -1 })
db.transactions.createIndex({ userId: 1, status: 1 })
db.transactions.createIndex({ userId: 1, type: 1, createdAt: -1 })
```

### 4. Goals Collection
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  title: String,               // "New iPhone"
  description: String,
  emoji: String,               // "📱"
  color: String,               // Hex color code
  
  financial: {
    targetAmount: Number,      // 30000
    currentAmount: Number,     // 5000
    currency: String,          // "INR"
    contributionFrequency: String, // "daily" | "weekly" | "monthly"
    suggestedContribution: Number  // AI-calculated
  },
  
  timeline: {
    startDate: Date,
    targetDate: Date,
    expectedCompletionDate: Date,  // AI-predicted
    actualCompletionDate: Date
  },
  
  category: String,            // "gadgets" | "travel" | "education" | "emergency" | "custom"
  priority: String,            // "high" | "medium" | "low"
  
  milestones: [{
    _id: ObjectId("..."),
    amount: Number,            // 10000, 20000, 30000
    percentage: Number,        // 33%, 66%, 100%
    reached: Boolean,
    reachedAt: Date,
    reward: {
      type: String,            // "badge" | "points" | "message"
      value: Mixed
    }
  }],
  
  social: {
    isShared: Boolean,
    visibility: String,        // "private" | "friends" | "public"
    members: [{
      userId: ObjectId("..."),
      role: String,            // "owner" | "contributor"
      contribution: Number,
      joinedAt: Date
    }],
    clubId: ObjectId("...")    // If part of investment club
  },
  
  automation: {
    autoContribute: Boolean,
    amount: Number,
    frequency: String,
    lastContribution: Date,
    nextContribution: Date
  },
  
  status: String,              // "active" | "completed" | "paused" | "cancelled"
  
  analytics: {
    averageContribution: Number,
    contributionCount: Number,
    daysActive: Number,
    completionProbability: Number,  // AI-calculated
    projectedCompletion: Date       // AI-calculated
  },
  
  createdAt: Date,
  updatedAt: Date,
  completedAt: Date
}

// Indexes
db.goals.createIndex({ userId: 1, status: 1 })
db.goals.createIndex({ userId: 1, "timeline.targetDate": 1 })
db.goals.createIndex({ "social.clubId": 1 })
```

### 5. Portfolio Collection
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  summary: {
    totalInvested: Number,
    currentValue: Number,
    totalReturns: Number,
    returnPercentage: Number,
    xirr: Number,              // Extended Internal Rate of Return
    lastUpdated: Date
  },
  
  holdings: [{
    instrumentType: String,    // "index_fund", "etf", "digital_gold", "bond"
    instrumentId: String,
    instrumentName: String,
    isin: String,              // International Securities Identification Number
    
    units: Number,
    averageBuyPrice: Number,
    currentPrice: Number,
    investedAmount: Number,
    currentValue: Number,
    returns: Number,
    returnPercentage: Number,
    
    allocation: Number,        // Percentage of total portfolio
    
    transactions: [{
      transactionId: ObjectId("..."),
      type: String,            // "buy" | "sell"
      units: Number,
      price: Number,
      amount: Number,
      date: Date
    }],
    
    firstBoughtAt: Date,
    lastUpdated: Date
  }],
  
  assetAllocation: {
    equity: Number,            // Percentage
    debt: Number,
    gold: Number,
    other: Number
  },
  
  riskMetrics: {
    volatility: Number,
    sharpeRatio: Number,
    maxDrawdown: Number,
    beta: Number
  },
  
  performance: [{
    date: Date,
    value: Number,
    returns: Number
  }],
  
  rebalancing: {
    lastRebalanced: Date,
    nextRebalance: Date,
    frequency: String,         // "monthly" | "quarterly"
    autoRebalance: Boolean
  },
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.portfolio.createIndex({ userId: 1 }, { unique: true })
```

### 6. Learning Collection
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  progress: {
    level: Number,             // 1, 2, 3...
    totalPoints: Number,
    currentStreak: Number,
    longestStreak: Number,
    lastActivity: Date
  },
  
  lessons: [{
    lessonId: String,
    title: String,
    category: String,          // "basics" | "stocks" | "mutual_funds" | "taxes"
    status: String,            // "not_started" | "in_progress" | "completed"
    progress: Number,          // Percentage
    startedAt: Date,
    completedAt: Date,
    timeSpent: Number,         // Seconds
    score: Number              // If quiz included
  }],
  
  quizzes: [{
    quizId: String,
    lessonId: String,
    attempts: Number,
    bestScore: Number,
    lastScore: Number,
    answers: [{
      questionId: String,
      selectedAnswer: String,
      isCorrect: Boolean,
      timestamp: Date
    }],
    completedAt: Date
  }],
  
  badges: [{
    badgeId: String,
    name: String,
    description: String,
    icon: String,
    category: String,
    earnedAt: Date,
    criteria: {
      type: String,            // "streak" | "lessons" | "quiz_score"
      value: Number
    }
  }],
  
  preferences: {
    reminderTime: String,      // "09:00"
    reminderDays: [Number],    // [1,2,3,4,5] (Mon-Fri)
    difficulty: String         // "beginner" | "intermediate" | "advanced"
  },
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.learning.createIndex({ userId: 1 }, { unique: true })
db.learning.createIndex({ "progress.currentStreak": -1 })
```

### 7. Gamification Collection
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  level: {
    current: Number,
    xp: Number,
    xpToNextLevel: Number,
    title: String              // "Beginner Investor", "Smart Saver", etc.
  },
  
  streaks: {
    investment: {
      current: Number,
      longest: Number,
      lastInvestment: Date
    },
    learning: {
      current: Number,
      longest: Number,
      lastActivity: Date
    },
    login: {
      current: Number,
      longest: Number,
      lastLogin: Date
    }
  },
  
  achievements: [{
    achievementId: String,
    name: String,
    description: String,
    icon: String,
    category: String,          // "investment" | "learning" | "social" | "streak"
    rarity: String,            // "common" | "rare" | "epic" | "legendary"
    progress: Number,          // Current progress
    target: Number,            // Target to achieve
    unlocked: Boolean,
    unlockedAt: Date,
    rewards: {
      xp: Number,
      points: Number,
      badge: String
    }
  }],
  
  challenges: [{
    challengeId: String,
    type: String,              // "solo" | "peer" | "club"
    status: String,            // "active" | "completed" | "failed"
    progress: Number,
    target: Number,
    startDate: Date,
    endDate: Date,
    participants: [{
      userId: ObjectId("..."),
      progress: Number,
      rank: Number
    }],
    reward: {
      type: String,
      value: Mixed
    }
  }],
  
  rewards: {
    totalPoints: Number,
    availablePoints: Number,
    redeemedPoints: Number,
    redemptionHistory: [{
      rewardId: String,
      pointsSpent: Number,
      redeemedAt: Date
    }]
  },
  
  leaderboard: {
    globalRank: Number,
    friendsRank: Number,
    clubRank: Number,
    category: String           // What they rank in
  },
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.gamification.createIndex({ userId: 1 }, { unique: true })
db.gamification.createIndex({ "level.xp": -1 })
db.gamification.createIndex({ "rewards.totalPoints": -1 })
```

### 8. Clubs Collection (Social)
```javascript
{
  _id: ObjectId("..."),
  name: String,
  description: String,
  avatar: String,
  coverImage: String,
  
  creator: {
    userId: ObjectId("..."),
    createdAt: Date
  },
  
  members: [{
    userId: ObjectId("..."),
    role: String,              // "admin" | "moderator" | "member"
    joinedAt: Date,
    invitedBy: ObjectId("..."),
    stats: {
      totalContribution: Number,
      goalsCompleted: Number,
      rank: Number
    }
  }],
  
  settings: {
    privacy: String,           // "public" | "private" | "invite_only"
    maxMembers: Number,
    minInvestment: Number,
    autoAccept: Boolean
  },
  
  goals: [{
    goalId: ObjectId("..."),
    targetAmount: Number,
    currentAmount: Number,
    contributors: Number,
    status: String
  }],
  
  challenges: [{
    challengeId: ObjectId("..."),
    active: Boolean
  }],
  
  activity: [{
    userId: ObjectId("..."),
    type: String,              // "joined" | "invested" | "goal_completed"
    description: String,
    timestamp: Date
  }],
  
  stats: {
    totalMembers: Number,
    totalInvested: Number,
    goalsCompleted: Number,
    activeMembers: Number
  },
  
  status: String,              // "active" | "archived"
  
  createdAt: Date,
  updatedAt: Date
}

// Indexes
db.clubs.createIndex({ "members.userId": 1 })
db.clubs.createIndex({ "settings.privacy": 1, status: 1 })
```

### 9. Notifications Collection
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  type: String,                // "investment" | "goal" | "achievement" | "social" | "system"
  category: String,            // "milestone" | "reminder" | "alert" | "info"
  
  title: String,
  message: String,
  icon: String,
  image: String,
  
  priority: String,            // "high" | "medium" | "low"
  
  data: {
    action: String,            // "open_goal" | "view_portfolio" | "start_lesson"
    resourceId: String,        // ID of related resource
    resourceType: String       // "goal" | "transaction" | "lesson"
  },
  
  delivery: {
    channels: [String],        // ["push", "email", "sms", "in_app"]
    push: {
      sent: Boolean,
      sentAt: Date,
      delivered: Boolean,
      clicked: Boolean
    },
    email: {
      sent: Boolean,
      sentAt: Date,
      opened: Boolean,
      clicked: Boolean
    },
    inApp: {
      read: Boolean,
      readAt: Date
    }
  },
  
  scheduling: {
    scheduled: Boolean,
    scheduledFor: Date,
    sent: Boolean,
    sentAt: Date
  },
  
  createdAt: Date,
  expiresAt: Date
}

// Indexes
db.notifications.createIndex({ userId: 1, createdAt: -1 })
db.notifications.createIndex({ userId: 1, "delivery.inApp.read": 1 })
db.notifications.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 })
```

### 10. AI Conversations Collection
```javascript
{
  _id: ObjectId("..."),
  userId: ObjectId("..."),
  
  conversationId: String,      // Unique conversation thread ID
  
  messages: [{
    messageId: String,
    role: String,              // "user" | "assistant" | "system"
    content: String,
    timestamp: Date,
    
    context: {
      goalId: ObjectId("..."),
      transactionId: ObjectId("..."),
      intent: String,          // "investment_advice" | "goal_planning" | "general"
    },
    
    metadata: {
      tokens: Number,
      model: String,           // "gpt-4" | "gpt-3.5-turbo"
      latency: Number,
      confidence: Number
    }
  }],
  
  summary: String,             // AI-generated summary
  tags: [String],              // ["investment", "mutual_funds"]
  
  status: String,              // "active" | "closed"
  
  createdAt: Date,
  updatedAt: Date,
  lastMessageAt: Date
}

// Indexes
db.aiConversations.createIndex({ userId: 1, lastMessageAt: -1 })
db.aiConversations.createIndex({ conversationId: 1 }, { unique: true })
```

---

## 🔌 API Endpoints Specification

### Authentication Endpoints

#### POST /api/auth/register
Register a new user

**Request:**
```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+919876543210",
  "password": "SecurePass123",
  "referralCode": "GROW123" // Optional
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "OTP sent to your phone",
  "data": {
    "userId": "usr_123abc",
    "otpSent": true,
    "expiresIn": 300
  }
}
```

**Response (400):**
```json
{
  "success": false,
  "error": {
    "code": "USER_EXISTS",
    "message": "User with this email already exists"
  }
}
```

#### POST /api/auth/verify-otp
Verify OTP and complete registration

**Request:**
```json
{
  "userId": "usr_123abc",
  "otp": "123456"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "usr_123abc",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "phone": "+919876543210",
      "kycStatus": "pending"
    }
  }
}
```

#### POST /api/auth/login
User login

**Request:**
```json
{
  "identifier": "+919876543210", // Email or phone
  "password": "SecurePass123"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "usr_123abc",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "phone": "+919876543210",
      "avatar": "https://...",
      "kycStatus": "verified"
    }
  }
}
```

### Investment Endpoints

#### GET /api/invest/portfolio
Get user's portfolio summary

**Headers:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalInvested": 5000,
      "currentValue": 5250,
      "returns": 250,
      "returnPercentage": 5.0,
      "xirr": 12.5
    },
    "holdings": [
      {
        "instrumentType": "index_fund",
        "instrumentName": "Nifty 50 Index Fund",
        "units": 50.5,
        "currentValue": 3000,
        "returns": 150,
        "returnPercentage": 5.26,
        "allocation": 57.14
      }
    ],
    "assetAllocation": {
      "equity": 60,
      "debt": 25,
      "gold": 15
    }
  }
}
```

#### POST /api/invest/manual
Make a manual investment

**Request:**
```json
{
  "amount": 500,
  "sourceAccountId": "acc_456def",
  "allocation": {
    "indexFunds": 60,
    "digitalGold": 30,
    "bonds": 10
  },
  "goalId": "goal_789ghi" // Optional
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_abc123",
    "amount": 500,
    "status": "processing",
    "estimatedCompletion": "2025-10-18T15:00:00Z"
  }
}
```

#### POST /api/invest/round-up/configure
Configure round-up settings

**Request:**
```json
{
  "enabled": true,
  "roundUpTo": 10,
  "maxPerTransaction": 50,
  "excludeCategories": ["utilities", "rent"]
}
```

**Response (200):**
```json
{
  "success": true,
  "message": "Round-up settings updated successfully",
  "data": {
    "enabled": true,
    "roundUpTo": 10,
    "maxPerTransaction": 50
  }
}
```

### Goal Endpoints

#### POST /api/goals
Create a new goal

**Request:**
```json
{
  "title": "New Phone",
  "description": "Save for iPhone 16 Pro",
  "targetAmount": 30000,
  "targetDate": "2025-12-31",
  "category": "gadgets",
  "emoji": "📱",
  "color": "#4CAF50",
  "isShared": false,
  "autoContribute": {
    "enabled": true,
    "amount": 100,
    "frequency": "weekly"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "goalId": "goal_789ghi",
    "title": "New Phone",
    "targetAmount": 30000,
    "currentAmount": 0,
    "targetDate": "2025-12-31",
    "progress": 0,
    "analytics": {
      "dailySavingRequired": 122.95,
      "weeklySavingRequired": 860.66,
      "projectedCompletion": "2026-01-15",
      "completionProbability": 85
    }
  }
}
```

#### GET /api/goals
Get all user goals

**Query Parameters:**
```
?status=active&sort=targetDate&order=asc
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "goals": [
      {
        "goalId": "goal_789ghi",
        "title": "New Phone",
        "emoji": "📱",
        "targetAmount": 30000,
        "currentAmount": 5000,
        "progress": 16.67,
        "targetDate": "2025-12-31",
        "status": "active"
      }
    ],
    "stats": {
      "total": 5,
      "active": 3,
      "completed": 2,
      "totalSaved": 15000
    }
  }
}
```

#### POST /api/goals/:goalId/contribute
Contribute to a goal

**Request:**
```json
{
  "amount": 500,
  "sourceAccountId": "acc_456def",
  "note": "Weekly savings"
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "transactionId": "txn_xyz789",
    "goalId": "goal_789ghi",
    "amount": 500,
    "newTotal": 5500,
    "progress": 18.33,
    "milestoneReached": false
  }
}
```

### Learning Endpoints

#### GET /api/learn/lessons
Get all lessons

**Query Parameters:**
```
?category=basics&difficulty=beginner
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "lessons": [
      {
        "lessonId": "lesson_001",
        "title": "What is Investing?",
        "category": "basics",
        "difficulty": "beginner",
        "duration": 5,
        "points": 10,
        "thumbnail": "https://...",
        "status": "completed",
        "progress": 100,
        "score": 85
      }
    ],
    "stats": {
      "totalLessons": 50,
      "completed": 12,
      "inProgress": 2,
      "totalPoints": 120
    }
  }
}
```

#### GET /api/learn/lessons/:lessonId
Get lesson content

**Response (200):**
```json
{
  "success": true,
  "data": {
    "lessonId": "lesson_001",
    "title": "What is Investing?",
    "content": [
      {
        "type": "text",
        "data": "Investing means putting your money to work..."
      },
      {
        "type": "image",
        "data": {
          "url": "https://...",
          "caption": "Investment growth over time"
        }
      },
      {
        "type": "video",
        "data": {
          "url": "https://...",
          "duration": 120
        }
      }
    ],
    "quiz": {
      "quizId": "quiz_001",
      "questions": [
        {
          "questionId": "q1",
          "question": "What is the main benefit of investing?",
          "options": [
            "Saving money",
            "Growing wealth",
            "Spending money",
            "Borrowing money"
          ],
          "correctAnswer": 1
        }
      ]
    }
  }
}
```

#### POST /api/learn/quiz/:quizId/submit
Submit quiz answers

**Request:**
```json
{
  "lessonId": "lesson_001",
  "answers": [
    {
      "questionId": "q1",
      "selectedAnswer": 1
    },
    {
      "questionId": "q2",
      "selectedAnswer": 0
    }
  ]
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "score": 80,
    "totalQuestions": 5,
    "correctAnswers": 4,
    "passed": true,
    "pointsEarned": 10,
    "badgeEarned": {
      "badgeId": "quiz_master",
      "name": "Quiz Master",
      "icon": "🏆"
    },
    "results": [
      {
        "questionId": "q1",
        "correct": true,
        "explanation": "..."
      }
    ]
  }
}
```

### AI Chat Endpoints

#### POST /api/ai/chat
Chat with AI financial coach

**Request:**
```json
{
  "message": "How much should I invest daily?",
  "conversationId": "conv_123", // Optional, for continuing conversation
  "context": {
    "goalId": "goal_789ghi"
  }
}
```

**Response (200):**
```json
{
  "success": true,
  "data": {
    "conversationId": "conv_123",
    "messageId": "msg_456",
    "response": "Based on your goal of ₹30,000 by Dec 31, 2025, you should invest approximately ₹123 daily. With your current round-up settings, you're averaging ₹45/day. I suggest enabling auto-invest of ₹80/day to stay on track! 🎯",
    "suggestions": [
      {
        "type": "auto_invest",
        "action": "enable",
        "amount": 80,
        "frequency": "daily",
        "label": "Enable ₹80 daily auto-invest"
      },
      {
        "type": "goal",
        "action": "view",
        "goalId": "goal_789ghi",
        "label": "View goal details"
      }
    ],
    "intent": "goal_planning"
  }
}
```

#### POST /api/ai/analyze-spending
Get AI spending insights

**Response (200):**
```json
{
  "success": true,
  "data": {
    "insights": [
      {
        "category": "food_delivery",
        "spending": 3500,
        "trend": "increasing",
        "suggestion": "You spent 25% more on food delivery this month. Consider cooking at home 2-3 times a week to save ₹1,000.",
        "potentialSavings": 1000
      }
    ],
    "totalSpending": 15000,
    "categorization": {
      "food": 4500,
      "transport": 2000,
      "entertainment": 1500,
      "utilities": 3000,
      "shopping": 4000
    }
  }
}
```

---

## 🔐 Security Implementation

### 1. Authentication Flow
```
1. User enters phone/email + password
2. Server validates credentials
3. Generate JWT access token (15 min expiry)
4. Generate refresh token (7 days expiry)
5. Store refresh token in httpOnly cookie
6. Return tokens to client
7. Client stores access token in memory
8. On token expiry, use refresh token to get new access token
```

### 2. Encryption
- **Password:** bcrypt with salt (10 rounds)
- **Sensitive data:** AES-256 encryption
- **API communication:** TLS 1.3
- **Database:** Encryption at rest

### 3. Rate Limiting
```javascript
// Login endpoint: 5 attempts per 15 minutes
// API endpoints: 100 requests per minute per user
// Investment endpoints: 10 requests per minute
```

---

## 🚀 Third-Party Integrations

### 1. Payment Gateway - Razorpay
```javascript
// Create order
const order = await razorpay.orders.create({
  amount: 50000, // Amount in paise (₹500)
  currency: "INR",
  receipt: "rcpt_" + userId,
  payment_capture: 1
});

// Verify payment
const verification = razorpay.payments.verify({
  razorpay_order_id: orderId,
  razorpay_payment_id: paymentId,
  razorpay_signature: signature
});
```

### 2. Account Aggregator API
```javascript
// Request account linking
const linkingRequest = await accountAggregator.initiateLinking({
  userId: userId,
  consentDuration: 90, // days
  dataRange: {
    from: "2025-01-01",
    to: "2025-10-18"
  }
});

// Fetch transactions
const transactions = await accountAggregator.fetchTransactions({
  userId: userId,
  accountId: accountId,
  from: "2025-10-01",
  to: "2025-10-18"
});
```

### 3. Investment APIs (Groww/Zerodha)
```javascript
// Execute buy order
const order = await investmentAPI.executeBuyOrder({
  instrumentType: "mutual_fund",
  instrumentId: "INF123ABC456",
  amount: 500,
  sip: false
});

// Get NAV (Net Asset Value)
const nav = await investmentAPI.getNAV({
  instrumentId: "INF123ABC456",
  date: "2025-10-18"
});
```

---

## 📊 Analytics & Monitoring

### Events to Track
```javascript
// User events
analytics.track('user_registered', { userId, source, referralCode });
analytics.track('kyc_completed', { userId, duration });

// Investment events
analytics.track('investment_made', { userId, amount, type, source });
analytics.track('goal_created', { userId, goalType, targetAmount });
analytics.track('goal_completed', { userId, goalId, durationDays });

// Learning events
analytics.track('lesson_started', { userId, lessonId });
analytics.track('lesson_completed', { userId, lessonId, score });
analytics.track('quiz_passed', { userId, quizId, score });

// Engagement events
analytics.track('daily_login', { userId, streak });
analytics.track('achievement_unlocked', { userId, achievementId });
analytics.track('ai_chat_used', { userId, intent, duration });
```

---

## 🧪 Testing Requirements

### 1. Unit Tests
- All API endpoints
- Database models
- Business logic functions
- AI agent functions

### 2. Integration Tests
- Payment flow
- Investment execution
- Bank linking
- Goal contribution

### 3. Load Testing
- 1000 concurrent users
- 10,000 requests per minute
- Database query performance

---

## 📈 Performance Optimization

### 1. Caching Strategy
```javascript
// Redis caching
- User sessions: 15 min TTL
- Portfolio data: 5 min TTL
- NAV data: 1 hour TTL
- Leaderboard: 10 min TTL
```

### 2. Database Optimization
- Proper indexing
- Query optimization
- Connection pooling
- Read replicas for analytics

---

*This document will be updated as development progresses.*
