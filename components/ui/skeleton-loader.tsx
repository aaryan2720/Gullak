import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius } from '@/constants/theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

function SkeletonItem({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonLoaderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const shimmer = useSharedValue(0);

  useEffect(() => {
    shimmer.value = withRepeat(
      withTiming(1, { duration: 1200 }),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(shimmer.value, [0, 0.5, 1], [0.4, 0.9, 0.4], Extrapolation.CLAMP),
  }));

  const base = isDark ? '#1C2340' : '#E8EAF2';
  const highlight = isDark ? '#252D50' : '#F5F6FC';

  return (
    <Animated.View style={[
      { width: width as any, height, borderRadius, overflow: 'hidden' },
      animatedStyle,
      style,
    ]}>
      <LinearGradient
        colors={[base, highlight, base]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={StyleSheet.absoluteFillObject}
      />
    </Animated.View>
  );
}

export function PortfolioCardSkeleton() {
  return (
    <View style={{ padding: 20, gap: 12 }}>
      <SkeletonItem width="60%" height={16} />
      <SkeletonItem width="80%" height={48} />
      <SkeletonItem width="40%" height={14} />
    </View>
  );
}

export function GoalCardSkeleton() {
  return (
    <View style={{ padding: 16, gap: 10, flexDirection: 'row', alignItems: 'center' }}>
      <SkeletonItem width={56} height={56} borderRadius={28} />
      <View style={{ flex: 1, gap: 8 }}>
        <SkeletonItem width="70%" height={14} />
        <SkeletonItem width="90%" height={8} borderRadius={4} />
        <SkeletonItem width="40%" height={12} />
      </View>
    </View>
  );
}

export function TransactionSkeleton() {
  return (
    <View style={{ padding: 16, gap: 8, flexDirection: 'row', alignItems: 'center' }}>
      <SkeletonItem width={44} height={44} borderRadius={22} />
      <View style={{ flex: 1, gap: 6 }}>
        <SkeletonItem width="60%" height={14} />
        <SkeletonItem width="40%" height={12} />
      </View>
      <SkeletonItem width={60} height={20} />
    </View>
  );
}

export function ListSkeleton({ count = 4, Skeleton = TransactionSkeleton }: { count?: number; Skeleton?: React.ComponentType }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => <Skeleton key={i} />)}
    </View>
  );
}

export default SkeletonItem;
