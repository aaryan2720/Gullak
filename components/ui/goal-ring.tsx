import React, { useEffect } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { FontFamily } from '@/constants/fonts';

interface GoalRingProps {
  progress: number; // 0 to 1
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  children?: React.ReactNode;
  style?: ViewStyle;
  animate?: boolean;
}

export default function GoalRing({
  progress,
  size = 80,
  strokeWidth = 6,
  color = '#7B61FF',
  backgroundColor = '#1C2340',
  children,
  style,
  animate = true,
}: GoalRingProps) {
  const animatedProgress = useSharedValue(0);
  const clamped = Math.min(Math.max(progress, 0), 1);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const center = size / 2;

  useEffect(() => {
    if (animate) {
      animatedProgress.value = withTiming(clamped, { duration: 1000 });
    } else {
      animatedProgress.value = clamped;
    }
  }, [clamped]);

  // We use a View-based ring (SVG not needed) via border and rotation trick
  // For a proper ring we create arc segments using View borders
  const degrees = Math.round(clamped * 360);

  return (
    <View style={[{ width: size, height: size }, style]}>
      {/* Background ring */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: backgroundColor,
        }}
      />

      {/* Progress arc — first half (0-180 degrees) */}
      {degrees > 0 && (
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderTopColor: color,
            borderRightColor: degrees >= 90 ? color : 'transparent',
            borderBottomColor: degrees >= 180 ? color : 'transparent',
            borderLeftColor: degrees >= 270 ? color : 'transparent',
            transform: [{ rotate: '-90deg' }],
          }}
        />
      )}

      {/* Inner content */}
      <View style={[StyleSheet.absoluteFillObject, { justifyContent: 'center', alignItems: 'center' }]}>
        {children}
      </View>
    </View>
  );
}

interface GoalRingLabelProps {
  percentage: number;
  color?: string;
  size?: number;
}

export function GoalRingLabel({ percentage, color = '#7B61FF', size = 80 }: GoalRingLabelProps) {
  const fontSize = size < 64 ? 12 : size < 96 ? 14 : 18;
  return (
    <Text style={{ fontSize, color, fontFamily: FontFamily.bodySemi }}>
      {Math.round(percentage)}%
    </Text>
  );
}
