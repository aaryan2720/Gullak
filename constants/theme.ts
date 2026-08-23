/**
 * Gullak Brand Design System v2.0
 * Brand Palette: Deep Navy + Electric Violet + Neon Mint + Warm Gold
 * Dark-first design inspired by the glassmorphic clay-pot logo
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Brand Primary
    primary: '#7B61FF',         // Electric Violet
    primaryLight: '#9B85FF',
    primaryDark: '#5A3FE0',
    primaryGlow: '#7B61FF30',   // Glow effect color

    // Brand Secondary
    secondary: '#00D4AA',       // Neon Mint
    secondaryLight: '#33DEBB',
    secondaryDark: '#00A886',
    secondaryGlow: '#00D4AA25',

    // Brand Accent
    accent: '#FFD166',          // Warm Gold
    accentLight: '#FFE099',
    accentDark: '#E5A800',

    // Functional
    success: '#00D4AA',
    warning: '#FFD166',
    error: '#FF4D6D',
    info: '#4D9FFF',

    // Background system
    background: '#F2F3F8',
    backgroundSecondary: '#E8EAF2',
    surface: '#FFFFFF',
    surfaceVariant: '#F7F8FC',
    surfaceElevated: '#FFFFFF',

    // Glass surfaces
    glass: 'rgba(255,255,255,0.75)',
    glassBorder: 'rgba(123,97,255,0.15)',

    // Text
    text: '#0A0E27',
    textSecondary: '#4A4E6B',
    textTertiary: '#8E92B0',
    textInverse: '#FFFFFF',
    textMuted: '#B0B4CC',

    // Borders
    border: '#E2E5F0',
    divider: '#EEF0F8',

    // Tab Bar
    tint: '#7B61FF',
    icon: '#8E92B0',
    tabIconDefault: '#B0B4CC',
    tabIconSelected: '#7B61FF',

    // Investment asset colors
    investment: {
      equity: '#7B61FF',
      debt: '#FF4D6D',
      gold: '#FFD166',
      bonds: '#00D4AA',
    },

    // Goal category colors
    goals: {
      gadgets: '#7B61FF',
      travel: '#FF6B9D',
      education: '#00D4AA',
      emergency: '#FF4D6D',
      custom: '#FFD166',
    },

    // Chart colors (ordered for allocation charts)
    chart: ['#7B61FF', '#00D4AA', '#FFD166', '#FF4D6D', '#4D9FFF'],
  },

  dark: {
    // Brand Primary (brighter for dark)
    primary: '#9B85FF',
    primaryLight: '#B5A3FF',
    primaryDark: '#7B61FF',
    primaryGlow: '#9B85FF35',

    // Brand Secondary
    secondary: '#00FFB3',       // Brighter mint on dark
    secondaryLight: '#33FFC4',
    secondaryDark: '#00D4AA',
    secondaryGlow: '#00FFB330',

    // Brand Accent
    accent: '#FFD166',
    accentLight: '#FFE099',
    accentDark: '#E5A800',

    // Functional
    success: '#00FFB3',
    warning: '#FFD166',
    error: '#FF6B8A',
    info: '#74B9FF',

    // Background system (true deep navy)
    background: '#080C1E',
    backgroundSecondary: '#0D1128',
    surface: '#111627',
    surfaceVariant: '#171D35',
    surfaceElevated: '#1C2340',

    // Glass surfaces (key to the premium feel)
    glass: 'rgba(17,22,39,0.80)',
    glassBorder: 'rgba(155,133,255,0.20)',

    // Text
    text: '#F0F2FF',
    textSecondary: '#A0A8CC',
    textTertiary: '#6B72A0',
    textInverse: '#0A0E27',
    textMuted: '#4A5070',

    // Borders
    border: '#1E2545',
    divider: '#171D35',

    // Tab Bar
    tint: '#9B85FF',
    icon: '#6B72A0',
    tabIconDefault: '#4A5070',
    tabIconSelected: '#9B85FF',

    // Investment asset colors (vivid on dark)
    investment: {
      equity: '#9B85FF',
      debt: '#FF6B8A',
      gold: '#FFD166',
      bonds: '#00FFB3',
    },

    // Goal category colors
    goals: {
      gadgets: '#9B85FF',
      travel: '#FF6B9D',
      education: '#00FFB3',
      emergency: '#FF6B8A',
      custom: '#FFD166',
    },

    // Chart colors
    chart: ['#9B85FF', '#00FFB3', '#FFD166', '#FF6B8A', '#74B9FF'],
  },
};

// Brand gradients — used heavily across the app
export const Gradients = {
  // Primary hero gradient (home screen header)
  hero: ['#0D1128', '#1A1040', '#0D1128'] as const,

  // Card gradients
  primaryCard: ['#7B61FF', '#5A3FE0'] as const,
  mintCard: ['#00D4AA', '#00A886'] as const,
  goldCard: ['#FFD166', '#E5A800'] as const,
  redCard: ['#FF4D6D', '#C0003C'] as const,

  // Glass gradient overlays
  glassLight: ['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)'] as const,
  glassDark: ['rgba(17,22,39,0.90)', 'rgba(17,22,39,0.70)'] as const,

  // Portfolio performance gradient
  portfolioUp: ['#00D4AA', '#00FFB3'] as const,
  portfolioDown: ['#FF4D6D', '#FF6B8A'] as const,

  // Onboarding screen gradients
  onboarding1: ['#7B61FF', '#4D9FFF'] as const,
  onboarding2: ['#00D4AA', '#7B61FF'] as const,
  onboarding3: ['#FFD166', '#FF6B9D'] as const,

  // Glow for cards
  violetGlow: ['rgba(123,97,255,0.4)', 'rgba(123,97,255,0)'] as const,
  mintGlow: ['rgba(0,212,170,0.35)', 'rgba(0,212,170,0)'] as const,
  goldGlow: ['rgba(255,209,102,0.35)', 'rgba(255,209,102,0)'] as const,
};

// Shadows — tuned for dark navy backgrounds
export const Shadows = {
  sm: {
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 12,
  },
  glow: {
    shadowColor: '#7B61FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.45,
    shadowRadius: 20,
    elevation: 16,
  },
  goldGlow: {
    shadowColor: '#FFD166',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  mintGlow: {
    shadowColor: '#00D4AA',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Typography — Poppins (headings) + Inter (body)
export const Typography = {
  fontFamily: {
    heading: 'Poppins_700Bold',
    headingMedium: 'Poppins_600SemiBold',
    headingRegular: 'Poppins_500Medium',
    body: 'Inter_400Regular',
    bodyMedium: 'Inter_500Medium',
    bodySemibold: 'Inter_600SemiBold',
    mono: Platform.select({ ios: 'Courier New', android: 'monospace', default: 'monospace' }) as string,
  },
  fontSize: {
    xs: 11,
    sm: 13,
    base: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 44,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.15,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing system
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

// Border radius
export const BorderRadius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 28,
  '2xl': 40,
  full: 9999,
};

// Animation durations
export const Animation = {
  instant: 100,
  fast: 200,
  normal: 350,
  slow: 500,
  verySlow: 800,
};

// Icon sizes
export const IconSizes = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 28,
  xl: 36,
  '2xl': 48,
};

// Screen dimensions helpers
export const Breakpoints = {
  sm: 375,
  md: 414,
  lg: 768,
};

export default {
  Colors,
  Gradients,
  Shadows,
  Typography,
  Spacing,
  BorderRadius,
  Animation,
  IconSizes,
  Breakpoints,
};
