import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Shadows } from '@/constants/theme';
import { Springs } from '@/constants/animations';
import { FontFamily } from '@/constants/fonts';

interface TransactionCardProps {
  id: string;
  type: 'debit' | 'credit' | 'investment' | 'withdrawal';
  category: 'round_up' | 'manual' | 'auto_invest' | 'goal_contribution';
  amount: number;
  description?: string;
  merchantName?: string;
  goalTitle?: string;
  status: 'completed' | 'processing' | 'failed' | 'pending';
  blockchainVerified?: boolean;
  txHash?: string;
  createdAt: string;
  onPress?: () => void;
}

const CATEGORY_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  round_up: { icon: 'arrow-up-circle', color: '#7B61FF', label: 'Round-Up' },
  manual: { icon: 'cash', color: '#00D4AA', label: 'Investment' },
  auto_invest: { icon: 'trending-up', color: '#FFD166', label: 'Auto-Invest' },
  goal_contribution: { icon: 'flag', color: '#FF6B9D', label: 'Goal' },
};

const STATUS_CONFIG: Record<string, { color: string; label: string }> = {
  completed: { color: '#00D4AA', label: 'Done' },
  processing: { color: '#FFD166', label: 'Processing' },
  failed: { color: '#FF4D6D', label: 'Failed' },
  pending: { color: '#A0A8CC', label: 'Pending' },
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function TransactionCard({
  type,
  category,
  amount,
  description,
  merchantName,
  goalTitle,
  status,
  blockchainVerified,
  txHash,
  createdAt,
  onPress,
}: TransactionCardProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const scale = useSharedValue(1);
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.manual;
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const isCredit = type === 'credit';
  const amountColor = type === 'investment' || isCredit ? colors.success : colors.error;
  const prefix = isCredit ? '+' : '-';

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const date = new Date(createdAt);
  const dateStr = date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  const timeStr = date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

  return (
    <AnimatedTouchable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.97, Springs.snappy); }}
      onPressOut={() => { scale.value = withSpring(1, Springs.snappy); }}
      activeOpacity={1}
      style={animStyle}
    >
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        {/* Icon */}
        <View style={[styles.iconContainer, { backgroundColor: config.color + '20' }]}>
          <Ionicons name={config.icon as any} size={22} color={config.color} />
        </View>

        {/* Details */}
        <View style={styles.details}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {goalTitle || merchantName || description || config.label}
          </Text>
          <View style={styles.metaRow}>
            <Text style={[styles.meta, { color: colors.textTertiary }]}>
              {config.label} · {dateStr} {timeStr}
            </Text>
            {blockchainVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={10} color="#00D4AA" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
        </View>

        {/* Amount & Status */}
        <View style={styles.right}>
          <Text style={[styles.amount, { color: amountColor }]}>
            {prefix}₹{Math.abs(amount).toLocaleString('en-IN')}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.color + '20' }]}>
            <Text style={[styles.statusText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>
      </View>
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 14,
    fontFamily: FontFamily.bodyMedium,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  meta: {
    fontSize: 11,
    fontFamily: FontFamily.body,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: '#00D4AA15',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  verifiedText: {
    fontSize: 9,
    color: '#00D4AA',
    fontFamily: FontFamily.bodySemi,
  },
  right: {
    alignItems: 'flex-end',
    gap: 4,
  },
  amount: {
    fontSize: 15,
    fontFamily: FontFamily.bodySemi,
  },
  statusBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: FontFamily.bodyMedium,
  },
});
