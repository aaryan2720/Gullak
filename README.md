# 💜 Gullak - Micro-Investing App for Gen-Z

> **"Pocket-sized Investing for Gen Z"**

Gullak is a revolutionary micro-investing and financial education platform designed specifically for young adults (Gen-Z and early millennials) who want to start investing but face barriers like complexity, limited funds, and lack of knowledge.

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

### Frontend (Implemented)
- **Framework:** React Native (Expo)
- **Language:** TypeScript
- **Navigation:** Expo Router
- **UI:** Custom component library
- **Icons:** Ionicons

### Backend (Documented, To Implement)
- **Server:** Node.js + Express
- **Database:** MongoDB + Redis
- **AI:** Python (FastAPI) + LangGraph
- **Payments:** Razorpay
- **Investment APIs:** Groww, Zerodha
- **Auth:** JWT + OAuth 2.0

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
- [x] All 5 main screens
- [x] Mock data integration

### 📝 Phase 2: Backend (Next - 3-5 months)
- [ ] Node.js server setup
- [ ] MongoDB database
- [ ] Authentication service
- [ ] Payment integration
- [ ] Investment APIs
- [ ] Basic analytics

### 🤖 Phase 3: Agentic AI (5-7 months)
- [ ] Python AI service
- [ ] LangGraph framework
- [ ] All 6 AI agents
- [ ] Agent orchestration

### 🚀 Phase 4: Advanced Features (7-9 months)
- [ ] Gamification system
- [ ] Social features
- [ ] Advanced analytics
- [ ] Push notifications

### 🎉 Phase 5: Launch (9-12 months)
- [ ] Security audit
- [ ] Beta testing
- [ ] App store submission
- [ ] Marketing launch

---

## 🔐 Security & Compliance

- **Bank-grade encryption** (AES-256)
- **SEBI-compliant** investments
- **KYC verification**
- **Two-factor authentication**
- **Biometric login**
- **PCI-DSS** compliant payments

---

## 🤝 Contributing

This is currently a private project. For collaboration inquiries, please refer to the documentation.

---

## 📞 Support

For questions about:
- **Setup:** Check [README-FRONTEND.md](./README-FRONTEND.md)
- **Backend:** See [BACKEND-REQUIREMENTS.md](./BACKEND-REQUIREMENTS.md)
- **Features:** Review [DOCUMENTATION.md](./DOCUMENTATION.md)

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

✅ **Frontend:** Complete with 8 screens (Landing, Auth, 5 Main Tabs)
✅ **Bottom Navigation:** 4 clean tabs with visible icons
✅ **Safe Area Support:** Perfect on all devices (notches, cutouts)
✅ **Authentication:** Beautiful UI (bypass mode for demo)
📝 **Backend:** Fully documented, ready to implement
🤖 **AI Agents:** Architecture designed
💼 **Business Model:** Defined and validated

**→ Ready for demo and investor presentations!**
