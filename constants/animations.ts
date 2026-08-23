/**
 * Gullak Animation Presets — powered by react-native-reanimated
 * These presets define consistent motion language across the app.
 */
import { Easing } from 'react-native-reanimated';

// Spring configs for Reanimated withSpring()
export const Springs = {
  // Gentle bounce for cards appearing
  gentle: { damping: 20, stiffness: 180, mass: 0.8 },
  // Snappy button press feedback
  snappy: { damping: 22, stiffness: 400, mass: 0.6 },
  // Modal/sheet slide-up
  modal: { damping: 28, stiffness: 220, mass: 1.0 },
  // Number counters
  counter: { damping: 35, stiffness: 300, mass: 0.7 },
};

// Timing configs for Reanimated withTiming()
export const Timings = {
  fadeIn: { duration: 300 },
  fadeOut: { duration: 200 },
  slideUp: { duration: 400, easing: Easing.out(Easing.cubic) },
  slideDown: { duration: 300, easing: Easing.in(Easing.cubic) },
  press: { duration: 100 },
  skeleton: { duration: 1200 },
};

// Stagger delays for list items
export const Stagger = {
  short: 50,   // fast list reveals
  medium: 80,  // standard list items
  long: 120,   // hero content
};

// Pulse animation values for AI agent
export const PulseValues = {
  min: 0.9,
  max: 1.08,
  duration: 1800,
};
