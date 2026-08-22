# 🚀 Gullak - Micro-Investing App for Gen-Z

## 📋 Table of Contents
1. [Overview](#overview)
2. [Problem Statement](#problem-statement)
3. [Solution](#solution)
4. [Features](#features)
5. [Technical Architecture](#technical-architecture)
6. [Backend Requirements](#backend-requirements)
7. [Frontend Structure](#frontend-structure)
8. [API Specifications](#api-specifications)
9. [Database Schema](#database-schema)
10. [Agentic AI Integration](#agentic-ai-integration)
11. [Development Roadmap](#development-roadmap)

---

## 🎯 Overview

**Gullak** is a micro-investing and financial education platform designed specifically for young adults (Gen-Z and early millennials) who want to start investing but face barriers like:
- Feeling that investing is complicated or "for rich people"
- Not having large sums to invest (only ₹100-₹500 spare)
- Lack of knowledge about investment options
- Existing apps feeling too technical

### App Tagline
*"Pocket-sized Investing for Gen Z"*

---

## 💡 Problem Statement

Young people (16-25 years) struggle to start investing because:
- Finance feels complex and intimidating
- Low disposable income
- Lack of personalized guidance
- Overwhelmed by too many options in current apps

**Goal:** Build a fun, gamified, AI-driven app that helps users start micro-investing (₹10-₹50 per purchase), learn financial basics, and grow healthy saving habits automatically.

---

## ✨ Solution

### Core Mechanism: Spare Change Investing
1. **Connect Bank/UPI/Card** - Securely link payment methods
2. **Auto Round-Up** - Every transaction rounds up to next ₹10 (e.g., ₹230 → ₹240)
3. **Auto-Invest** - The ₹10 difference automatically goes into investment wallet
4. **Smart Allocation** - Money invested in low-risk instruments (index funds, ETFs, digital gold)
5. **Goal Tracking** - Users set goals and track progress visually

---

## 🎨 Features

### 1. 🪙 Auto Round-up Investments
- Automatic spare change collection
- Customizable round-up rules (₹5, ₹10, ₹20, ₹50)
- Manual one-time investments
- Scheduled auto-investments (daily/weekly/monthly)

### 2. 🎯 Goal-Based Saving
- Create custom goals (phone, trip, emergency fund)
- Visual progress tracking
- Milestone celebrations
- Goal timeline predictions
- Shared group goals

### 3. 🧠 Financial Education (Gamified)
- Bite-sized lessons (2-5 min each)
- Interactive quizzes
- Progress badges and achievements
- Learning streaks
- Duolingo-style learning path
- Topics: Basics, Stocks, Mutual Funds, SIPs, Taxes, etc.

### 4. 📊 Smart Dashboard
- Portfolio overview
- Investment breakdown (pie charts)
- Monthly growth reports
- Spending categorization
- Savings rate tracking

### 5. 🤖 AI Financial Coach
- Conversational chatbot
- Personalized advice
- Spending insights
- Investment recommendations
- Motivational nudges
- Voice-based queries

### 6. 🎮 Gamification
- Daily streaks
- Achievement badges
- Leaderboards
- Peer challenges
- Reward points
- Level progression

### 7. 🤝 Social Features
- Investment clubs/groups
- Friend challenges
- Shared goals
- Achievement sharing
- Referral rewards

### 8. 🔐 Security & Compliance
- Bank-grade encryption
- SEBI-compliant investments
- KYC verification
- Two-factor authentication
- Biometric login

---

## 🏗️ Technical Architecture

### Frontend Stack
```
📱 Framework: React Native (Expo)
🎨 UI Library: React Native Paper / NativeBase
🎭 Animations: React Native Reanimated, Lottie
📊 Charts: Victory Native / React Native Chart Kit
🧭 Navigation: React Navigation v6
🔄 State Management: Redux Toolkit / Zustand
🌐 API Client: Axios / React Query
```

### Backend Stack (To Be Implemented)
```
⚙️ Server: Node.js + Express.js
🤖 AI Layer: Python (FastAPI) + LangGraph/CrewAI
🗄️ Database: MongoDB + Redis (caching)
💳 Payments: Razorpay, UPI integration
📈 Investment APIs: Groww API, Zerodha Kite, INDmoney
🔐 Auth: JWT + OAuth 2.0
☁️ Hosting: AWS (EC2, Lambda, S3, CloudFront)
📊 Analytics: Mixpanel, Firebase Analytics
```

---

## 🔧 Backend Requirements

### 1. Authentication Service
- **Endpoints:**
  - `POST /api/auth/register` - User registration
  - `POST /api/auth/login` - User login
  - `POST /api/auth/verify-otp` - OTP verification
  - `POST /api/auth/refresh-token` - Refresh JWT
  - `POST /api/auth/logout` - Logout
- **Features:**
  - Phone number/email authentication
  - OTP verification
  - JWT token management
  - Session handling
  - Biometric authentication support

### 2. User Profile Service
- **Endpoints:**
  - `GET /api/user/profile` - Get user profile
  - `PUT /api/user/profile` - Update profile
  - `POST /api/user/kyc` - Submit KYC documents
  - `GET /api/user/kyc-status` - Check KYC status
- **Features:**
  - Profile management
  - KYC verification
  - Preferences storage
  - Document upload

### 3. Bank Integration Service
- **Endpoints:**
  - `POST /api/bank/link` - Link bank account
  - `GET /api/bank/accounts` - List linked accounts
  - `DELETE /api/bank/accounts/:id` - Unlink account
  - `GET /api/bank/transactions` - Fetch transactions
- **Features:**
  - Bank account linking (Account Aggregator API)
  - UPI integration
  - Transaction fetching
  - Balance checking
  - Secure credential storage

### 4. Investment Service
- **Endpoints:**
  - `POST /api/invest/round-up` - Process round-up investment
  - `POST /api/invest/manual` - Manual investment
  - `POST /api/invest/auto-config` - Configure auto-invest
  - `GET /api/invest/portfolio` - Get portfolio summary
  - `GET /api/invest/history` - Investment history
- **Features:**
  - Round-up calculation engine
  - Investment execution (via Groww/Zerodha APIs)
  - Portfolio management
  - Transaction processing
  - Investment allocation algorithms

### 5. Goal Management Service
- **Endpoints:**
  - `POST /api/goals` - Create goal
  - `GET /api/goals` - List all goals
  - `GET /api/goals/:id` - Get goal details
  - `PUT /api/goals/:id` - Update goal
  - `DELETE /api/goals/:id` - Delete goal
  - `POST /api/goals/:id/contribute` - Add contribution
- **Features:**
  - Goal creation and tracking
  - Progress calculation
  - Milestone notifications
  - Goal sharing (for group goals)

### 6. Education Service
- **Endpoints:**
  - `GET /api/learn/lessons` - List all lessons
  - `GET /api/learn/lessons/:id` - Get lesson content
  - `POST /api/learn/progress` - Update learning progress
  - `POST /api/learn/quiz/:id/submit` - Submit quiz answers
  - `GET /api/learn/badges` - Get earned badges
- **Features:**
  - Content management
  - Progress tracking
  - Quiz evaluation
  - Badge awarding system

### 7. Gamification Service
- **Endpoints:**
  - `GET /api/gamify/streaks` - Get user streaks
  - `GET /api/gamify/badges` - Get all badges
  - `GET /api/gamify/leaderboard` - Get leaderboard
  - `POST /api/gamify/challenge` - Create/join challenge
  - `GET /api/gamify/rewards` - Get reward points
- **Features:**
  - Streak tracking
  - Badge system
  - Leaderboard management
  - Challenge engine
  - Reward points system

### 8. AI Agent Service (Agentic AI)
- **Endpoints:**
  - `POST /api/ai/chat` - Chat with AI coach
  - `POST /api/ai/analyze-spending` - Get spending insights
  - `POST /api/ai/suggest-investments` - Get investment suggestions
  - `POST /api/ai/goal-plan` - Generate goal achievement plan
- **Features:**
  - Conversational AI chatbot
  - Spending pattern analysis
  - Personalized investment recommendations
  - Goal planning automation
  - Budget coaching

### 9. Notification Service
- **Endpoints:**
  - `POST /api/notifications/send` - Send notification
  - `GET /api/notifications` - Get user notifications
  - `PUT /api/notifications/:id/read` - Mark as read
  - `POST /api/notifications/preferences` - Update preferences
- **Features:**
  - Push notifications
  - In-app notifications
  - Email notifications
  - SMS alerts
  - Notification preferences

### 10. Analytics Service
- **Endpoints:**
  - `GET /api/analytics/portfolio` - Portfolio analytics
  - `GET /api/analytics/spending` - Spending analytics
  - `GET /api/analytics/returns` - Returns calculation
  - `GET /api/analytics/reports/:month` - Monthly reports
- **Features:**
  - Portfolio performance tracking
  - Spending categorization
  - Returns calculation
  - Report generation

### 11. Social Service
- **Endpoints:**
  - `POST /api/social/clubs` - Create investment club
  - `POST /api/social/clubs/:id/join` - Join club
  - `GET /api/social/clubs/:id/members` - Get club members
  - `POST /api/social/challenges` - Create challenge
  - `POST /api/social/share-achievement` - Share achievement
- **Features:**
  - Investment clubs
  - Peer challenges
  - Achievement sharing
  - Friend management

### 12. Payment Gateway Service
- **Endpoints:**
  - `POST /api/payments/initiate` - Initiate payment
  - `POST /api/payments/verify` - Verify payment
  - `POST /api/payments/refund` - Process refund
  - `GET /api/payments/history` - Payment history
- **Features:**
  - Razorpay integration
  - UPI payments
  - Payment verification
  - Refund processing

---

## 📱 Frontend Structure

### Screen Architecture

```
app/
├── (auth)/
│   ├── welcome.tsx              # Welcome/splash screen
│   ├── login.tsx                # Login screen
│   ├── register.tsx             # Registration
│   └── verify-otp.tsx           # OTP verification
│
├── (onboarding)/
│   ├── intro.tsx                # Feature introduction (swiper)
│   ├── link-bank.tsx            # Bank account linking
│   ├── setup-goals.tsx          # Initial goal setup
│   └── enable-roundup.tsx       # Round-up configuration
│
├── (tabs)/
│   ├── _layout.tsx              # Tab navigator
│   ├── index.tsx                # Home/Dashboard
│   ├── invest.tsx               # Invest screen
│   ├── goals.tsx                # Goals screen
│   ├── learn.tsx                # Education/Learn screen
│   └── profile.tsx              # Profile screen
│
├── (modals)/
│   ├── add-goal.tsx             # Create new goal
│   ├── manual-invest.tsx        # Manual investment
│   ├── lesson-detail.tsx        # Lesson content
│   ├── quiz.tsx                 # Quiz screen
│   └── ai-chat.tsx              # AI coach chat
│
└── (features)/
    ├── portfolio/
    │   ├── portfolio-detail.tsx
    │   └── transaction-history.tsx
    ├── social/
    │   ├── clubs.tsx
    │   ├── leaderboard.tsx
    │   └── challenges.tsx
    └── settings/
        ├── account.tsx
        ├── linked-banks.tsx
        ├── notifications.tsx
        └── security.tsx
```

### Component Architecture

```
components/
├── ui/
│   ├── Button.tsx               # Custom button
│   ├── Card.tsx                 # Card component
│   ├── Input.tsx                # Text input
│   ├── ProgressBar.tsx          # Progress indicator
│   ├── Badge.tsx                # Badge component
│   ├── Avatar.tsx               # User avatar
│   └── Chip.tsx                 # Chip/tag component
│
├── charts/
│   ├── PieChart.tsx             # Portfolio distribution
│   ├── LineChart.tsx            # Growth chart
│   ├── BarChart.tsx             # Spending chart
│   └── DonutChart.tsx           # Goal progress
│
├── investment/
│   ├── InvestmentCard.tsx       # Investment summary card
│   ├── RoundUpToggle.tsx        # Round-up on/off
│   ├── InvestmentHistory.tsx    # Transaction list
│   └── PortfolioSummary.tsx     # Portfolio overview
│
├── goals/
│   ├── GoalCard.tsx             # Individual goal card
│   ├── GoalProgress.tsx         # Progress indicator
│   ├── GoalMilestone.tsx        # Milestone marker
│   └── CreateGoalForm.tsx       # Goal creation form
│
├── learn/
│   ├── LessonCard.tsx           # Lesson preview card
│   ├── QuizQuestion.tsx         # Quiz question component
│   ├── BadgeDisplay.tsx         # Achievement badge
│   ├── StreakCounter.tsx        # Learning streak
│   └── LearningPath.tsx         # Progress path visual
│
├── social/
│   ├── ClubCard.tsx             # Investment club card
│   ├── ChallengeCard.tsx        # Challenge card
│   ├── LeaderboardItem.tsx      # Leaderboard entry
│   └── AchievementShare.tsx     # Share achievement
│
└── common/
    ├── Header.tsx               # Screen header
    ├── BottomSheet.tsx          # Bottom sheet modal
    ├── LoadingSpinner.tsx       # Loading indicator
    ├── EmptyState.tsx           # Empty state component
    └── ErrorBoundary.tsx        # Error handling
```

---

## 🔌 API Specifications

### Authentication APIs

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+919876543210",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "message": "OTP sent to your phone",
  "userId": "usr_123abc",
  "otpSent": true
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "phone": "+919876543210",
  "password": "SecurePass123"
}

Response:
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "refresh_token_here",
  "user": {
    "id": "usr_123abc",
    "name": "Rahul Sharma",
    "email": "rahul@example.com",
    "phone": "+919876543210",
    "kycStatus": "verified"
  }
}
```

### Investment APIs

#### Get Portfolio
```http
GET /api/invest/portfolio
Authorization: Bearer {token}

Response:
{
  "success": true,
  "portfolio": {
    "totalInvested": 5000,
    "currentValue": 5250,
    "returns": 250,
    "returnPercentage": 5.0,
    "breakdown": [
      {
        "type": "Index Funds",
        "amount": 3000,
        "percentage": 57.14
      },
      {
        "type": "Digital Gold",
        "amount": 1500,
        "percentage": 28.57
      },
      {
        "type": "Bonds",
        "amount": 750,
        "percentage": 14.29
      }
    ]
  }
}
```

#### Manual Investment
```http
POST /api/invest/manual
Authorization: Bearer {token}
Content-Type: application/json

{
  "amount": 500,
  "allocation": {
    "indexFunds": 60,
    "digitalGold": 30,
    "bonds": 10
  }
}

Response:
{
  "success": true,
  "transactionId": "txn_456def",
  "amount": 500,
  "status": "processing"
}
```

### Goal APIs

#### Create Goal
```http
POST /api/goals
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Phone",
  "targetAmount": 30000,
  "targetDate": "2025-12-31",
  "category": "gadgets",
  "isShared": false
}

Response:
{
  "success": true,
  "goal": {
    "id": "goal_789ghi",
    "title": "New Phone",
    "targetAmount": 30000,
    "currentAmount": 0,
    "targetDate": "2025-12-31",
    "progress": 0,
    "dailySavingRequired": 122.95
  }
}
```

### AI Chat API

#### Chat with AI Coach
```http
POST /api/ai/chat
Authorization: Bearer {token}
Content-Type: application/json

{
  "message": "How much should I invest daily to reach my goal?",
  "context": {
    "goalId": "goal_789ghi"
  }
}

Response:
{
  "success": true,
  "response": "Based on your goal of ₹30,000 by Dec 31, 2025, you should invest approximately ₹123 daily. With your current round-up settings, you're averaging ₹45/day. I suggest enabling auto-invest of ₹80/day to stay on track! 🎯",
  "suggestions": [
    {
      "type": "auto_invest",
      "amount": 80,
      "frequency": "daily"
    }
  ]
}
```

---

## 🗄️ Database Schema

### Users Collection
```json
{
  "_id": "usr_123abc",
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "phone": "+919876543210",
  "passwordHash": "hashed_password",
  "avatar": "https://...",
  "dateOfBirth": "2000-05-15",
  "kycStatus": "verified",
  "kycDocuments": {
    "aadhar": "...",
    "pan": "..."
  },
  "preferences": {
    "riskProfile": "moderate",
    "investmentStyle": "aggressive",
    "notifications": {
      "push": true,
      "email": true,
      "sms": false
    }
  },
  "createdAt": "2025-01-15T10:00:00Z",
  "updatedAt": "2025-10-18T10:00:00Z"
}
```

### Linked Accounts Collection
```json
{
  "_id": "acc_456def",
  "userId": "usr_123abc",
  "bankName": "HDFC Bank",
  "accountNumber": "****5678",
  "accountType": "savings",
  "ifscCode": "HDFC0001234",
  "isPrimary": true,
  "linkedAt": "2025-01-20T10:00:00Z",
  "status": "active"
}
```

### Investments Collection
```json
{
  "_id": "inv_789ghi",
  "userId": "usr_123abc",
  "type": "round_up",
  "amount": 10,
  "sourceTransaction": "txn_original_123",
  "allocation": {
    "indexFunds": 6,
    "digitalGold": 3,
    "bonds": 1
  },
  "status": "completed",
  "createdAt": "2025-10-18T14:30:00Z"
}
```

### Goals Collection
```json
{
  "_id": "goal_789ghi",
  "userId": "usr_123abc",
  "title": "New Phone",
  "description": "Save for iPhone 16",
  "targetAmount": 30000,
  "currentAmount": 5000,
  "targetDate": "2025-12-31",
  "category": "gadgets",
  "icon": "phone",
  "color": "#4CAF50",
  "isShared": false,
  "members": [],
  "milestones": [
    {
      "amount": 10000,
      "reached": true,
      "reachedAt": "2025-08-15T10:00:00Z"
    }
  ],
  "createdAt": "2025-06-01T10:00:00Z",
  "updatedAt": "2025-10-18T10:00:00Z"
}
```

### Learning Progress Collection
```json
{
  "_id": "lrn_abc123",
  "userId": "usr_123abc",
  "lessonsCompleted": ["lesson_1", "lesson_2", "lesson_3"],
  "currentStreak": 15,
  "longestStreak": 30,
  "badgesEarned": ["beginner", "consistent_learner", "quiz_master"],
  "totalPoints": 450,
  "level": 3,
  "quizScores": {
    "quiz_1": 80,
    "quiz_2": 90
  },
  "lastActivity": "2025-10-18T10:00:00Z"
}
```

---

## 🤖 Agentic AI Integration

### AI Agents Architecture

#### 1. Investment Agent (Planner)
**Responsibilities:**
- Analyze spending patterns
- Automate round-up investments
- Optimize investment allocation
- Rebalance portfolio

**Technologies:**
- LangGraph for agent workflow
- ML models for pattern recognition
- Historical data analysis

#### 2. Goal Planner Agent (Strategist)
**Responsibilities:**
- Break down goals into actionable steps
- Calculate daily/weekly saving requirements
- Suggest goal timeline adjustments
- Predict goal achievement probability

**Technologies:**
- Goal decomposition algorithms
- Predictive analytics
- Timeline optimization

#### 3. Finance Tutor Agent (Educator)
**Responsibilities:**
- Deliver personalized lessons
- Adapt to learning pace
- Generate quiz questions
- Provide concept explanations

**Technologies:**
- GPT-4 for content generation
- Adaptive learning algorithms
- Knowledge graph for finance concepts

#### 4. Budget Coach Agent (Advisor)
**Responsibilities:**
- Track and categorize spending
- Identify saving opportunities
- Provide budget recommendations
- Send motivational nudges

**Technologies:**
- NLP for transaction categorization
- Anomaly detection for unusual spending
- Behavioral psychology models

#### 5. Engagement Agent (Companion)
**Responsibilities:**
- Send timely notifications
- Maintain gamification elements
- Celebrate milestones
- Provide progress updates

**Technologies:**
- Event-driven architecture
- Personalization engine
- Notification scheduling

#### 6. Risk & Compliance Agent (Monitor)
**Responsibilities:**
- Ensure SEBI compliance
- Monitor investment risk
- Alert on regulatory changes
- Validate transactions

**Technologies:**
- Rule-based compliance engine
- Risk assessment models
- Real-time monitoring

### Agent Communication Flow
```
User Request
    ↓
[LLM Router] → Determines which agent(s) to activate
    ↓
[Agent Orchestrator] → Coordinates multi-agent workflows
    ↓
[Specific Agents] → Execute specialized tasks
    ↓
[Response Aggregator] → Combines agent outputs
    ↓
User Response
```

---

## 🎨 Design System

### Color Palette (Gen-Z Friendly)
```
Primary: #6C63FF (Vibrant Purple)
Secondary: #FF6584 (Coral Pink)
Accent: #4CAF50 (Success Green)
Warning: #FFA726 (Orange)
Error: #F44336 (Red)
Background: #F5F7FA (Light Gray)
Surface: #FFFFFF (White)
Text Primary: #1A1A1A (Almost Black)
Text Secondary: #757575 (Gray)
```

### Gradients
```css
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Success Gradient: linear-gradient(135deg, #11998e 0%, #38ef7d 100%)
Gold Gradient: linear-gradient(135deg, #f093fb 0%, #f5576c 100%)
```

### Typography
```
Headings: Poppins (Bold)
Body: Inter (Regular)
Numbers: SF Mono (Medium)
```

---

## 📊 Development Roadmap

### Phase 1: MVP (Months 1-3) ✅ **CURRENT PHASE**
- [x] Project setup
- [ ] UI/UX design system
- [ ] Onboarding flow
- [ ] Dashboard screen
- [ ] Basic investment tracking UI
- [ ] Goal creation UI
- [ ] Mock data integration
- [ ] Basic AI chatbot (GPT-based)

### Phase 2: Backend Development (Months 3-5)
- [ ] Setup Node.js server
- [ ] Authentication service
- [ ] Bank integration (Account Aggregator)
- [ ] Investment APIs (Groww/Zerodha integration)
- [ ] Database setup (MongoDB)
- [ ] Payment gateway (Razorpay)
- [ ] Basic analytics

### Phase 3: Agentic AI (Months 5-7)
- [ ] Setup Python AI service
- [ ] Implement LangGraph framework
- [ ] Deploy Investment Agent
- [ ] Deploy Goal Planner Agent
- [ ] Deploy Budget Coach Agent
- [ ] Deploy Tutor Agent
- [ ] Agent orchestration layer

### Phase 4: Advanced Features (Months 7-9)
- [ ] Gamification system
- [ ] Social features (clubs, challenges)
- [ ] Advanced analytics
- [ ] Learning module with quizzes
- [ ] Push notifications
- [ ] Performance optimization

### Phase 5: Testing & Launch (Months 9-12)
- [ ] Security audit
- [ ] Load testing
- [ ] Beta testing with users
- [ ] SEBI compliance verification
- [ ] App store submission
- [ ] Marketing launch

---

## 🔐 Security Considerations

### Data Protection
- End-to-end encryption for sensitive data
- PCI-DSS compliance for payment data
- GDPR/India data protection compliance
- Regular security audits

### Authentication
- Multi-factor authentication (MFA)
- Biometric authentication
- Session management
- Token rotation

### API Security
- Rate limiting
- Request validation
- CORS policies
- API key management

---

## 💰 Revenue Model

| Stream | Description | Pricing |
|--------|-------------|---------|
| **Micro-transaction fee** | 0.2% on investments | ₹0.20 per ₹100 |
| **Premium subscription** | AI Advisor Pro | ₹99/month |
| **Affiliate partnerships** | Mutual fund referrals | 5-10% commission |
| **Learning marketplace** | Premium lessons | ₹10-₹50/lesson |
| **Ad-free experience** | Remove ads | ₹49/month |

---

## 📈 Success Metrics (KPIs)

- **User Acquisition:** 10K users in first 3 months
- **Engagement:** 60% daily active users
- **Retention:** 70% user retention after 30 days
- **Investment Rate:** Average ₹500/user/month
- **Learning Completion:** 50% complete at least 1 module
- **Goal Achievement:** 40% users achieve first goal

---

## 🚀 Next Steps

1. ✅ Complete frontend UI (current focus)
2. Setup backend infrastructure
3. Integrate payment gateways
4. Implement AI agents
5. Beta testing
6. Launch v1.0

---

## 📞 Contact & Support

**App Name:** Gullak
**Target Audience:** Gen-Z (16-25 years)
**Platform:** iOS & Android (React Native)
**Version:** 1.0.0 (MVP)

---

*Last Updated: October 18, 2025*
