/**
 * Grow-Z Theme Configuration - Gen-Z Friendly Design System
 * Below are the colors, typography, spacing, and other design tokens used throughout the app.
 */

import { Platform } from 'react-native';

export const Colors = {
  light: {
    // Primary Colors
    primary: '#6C63FF',        // Vibrant Purple
    primaryLight: '#8F88FF',   // Lighter Purple
    primaryDark: '#4A42D6',    // Darker Purple
    
    // Secondary Colors
    secondary: '#FF6584',       // Coral Pink
    secondaryLight: '#FF8AA3',  // Lighter Pink
    secondaryDark: '#E04869',   // Darker Pink
    
    // Accent Colors
    accent: '#4CAF50',          // Success Green
    accentLight: '#6FBF73',     // Lighter Green
    accentDark: '#388E3C',      // Darker Green
    
    // Functional Colors
    success: '#4CAF50',
    warning: '#FFA726',
    error: '#F44336',
    info: '#2196F3',
    
    // Neutrals
    background: '#F5F7FA',      // Light Gray Background
    surface: '#FFFFFF',         // White Surface
    surfaceVariant: '#F0F2F5',  // Light Gray Variant
    
    // Text
    text: '#1A1A1A',           // Almost Black
    textSecondary: '#757575',   // Gray
    textTertiary: '#A0A0A0',    // Light Gray
    textInverse: '#FFFFFF',     // White
    
    // Borders & Dividers
    border: '#E0E0E0',
    divider: '#EEEEEE',
    
    // Tab Bar
    tint: '#6C63FF',
    icon: '#757575',
    tabIconDefault: '#A0A0A0',
    tabIconSelected: '#6C63FF',
    
    // Investment Colors
    investment: {
      equity: '#6C63FF',
      debt: '#FF6584',
      gold: '#FFD700',
      bonds: '#4CAF50',
    },
    
    // Goal Categories
    goals: {
      gadgets: '#6C63FF',
      travel: '#FF6584',
      education: '#4CAF50',
      emergency: '#F44336',
      custom: '#FFA726',
    },
  },
  dark: {
    // Primary Colors
    primary: '#8F88FF',        // Lighter Purple for dark mode
    primaryLight: '#A8A2FF',
    primaryDark: '#6C63FF',
    
    // Secondary Colors
    secondary: '#FF8AA3',       // Lighter Pink for dark mode
    secondaryLight: '#FFA3B8',
    secondaryDark: '#FF6584',
    
    // Accent Colors
    accent: '#6FBF73',          // Lighter Green for dark mode
    accentLight: '#8FCC93',
    accentDark: '#4CAF50',
    
    // Functional Colors
    success: '#6FBF73',
    warning: '#FFB74D',
    error: '#E57373',
    info: '#64B5F6',
    
    // Neutrals
    background: '#121212',      // Dark Background
    surface: '#1E1E1E',         // Dark Surface
    surfaceVariant: '#2C2C2C',  // Dark Gray Variant
    
    // Text
    text: '#FFFFFF',           // White
    textSecondary: '#B0B0B0',   // Light Gray
    textTertiary: '#808080',    // Medium Gray
    textInverse: '#1A1A1A',     // Almost Black
    
    // Borders & Dividers
    border: '#333333',
    divider: '#2C2C2C',
    
    // Tab Bar
    tint: '#8F88FF',
    icon: '#B0B0B0',
    tabIconDefault: '#808080',
    tabIconSelected: '#8F88FF',
    
    // Investment Colors
    investment: {
      equity: '#8F88FF',
      debt: '#FF8AA3',
      gold: '#FFD700',
      bonds: '#6FBF73',
    },
    
    // Goal Categories
    goals: {
      gadgets: '#8F88FF',
      travel: '#FF8AA3',
      education: '#6FBF73',
      emergency: '#E57373',
      custom: '#FFB74D',
    },
  },
};

// Gradients
export const Gradients = {
  primary: ['#667eea', '#764ba2'],
  success: ['#11998e', '#38ef7d'],
  gold: ['#f093fb', '#f5576c'],
  sunset: ['#FF6584', '#FFA726'],
  ocean: ['#2196F3', '#00BCD4'],
  purple: ['#6C63FF', '#4A42D6'],
};

// Typography
export const Typography = {
  fontFamily: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
    mono: 'Courier',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
  },
  fontWeight: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

// Spacing
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Shadows
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  xl: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
};

// Animation Durations
export const Animation = {
  fast: 150,
  normal: 300,
  slow: 500,
};

// Screen Breakpoints
export const Breakpoints = {
  sm: 375,
  md: 768,
  lg: 1024,
};

// Icon Sizes
export const IconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export default {
  Colors,
  Gradients,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
  Animation,
  Breakpoints,
  IconSizes,
  Fonts,
};

