import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface ProgressBarProps {
  progress: number; // 0-100
  height?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  showGradient?: boolean;
}

export default function ProgressBar({
  progress,
  height = 8,
  color,
  backgroundColor,
  style,
  showGradient = false,
}: ProgressBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const progressValue = Math.min(100, Math.max(0, progress));

  return (
    <View
      style={[
        styles.container,
        {
          height,
          backgroundColor: backgroundColor || colors.divider,
          borderRadius: height / 2,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.progress,
          {
            width: `${progressValue}%`,
            height,
            backgroundColor: color || colors.primary,
            borderRadius: height / 2,
          },
          showGradient && styles.gradient,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  progress: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  gradient: {
    // Gradient effect can be added with react-native-linear-gradient if needed
  },
});
