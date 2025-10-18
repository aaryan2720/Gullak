import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, TextStyle, View, ViewStyle } from 'react-native';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export default function Badge({
  label,
  variant = 'primary',
  size = 'md',
  style,
  textStyle,
}: BadgeProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const getBadgeStyle = (): ViewStyle => {
    const sizeStyles = {
      sm: {
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.sm,
      },
      md: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        borderRadius: BorderRadius.md,
      },
      lg: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        borderRadius: BorderRadius.lg,
      },
    };

    const variantStyles = {
      primary: { backgroundColor: `${colors.primary}20`, borderColor: colors.primary },
      secondary: { backgroundColor: `${colors.secondary}20`, borderColor: colors.secondary },
      success: { backgroundColor: `${colors.success}20`, borderColor: colors.success },
      warning: { backgroundColor: `${colors.warning}20`, borderColor: colors.warning },
      error: { backgroundColor: `${colors.error}20`, borderColor: colors.error },
      info: { backgroundColor: `${colors.info}20`, borderColor: colors.info },
    };

    return {
      ...sizeStyles[size],
      ...variantStyles[variant],
      borderWidth: 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const sizeTextStyles = {
      sm: { fontSize: Typography.fontSize.xs },
      md: { fontSize: Typography.fontSize.sm },
      lg: { fontSize: Typography.fontSize.base },
    };

    const variantTextStyles = {
      primary: { color: colors.primary },
      secondary: { color: colors.secondary },
      success: { color: colors.success },
      warning: { color: colors.warning },
      error: { color: colors.error },
      info: { color: colors.info },
    };

    return {
      ...sizeTextStyles[size],
      ...variantTextStyles[variant],
      fontWeight: Typography.fontWeight.semibold,
    };
  };

  return (
    <View style={[getBadgeStyle(), style]}>
      <Text style={[getTextStyle(), textStyle]}>{label}</Text>
    </View>
  );
}
