import React, { useEffect } from 'react';
import { Text, TextStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Springs } from '@/constants/animations';

interface StatCounterProps {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  style?: TextStyle;
  fontSize?: number;
  color?: string;
  fontFamily?: string;
}

export default function StatCounter({
  value,
  prefix = '',
  suffix = '',
  decimals = 0,
  duration = 1200,
  style,
  fontSize = 32,
  color = '#FFFFFF',
  fontFamily,
}: StatCounterProps) {
  const animatedValue = useSharedValue(0);
  const [displayValue, setDisplayValue] = React.useState(0);

  useEffect(() => {
    animatedValue.value = withTiming(value, { duration }, (finished) => {
      if (finished) runOnJS(setDisplayValue)(value);
    });

    // Update display value at 60fps during animation
    let start = 0;
    const step = value / (duration / 16);
    const interval = setInterval(() => {
      start = Math.min(start + step, value);
      runOnJS(setDisplayValue)(start);
      if (start >= value) clearInterval(interval);
    }, 16);

    return () => clearInterval(interval);
  }, [value]);

  const formatted = decimals > 0
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toLocaleString('en-IN');

  return (
    <Text style={[{ fontSize, color, fontFamily }, style]}>
      {prefix}{formatted}{suffix}
    </Text>
  );
}
