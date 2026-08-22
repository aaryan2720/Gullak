# 🏺 Gullak - AI & Blockchain Micro-Investing App for Gen-Z

> **"Pocket-sized Investing for Gen Z — Powered by AI & Blockchain"**

Gullak is a revolutionary micro-investing and financial education platform designed specifically for young adults (Gen-Z and early millennials) who want to start investing but face barriers like complexity, limited funds, and lack of knowledge. Every transaction is backed by **autonomous AI agents** and recorded on an **immutable blockchain ledger** — making wealth creation transparent, automated, and accessible from just ₹10.

[![Built on Polygon](https://img.shields.io/badge/Blockchain-Polygon-8247E5?style=for-the-badge)](https://polygon.technology)
[![Powered by LangChain](https://img.shields.io/badge/AI-LangChain-00A67E?style=for-the-badge)](https://langchain.com)
[![React Native](https://img.shields.io/badge/Mobile-React%20Native-61DAFB?style=for-the-badge)](https://reactnative.dev)

---

## 🎯 Problem We're Solving

Many young adults want to invest, but they face real-world hurdles:
- 😰 Investing feels complicated or "for rich people"
- 💸 They don't have large sums (maybe ₹100-500 spare, not thousands)
- ❓ They don't know where or how to invest
- 📱 Existing apps feel too technical for first-timers
- 🏦 Money ends up sitting in bank accounts instead of growing

---

## 💡 Our Solution

### **Spare Change Investing**
1. **Connect Bank/UPI** - Securely link payment methods
2. **Auto Round-up** - Every transaction rounds up to next ₹10
3. **Auto-Invest** - Difference automatically goes into investments
4. **Smart Growth** - Invested in low-risk instruments (index funds, ETFs, digital gold)

### **Core Features**

🪙 **Micro-Investments**
- Automatic round-up investing (₹10-50 per transaction)
- Manual one-time investments
- Scheduled auto-investments

🎯 **Goal-Based Saving**
- Create custom goals (phone, trip, emergency fund)
- Visual progress tracking
- Milestone celebrations
- Shared group goals

🧠 **Financial Education (Gamified)**
- Bite-sized lessons (2-5 min each)
- Interactive quizzes with points
- Badges and achievements
- Duolingo-style learning streaks

🤖 **AI Financial Coach**
- Conversational chatbot
- Personalized investment advice
- Spending insights
- Motivational nudges

🎮 **Gamification**
- Daily streaks
- Achievement badges
- Leaderboards
- Peer challenges
- Reward points

🤝 **Social Features**
- Investment clubs/groups
- Friend challenges
- Shared goals
- Achievement sharing

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run on platform
npm run ios      # iOS
npm run android  # Android
npm run web      # Web
```

**→ See [QUICKSTART.md](./QUICKSTART.md) for detailed instructions**

---

## 📱 App Screens

| Screen | Description | Status |
|--------|-------------|--------|
| 🎯 **Landing Page** | Beautiful gradient hero, features, stats | ✅ Complete |
| 🔐 **Sign In** | Email/password login, social auth | ✅ Complete |
| 📝 **Sign Up** | Registration with benefit badges | ✅ Complete |
|  **Home** | Portfolio dashboard, quick actions, goals preview | ✅ Complete |
| 💰 **Invest** | Round-up settings, manual invest, allocation | ✅ Complete |
| 🎯 **Goals** | Financial goals tracking with progress | ✅ Complete |
| 📚 **Learn** | Gamified lessons, quizzes, badges | ✅ Complete |
| 👤 **Profile** | User settings, stats, linked accounts | ✅ Complete |

**Total Screens: 8 | All with Safe Area Support ✅**

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [📖 DOCUMENTATION.md](./DOCUMENTATION.md) | Complete project overview, features, architecture |
| [🔧 BACKEND-REQUIREMENTS.md](./BACKEND-REQUIREMENTS.md) | Backend API specs, database schemas |
| [💻 README-FRONTEND.md](./README-FRONTEND.md) | Frontend development guide |
| [🔐 AUTH-SCREENS-GUIDE.md](./AUTH-SCREENS-GUIDE.md) | Authentication screens guide |
| [🎨 UI-IMPROVEMENTS.md](./UI-IMPROVEMENTS.md) | Recent UI improvements & safe area |
| [� PROJECT-SUMMARY.md](./PROJECT-SUMMARY.md) | What's built and next steps |
| [⚡ QUICKSTART.md](./QUICKSTART.md) | Quick setup guide |
| [🗺️ ROADMAP.md](./ROADMAP.md) | Development roadmap |
| [✅ CHECKLIST.md](./CHECKLIST.md) | Task tracking |

---

## 🎨 Design System

### Colors (Gen-Z Friendly)
```
Primary:   #6C63FF (Vibrant Purple)
Secondary: #FF6584 (Coral Pink)
Success:   #4CAF50 (Green)
Warning:   #FFA726 (Orange)
Error:     #F44336 (Red)
```

### Components Built
✅ Button (7 variants, 3 sizes)
✅ Card (3 variants)
✅ Input (with validation, icons)
✅ ProgressBar
✅ Badge

**→ Full design system in [constants/theme.ts](./constants/theme.ts)**

---

## 🏗️ Tech Stack

### Frontend (Implemented ✅)
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Navigation:** Expo Router
- **UI:** Custom component library
- **Icons:** Ionicons

### Backend (Documented, To Implement 📝)
- **Server:** Node.js + Express
- **Database:** MongoDB + Redis
- **AI:** Python (FastAPI) + LangGraph
- **Payments:** Razorpay
- **Investment APIs:** Groww, Zerodha
- **Auth:** JWT + OAuth 2.0

### 🔗 Blockchain (New — To Implement)
- **Network:** Polygon (PoS) — Low gas, EVM-compatible
- **Contracts:** Solidity + OpenZeppelin
- **Wallet:** Privy.io (embedded) + WalletConnect
- **Oracle:** Chainlink (price feeds)
- **Storage:** IPFS (NFT metadata, lesson content)
- **SDK:** ethers.js + wagmi
- **Dev Tools:** Hardhat, The Graph

---

## 🔗 Blockchain Integration

Gullak integrates blockchain to deliver **transparency, trust, and decentralized finance** capabilities that no traditional fintech app offers.

### Why Blockchain?

| Problem | Blockchain Solution |
|---------|--------------------|
| Lack of investment transparency | Immutable on-chain ledger |
| Trust in AI decisions | AI actions logged & verifiable |
| Goal fund temptation | Smart contract-locked funds |
| Achievement verification | NFT-backed badges (truly owned) |

### Smart Contract Suite

#### 📒 `GullakLedger.sol` — Investment Record
Every round-up and manual investment is recorded on the **Polygon blockchain** — users can independently verify their full investment history at any time.

#### 🎯 `GullakGoal.sol` — Smart Contract Goals
Goal funds are held in **smart contract escrow** and released only when the target amount is reached. This prevents impulsive withdrawals and builds financial discipline.

#### 🏆 `GullakRewards.sol` — NFT Achievement Badges
Milestone badges (First Investment, Goal Crusher, 30-Day Streak) are minted as **ERC-1155 NFTs** — stored in the user's wallet and truly owned by them.

#### 🤖 `GullakAIAudit.sol` — AI Transparency
Every significant AI agent action (investment, rebalancing, fraud block) is logged on-chain with a reasoning hash — ensuring AI accountability and supporting SEBI audit requirements.

### DeFi Yield (Phase 2)
Idle investment wallet balance earns **4–6% APY** through Aave/Compound integration. The AI Portfolio Manager agent automatically optimizes yield strategy.

### Blockchain UX Philosophy
> Blockchain is **invisible by default**. Users don't need to understand it — they just benefit from it.

- Wallets created automatically on signup (Privy.io embedded wallet)
- Gas fees abstracted via ERC-4337 account abstraction
- All activity visible in a simple **"Transparency" tab** in the app
- Advanced users can connect MetaMask or any WalletConnect wallet

**→ Full blockchain specs in [BACKEND-REQUIREMENTS.md](./BACKEND-REQUIREMENTS.md)**

---

## 🤖 AI Agents (Agentic AI)

Gullak uses autonomous AI agents:

| Agent | Role | Function |
|-------|------|----------|
| 💰 Investment Agent | Planner | Automates micro-investments, portfolio optimization |
| 🎯 Goal Planner | Strategist | Breaks goals into daily/weekly actions |
| 🧑‍🏫 Finance Tutor | Educator | Personalized learning paths |
| 💬 Budget Coach | Advisor | Spending insights, saving tips |
| 🎮 Engagement | Companion | Gamification, notifications |
| 🛡️ Risk Monitor | Compliance | SEBI compliance, risk assessment |

**→ Full AI architecture in [BACKEND-REQUIREMENTS.md](./BACKEND-REQUIREMENTS.md)**

---

## 💰 Revenue Model

| Stream | Details | Pricing |
|--------|---------|---------|
| Micro-transaction fee | 0.2% on investments | ₹0.20 per ₹100 |
| Premium subscription | AI Advisor Pro | ₹99/month |
| Affiliate partnerships | Mutual fund referrals | 5-10% commission |
| Learning marketplace | Premium lessons | ₹10-50/lesson |
| Ad-free experience | Remove ads | ₹49/month |

---

## 🎯 Target Audience

| Segment | Age | Needs |
|---------|-----|-------|
| Students | 16-22 | Learn basics, small savings |
| Young Professionals | 22-25 | Budget management, investing |
| Beginner Investors | Any | Clarity, trust, guidance |

---

## 📊 Success Metrics (KPIs)

- **User Acquisition:** 10K users in 3 months
- **Daily Active Users:** 60%
- **30-day Retention:** 70%
- **Avg Investment:** ₹500/user/month
- **Learning Completion:** 50% complete 1+ module
- **Goal Achievement:** 40% achieve first goal

---

## 🗺️ Development Roadmap

### ✅ Phase 1: MVP UI (Completed)
- [x] Design system
- [x] Reusable UI components
- [x] All 8 screens (Landing, Auth, 5 tabs, AI Coach)
- [x] Mock data integration
- [x] Mock Razorpay payment integration

### 📝 Phase 2: Backend + Blockchain Foundation (3-5 months)
- [ ] Node.js server setup
- [ ] MongoDB + Redis database
- [ ] Authentication service (JWT, KYC)
- [x] **Razorpay payment gateway API integration**
- [ ] Investment APIs (Groww/Zerodha)
- [ ] Basic analytics
- [ ] **Deploy `GullakLedger.sol` on Polygon testnet**

### 🤖 Phase 3: Agentic AI + AI Audit (5-7 months)
- [ ] Python FastAPI AI service
- [ ] LangGraph multi-agent framework
- [ ] All 6 AI agents implemented
- [ ] Agent orchestration and memory
- [ ] **`GullakAIAudit.sol` — AI decision on-chain logging**

### 🔗 Phase 4: Blockchain & Advanced Features (7-9 months)
- [ ] **`GullakGoal.sol` — Smart contract goal escrow**
- [ ] **`GullakRewards.sol` — NFT achievement badges**
- [ ] **DeFi yield integration (Aave/Compound)**
- [ ] Full gamification system
- [ ] Social features (clubs, challenges)
- [ ] Advanced analytics
- [ ] Push notifications

### 🎉 Phase 5: Launch (9-12 months)
- [ ] Security audit + smart contract audit (Certik)
- [ ] Performance testing
- [ ] Beta testing (1,000 users)
- [ ] **Polygon mainnet deployment**
- [ ] App Store + Google Play submission
- [ ] Marketing launch

---

## 🔐 Security & Compliance

- **Bank-grade encryption** (AES-256 at rest, TLS 1.3 in transit)
- **SEBI-compliant** investments (registration in process)
- **KYC verification** (Aadhaar + PAN via CKYC)
- **Two-factor authentication** (OTP + TOTP)
- **Biometric login** (Face ID / Fingerprint)
- **PCI-DSS** compliant payments via Razorpay
- **Smart contract audit** (Certik / OpenZeppelin Defender)
- **AI decision audit trail** on Polygon blockchain
- **Multi-sig wallet** for admin contract operations

---

## 🤝 Contributing

This is currently a private project. For collaboration inquiries, please refer to the documentation.

---

## 📞 Support

For questions about:
- **Setup:** Check [README-FRONTEND.md](./documentation/README-FRONTEND.md)
- **Backend:** See [BACKEND-REQUIREMENTS.md](./documentation/BACKEND-REQUIREMENTS.md)
- **Features:** Review [DOCUMENTATION.md](./documentation/DOCUMENTATION.md)

---

## 📄 License

All rights reserved. © 2025 Gullak

---

## 🌟 Vision

**Empowering every young person to invest, learn, and grow their wealth - one small step at a time.**

---

**Built with 💜 for Gen-Z investors**

*Making investing accessible, fun, and rewarding for everyone.*

---

## 🎉 Current Status

✅ **Frontend:** Complete with 8 screens (Landing, Auth, 5 Main Tabs, AI Coach)
✅ **Bottom Navigation:** 4 clean tabs with visible icons
✅ **Safe Area Support:** Perfect on all devices (notches, cutouts)
✅ **Authentication:** Beautiful UI (bypass mode for demo)
📝 **Backend:** Fully documented, ready to implement
🤖 **AI Agents:** Architecture designed (6 agents)
🔗 **Blockchain:** Smart contracts designed (4 contracts on Polygon)
💼 **Business Model:** Defined and validated
📊 **Pitch Deck:** 20-slide deck prepared

**→ Ready for demo, investor presentations, and blockchain development!**
