# 📱 Gullak Frontend - Setup & Development Guide

Welcome to the **Gullak** frontend! This is a React Native application built with Expo and designed for Gen-Z micro-investing.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (Mac only) or Android Emulator

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Install Additional Required Packages** (if not already installed)
   ```bash
   npm install expo-blur react-native-safe-area-context
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Run on Platform**
   - **iOS**: Press `i` or run `npm run ios`
   - **Android**: Press `a` or run `npm run android`
   - **Web**: Press `w` or run `npm run web`

---

## 📁 Project Structure

```
Gullak/
├── app/                          # App screens using Expo Router
│   ├── (tabs)/                  # Tab-based navigation
│   │   ├── _layout.tsx          # Tab navigator configuration
│   │   ├── index.tsx            # Home/Dashboard screen
│   │   ├── invest.tsx           # Investment screen
│   │   ├── goals.tsx            # Goals screen
│   │   ├── learn.tsx            # Learning/Education screen
│   │   └── profile.tsx          # Profile & settings screen
│   ├── _layout.tsx              # Root layout
│   └── modal.tsx                # Modal example
│
├── components/                   # Reusable components
│   ├── ui/                      # UI components
│   │   ├── button.tsx           # Custom button
│   │   ├── card.tsx             # Card component
│   │   ├── input.tsx            # Text input
│   │   ├── progress-bar.tsx    # Progress bar
│   │   ├── badge.tsx            # Badge component
│   │   └── tab-bar-background.tsx
│   └── ...                      # Other components
│
├── constants/                    # Constants & config
│   └── theme.ts                 # Theme configuration (colors, typography, spacing)
│
├── hooks/                        # Custom React hooks
│   ├── use-color-scheme.ts      # Color scheme hook
│   └── ...
│
├── assets/                       # Images, fonts, etc.
│   └── images/
│
├── DOCUMENTATION.md              # Full project documentation
├── BACKEND-REQUIREMENTS.md       # Backend API specifications
└── README-FRONTEND.md            # This file
```

---

## 🎨 Design System

### Theme
All design tokens are centralized in `constants/theme.ts`:

**Colors:**
- Primary: `#6C63FF` (Vibrant Purple)
- Secondary: `#FF6584` (Coral Pink)
- Success: `#4CAF50` (Green)
- Warning: `#FFA726` (Orange)
- Error: `#F44336` (Red)

**Typography:**
- Font sizes: xs (12px) to 4xl (36px)
- Font weights: regular, medium, semibold, bold

**Spacing:**
- xs (4px), sm (8px), md (16px), lg (24px), xl (32px), 2xl (40px), 3xl (48px)

**Border Radius:**
- sm (8px), md (12px), lg (16px), xl (24px), full (9999px)

### Using the Theme

```typescript
import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

function MyComponent() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <View style={{ 
      backgroundColor: colors.primary,
      padding: Spacing.md,
      borderRadius: BorderRadius.lg 
    }}>
      <Text style={{ 
        color: colors.text,
        fontSize: Typography.fontSize.lg 
      }}>
        Hello Gullak!
      </Text>
    </View>
  );
}
```

---

## 🧩 UI Components

### Button
```typescript
import Button from '@/components/ui/button';

<Button
  title="Invest Now"
  variant="primary"        // primary | secondary | outline | ghost
  size="md"                // sm | md | lg
  fullWidth={false}
  loading={false}
  disabled={false}
  onPress={() => {}}
  icon={<Icon name="add" />}
/>
```

### Card
```typescript
import Card from '@/components/ui/card';

<Card 
  variant="default"        // default | elevated | outlined
  padding={16}
  onPress={() => {}}       // Optional: makes it touchable
>
  <Text>Card Content</Text>
</Card>
```

### Input
```typescript
import Input from '@/components/ui/input';

<Input
  label="Email"
  placeholder="Enter your email"
  value={email}
  onChangeText={setEmail}
  error="Invalid email"
  keyboardType="email-address"
  secureTextEntry={false}
  leftIcon={<Icon name="mail" />}
/>
```

### ProgressBar
```typescript
import ProgressBar from '@/components/ui/progress-bar';

<ProgressBar
  progress={60}            // 0-100
  height={8}
  color="#6C63FF"
  showGradient={false}
/>
```

### Badge
```typescript
import Badge from '@/components/ui/badge';

<Badge
  label="New"
  variant="primary"        // primary | secondary | success | warning | error | info
  size="md"                // sm | md | lg
/>
```

---

## 📱 Screens Overview

### 1. Home (Dashboard)
**File:** `app/(tabs)/index.tsx`

**Features:**
- Portfolio value display
- Quick action buttons
- Active goals preview
- Recent activity
- Learning streak

### 2. Invest
**File:** `app/(tabs)/invest.tsx`

**Features:**
- Monthly investment stats
- Round-up toggle and settings
- Manual investment button
- Auto-invest configuration
- Investment allocation (pie chart)

### 3. Goals
**File:** `app/(tabs)/goals.tsx`

**Features:**
- Goals summary stats
- Active goals list with progress bars
- Goal creation button
- Contribution tracking

### 4. Learn
**File:** `app/(tabs)/learn.tsx`

**Features:**
- Learning streak tracker
- XP progress bar
- Recent badges
- Lesson list (with categories, duration, points)
- Quiz completion status

### 5. Profile
**File:** `app/(tabs)/profile.tsx`

**Features:**
- User info display
- KYC verification status
- Portfolio, streak, and level stats
- Settings menu (Account, Banks, Notifications, Security, Help)
- Logout option

---

## 🔄 Navigation

This app uses **Expo Router** with file-based routing.

### Tab Navigation
Defined in `app/(tabs)/_layout.tsx`:
- Home
- Invest
- Goals
- Learn
- Profile

### Adding a New Screen

1. **Create file** in `app/(tabs)/new-screen.tsx`
2. **Update** `app/(tabs)/_layout.tsx`:
```typescript
<Tabs.Screen
  name="new-screen"
  options={{
    title: 'New Screen',
    tabBarIcon: ({ color }) => <IconSymbol name="star" color={color} />,
  }}
/>
```

---

## 🎯 Next Steps (To Implement)

### Phase 1: Complete UI ✅
- [x] Setup theme system
- [x] Create reusable UI components
- [x] Build main screens (Home, Invest, Goals, Learn, Profile)

### Phase 2: State Management
- [ ] Install Zustand or Redux Toolkit
- [ ] Create stores for user, portfolio, goals, learning
- [ ] Add mock data for testing

### Phase 3: API Integration
- [ ] Setup Axios or React Query
- [ ] Create API client
- [ ] Connect screens to backend APIs
- [ ] Handle loading and error states

### Phase 4: Authentication
- [ ] Create onboarding screens
- [ ] Implement login/signup flow
- [ ] Add OTP verification
- [ ] Protected routes

### Phase 5: Advanced Features
- [ ] Charts (Victory Native or React Native Chart Kit)
- [ ] Animations (React Native Reanimated)
- [ ] Push notifications
- [ ] AI chatbot modal
- [ ] Goal creation modal
- [ ] Investment allocation modal

### Phase 6: Polish
- [ ] Dark mode implementation
- [ ] Accessibility improvements
- [ ] Performance optimization
- [ ] Error boundaries
- [ ] Loading states
- [ ] Empty states

---

## 🛠️ Recommended Packages

### Charts & Visualizations
```bash
npm install victory-native react-native-svg
# OR
npm install react-native-chart-kit
```

### State Management
```bash
npm install zustand
# OR
npm install @reduxjs/toolkit react-redux
```

### API Client
```bash
npm install axios
# OR
npm install @tanstack/react-query
```

### Forms
```bash
npm install react-hook-form zod
```

### Animations
```bash
npm install react-native-reanimated
npm install lottie-react-native
```

---

## 📊 Mock Data

For development, you can create mock data files:

```typescript
// data/mockData.ts
export const mockPortfolio = {
  totalInvested: 5000,
  currentValue: 5250,
  returns: 250,
  returnPercentage: 5.0,
  holdings: [
    { type: 'Index Funds', amount: 3000, percentage: 57.14 },
    { type: 'Digital Gold', amount: 1500, percentage: 28.57 },
    { type: 'Bonds', amount: 750, percentage: 14.29 },
  ],
};

export const mockGoals = [
  {
    id: 1,
    emoji: '📱',
    title: 'New iPhone',
    current: 15000,
    target: 30000,
    progress: 50,
  },
  // ... more goals
];
```

---

## 🐛 Troubleshooting

### Common Issues

1. **"Cannot find module '@/components/...'"**
   - Make sure `tsconfig.json` has proper path mapping
   - Restart development server

2. **"Invariant Violation: Module AppRegistry is not a registered callable module"**
   - Clear cache: `npx expo start -c`

3. **Icons not showing**
   - Make sure `@expo/vector-icons` is installed
   - Check icon name exists in Ionicons

4. **Dark mode not working**
   - Check `useColorScheme` hook is properly imported
   - Verify theme colors are defined for both light and dark modes

---

## 📚 Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Navigation](https://reactnavigation.org/)
- [Ionicons](https://ionic.io/ionicons)

---

## 🤝 Contributing

When adding new features:

1. Follow the existing code structure
2. Use the theme system for colors and spacing
3. Create reusable components when possible
4. Add proper TypeScript types
5. Test on both iOS and Android

---

## 📝 Notes

- **Theme File**: All design tokens in `constants/theme.ts`
- **Mock Data**: Use mock data until backend is ready
- **Icons**: Using Ionicons from `@expo/vector-icons`
- **Navigation**: File-based routing with Expo Router
- **Styling**: StyleSheet.create for performance

---

**Happy Coding! 🚀💜**

*Built with ❤️ for Gen-Z investors*
