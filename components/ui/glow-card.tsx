import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Springs } from '@/constants/animations';

interface GlowCardProps {
  children: React.ReactNode;
  glowColor?: string;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  gradient?: readonly [string, string, ...string[]];
  onMount?: boolean; // animate in on mount
  bordered?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

export default function GlowCard({
  children,
  glowColor = '#7B61FF',
  style,
  contentStyle,
  gradient,
  onMount = false,
  bordered = true,
}: GlowCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const opacity = useSharedValue(onMount ? 0 : 1);
  const translateY = useSharedValue(onMount ? 20 : 0);
  const scale = useSharedValue(onMount ? 0.96 : 1);

  useEffect(() => {
    if (onMount) {
      opacity.value = withTiming(1, { duration: 400 });
      translateY.value = withSpring(0, Springs.gentle);
      scale.value = withSpring(1, Springs.gentle);
    }
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
  }));

  const glowShadow = {
    shadowColor: glowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: colorScheme === 'dark' ? 0.35 : 0.12,
    shadowRadius: 20,
    elevation: 10,
  };

  const inner = gradient ? (
    <LinearGradient
      colors={gradient}
      style={[styles.inner, contentStyle]}
    >
      {children}
    </LinearGradient>
  ) : (
    <View style={[styles.inner, { backgroundColor: colors.surface }, contentStyle]}>
      {children}
    </View>
  );

  return (
    <AnimatedView style={[
      styles.card,
      glowShadow,
      bordered && { borderWidth: 1, borderColor: glowColor + '25' },
      { borderRadius: BorderRadius.lg },
      style,
      animStyle,
    ]}>
      {inner}
    </AnimatedView>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  inner: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
});
