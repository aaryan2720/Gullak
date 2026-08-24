import React, { useRef } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { FontFamily } from '@/constants/fonts';

// Merchant → icon mapping
const MERCHANT_ICONS: Record<string, { icon: string; color: string }> = {
  zomato:    { icon: 'restaurant',    color: '#E23744' },
  swiggy:    { icon: 'fast-food',     color: '#FC8019' },
  amazon:    { icon: 'cart',          color: '#FF9900' },
  flipkart:  { icon: 'bag',           color: '#2874F0' },
  uber:      { icon: 'car',           color: '#000000' },
  ola:       { icon: 'car-outline',   color: '#3AB546' },
  netflix:   { icon: 'play-circle',   color: '#E50914' },
  spotify:   { icon: 'musical-notes', color: '#1DB954' },
  paytm:     { icon: 'phone-portrait',color: '#00BAF2' },
  phonepe:   { icon: 'phone-portrait',color: '#5F259F' },
  gpay:      { icon: 'phone-portrait',color: '#4285F4' },
  bigbasket: { icon: 'leaf',          color: '#84C225' },
  dunzo:     { icon: 'bicycle',       color: '#00C4B4' },
  blinkit:   { icon: 'flash',         color: '#FFD200' },
};

function getMerchantIcon(merchant: string): { icon: string; color: string } {
  const key = merchant.toLowerCase().replace(/\s+/g, '');
  for (const [name, val] of Object.entries(MERCHANT_ICONS)) {
    if (key.includes(name)) return val;
  }
  return { icon: 'storefront-outline', color: '#7B61FF' };
}

export interface RoundUpCardProps {
  id: string;
  merchant: string;
  originalAmount: number;
  roundUpDelta: number;
  bankName?: string;
  createdAt?: string;
  onApprove: (id: string) => void;
  onSkip: (id: string) => void;
  isLoading?: boolean;
}

export default function RoundUpCard({
  id,
  merchant,
  originalAmount,
  roundUpDelta,
  bankName,
  createdAt,
  onApprove,
  onSkip,
  isLoading = false,
}: RoundUpCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const { icon, color: merchantColor } = getMerchantIcon(merchant);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleApprove = () => {
    Animated.sequence([
      Animated.timing(slideAnim, { toValue: -10, duration: 100, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
    ]).start(() => onApprove(id));
  };

  const handleSkip = () => {
    Animated.timing(slideAnim, { toValue: 10, duration: 150, useNativeDriver: true }).start(() => onSkip(id));
  };

  const timeAgo = createdAt
    ? (() => {
        const diff = Date.now() - new Date(createdAt).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
      })()
    : '';

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }, { translateX: slideAnim }] }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          {
            backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
            borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          }
        ]}
      >
        {/* Left: Merchant Icon */}
        <View style={[styles.iconWrap, { backgroundColor: merchantColor + '20' }]}>
          <Ionicons name={icon as any} size={22} color={merchantColor} />
        </View>

        {/* Middle: Details */}
        <View style={styles.details}>
          <Text style={[styles.merchant, { color: colors.text }]} numberOfLines={1}>
            {merchant}
          </Text>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            ₹{originalAmount.toFixed(2)} spent{bankName ? ` · ${bankName}` : ''}{timeAgo ? ` · ${timeAgo}` : ''}
          </Text>
        </View>

        {/* Right: Delta + Actions */}
        <View style={styles.rightSection}>
          <View style={styles.deltaWrap}>
            <Text style={styles.deltaSymbol}>+</Text>
            <Text style={styles.deltaAmount}>₹{roundUpDelta}</Text>
          </View>

          <View style={styles.actions}>
            {/* Skip */}
            <TouchableOpacity
              onPress={handleSkip}
              disabled={isLoading}
              style={[styles.actionBtn, styles.skipBtn]}
            >
              <Ionicons name="close" size={14} color="#FF6B6B" />
            </TouchableOpacity>

            {/* Approve */}
            <TouchableOpacity
              onPress={handleApprove}
              disabled={isLoading}
              style={[styles.actionBtn, styles.approveBtn]}
            >
              <Ionicons name="checkmark" size={14} color="#00D4AA" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  details: {
    flex: 1,
    gap: 3,
  },
  merchant: {
    fontFamily: FontFamily.headingSemi,
    fontSize: 14,
  },
  meta: {
    fontFamily: FontFamily.body,
    fontSize: 12,
  },
  rightSection: {
    alignItems: 'flex-end',
    gap: 8,
  },
  deltaWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deltaSymbol: {
    fontFamily: FontFamily.heading,
    fontSize: 13,
    color: '#00D4AA',
  },
  deltaAmount: {
    fontFamily: FontFamily.heading,
    fontSize: 16,
    color: '#00D4AA',
  },
  actions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skipBtn: {
    backgroundColor: 'rgba(255,107,107,0.15)',
  },
  approveBtn: {
    backgroundColor: 'rgba(0,212,170,0.15)',
  },
});
