import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  Alert,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

import Card from '@/components/ui/card';
import RazorpayCheckout from '@/components/ui/razorpay-checkout';
import GlowCard from '@/components/ui/glow-card';
import StatCounter from '@/components/ui/stat-counter';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { usePortfolio } from '@/context/portfolio-context';
import { apiService } from '@/app/services/api';
import { FontFamily } from '@/constants/fonts';

const { width } = Dimensions.get('window');

export default function InvestScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const { portfolio, refresh: refreshPortfolio, addInvestment } = usePortfolio();

  // Dynamic portfolio states
  const [weeklyStats, setWeeklyStats] = useState({ weeklyInvested: 0, weeklyRoundUps: 0, roundUpCount: 0 });
  const [autoInvestEnabled, setAutoInvestEnabled] = useState(true);

  // Payment states
  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('500');
  const [investmentType, setInvestmentType] = useState<'One-Time' | 'SIP' | 'Bonus'>('One-Time');

  useEffect(() => {
    loadInvestStats();
  }, []);

  const loadInvestStats = async () => {
    try {
      const summary = await apiService.getWeeklySummary();
      if (summary) setWeeklyStats(summary);
    } catch (e) {
      console.warn('Failed to load investment stats');
    }
  };

  const handleOpenAmountModal = (type: 'One-Time' | 'SIP' | 'Bonus') => {
    setInvestmentType(type);
    if (type === 'One-Time') setSelectedAmount('500');
    else if (type === 'SIP') setSelectedAmount('1000');
    else setSelectedAmount('250');
    setAmountModalVisible(true);
  };

  const handleProceedToPayment = () => {
    const amt = parseFloat(selectedAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid investment amount.');
      return;
    }
    setAmountModalVisible(false);
    setTimeout(() => {
      setCheckoutVisible(true);
    }, 150);
  };

  const handlePaymentSuccess = async (paymentId: string, txHash: string) => {
    const amt = parseFloat(selectedAmount);
    setCheckoutVisible(false);

    // Call context callback to optimize UI
    addInvestment(amt, { indexFunds: 60, digitalGold: 30, bonds: 10 });

    Alert.alert(
      'Investment Successful! 🎉',
      `You invested ₹${amt.toLocaleString('en-IN')} successfully.\n\nRazorpay ID: ${paymentId}\nPolygon Tx Hash: ${txHash.slice(0, 10)}...${txHash.slice(-6)}\n\nYour portfolio will be updated.`,
      [{ text: 'Great!', onPress: () => { refreshPortfolio(); loadInvestStats(); } }]
    );
  };

  const totalInvested = portfolio?.summary?.totalInvested ?? 0;
  const currentValue = portfolio?.summary?.currentValue ?? 0;
  const returnsValue = currentValue - totalInvested;
  const returnsPercent = totalInvested > 0 ? (returnsValue / totalInvested) * 100 : 0;
  const isPositive = returnsValue >= 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Hero Area */}
        <LinearGradient
          colors={['#0D1128', '#1A1040', '#0D1128']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Investment Hub</Text>

          {/* Core Balance Card */}
          <View style={styles.totalCard}>
            <View style={styles.totalHeader}>
              <Text style={styles.totalLabel}>Total Portfolio Value</Text>
              <View style={[styles.verifiedBadge, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="shield-checkmark" size={12} color={colors.success} />
                <Text style={[styles.verifiedText, { color: colors.success }]}>On-Chain</Text>
              </View>
            </View>
            <StatCounter
              value={currentValue}
              prefix="₹"
              style={styles.totalValue}
              color="#FFFFFF"
              fontSize={36}
              fontFamily={FontFamily.heading}
            />
            <View style={styles.totalStats}>
              <View style={styles.totalStatItem}>
                <Text style={styles.totalStatLabel}>Total Invested</Text>
                <Text style={styles.totalStatValue}>₹{totalInvested.toLocaleString('en-IN')}</Text>
              </View>
              <View style={[styles.totalStatDivider, { backgroundColor: 'rgba(255, 255, 255, 0.15)' }]} />
              <View style={styles.totalStatItem}>
                <Text style={styles.totalStatLabel}>Returns</Text>
                <Text style={[styles.totalStatValue, { color: isPositive ? '#00FFB3' : '#FF4D6D' }]}>
                  {isPositive ? '+' : ''}₹{Math.abs(returnsValue).toLocaleString('en-IN')} ({returnsPercent.toFixed(1)}%)
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* This Month's Activity Performance Grid */}
        <View style={styles.sectionPad}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Saving Stats</Text>
          <View style={styles.performanceGrid}>
            <Card style={StyleSheet.flatten([styles.performanceCard, { backgroundColor: colors.surface, borderColor: colors.border }])}>
              <Ionicons name="repeat" size={22} color={colors.primary} />
              <Text style={[styles.perfLabel, { color: colors.textSecondary }]}>Round-Ups</Text>
              <Text style={[styles.perfVal, { color: colors.text }]}>₹{weeklyStats.weeklyRoundUps}</Text>
            </Card>
            <Card style={StyleSheet.flatten([styles.performanceCard, { backgroundColor: colors.surface, borderColor: colors.border }])}>
              <Ionicons name="flash" size={22} color="#FFD166" />
              <Text style={[styles.perfLabel, { color: colors.textSecondary }]}>Save Rate</Text>
              <Text style={[styles.perfVal, { color: colors.text }]}>{weeklyStats.roundUpCount} daily</Text>
            </Card>
          </View>
        </View>

        {/* Investment Action Options */}
        <View style={styles.sectionPad}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Investments</Text>
          <GlowCard glowColor={colors.primary} style={{ marginBottom: 12 }}>
            <TouchableOpacity
              style={[styles.actionRow, { backgroundColor: colors.surface }]}
              onPress={() => handleOpenAmountModal('One-Time')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '15' }]}>
                <Ionicons name="cash-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>One-Time Investment</Text>
                <Text style={[styles.actionSub, { color: colors.textSecondary }]}>Inject instant savings into portfolio</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </GlowCard>

          <GlowCard glowColor={colors.secondary} style={{ marginBottom: 12 }}>
            <TouchableOpacity
              style={[styles.actionRow, { backgroundColor: colors.surface }]}
              onPress={() => handleOpenAmountModal('SIP')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary + '15' }]}>
                <Ionicons name="repeat-outline" size={22} color={colors.secondary} />
              </View>
              <View style={styles.actionInfo}>
                <Text style={[styles.actionTitle, { color: colors.text }]}>SIP / Auto-Invest</Text>
                <Text style={[styles.actionSub, { color: colors.textSecondary }]}>Set weekly or monthly savings plan</Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
          </GlowCard>
        </View>

        {/* Allocation Visualizer */}
        {portfolio && (
          <View style={styles.sectionPad}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Allocated Instruments</Text>
            <View style={[styles.allocCard, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
              <View style={styles.allocHeader}>
                <Text style={[styles.allocTitle, { color: colors.text }]}>Conservative Allocation</Text>
                <Text style={[styles.allocDesc, { color: colors.textSecondary }]}>60% Equity · 30% Gold · 10% Bonds</Text>
              </View>
              <View style={[styles.progressBarBg, { backgroundColor: colors.surfaceVariant }]}>
                <View style={[styles.progressSegment, { width: '60%', backgroundColor: colors.primary }]} />
                <View style={[styles.progressSegment, { width: '30%', backgroundColor: '#FFD166' }]} />
                <View style={[styles.progressSegment, { width: '10%', backgroundColor: '#00D4AA' }]} />
              </View>
              <View style={styles.allocRow}>
                <View style={styles.allocItem}>
                  <View style={[styles.allocDot, { backgroundColor: colors.primary }]} />
                  <Text style={[styles.allocText, { color: colors.text }]}>Index Funds</Text>
                </View>
                <View style={styles.allocItem}>
                  <View style={[styles.allocDot, { backgroundColor: '#FFD166' }]} />
                  <Text style={[styles.allocText, { color: colors.text }]}>Gold</Text>
                </View>
                <View style={styles.allocItem}>
                  <View style={[styles.allocDot, { backgroundColor: '#00D4AA' }]} />
                  <Text style={[styles.allocText, { color: colors.text }]}>Bonds</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── AMOUNT MODAL ── */}
      <Modal visible={amountModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Configure {investmentType} Investment
            </Text>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Amount (₹)</Text>
            <TextInput
              value={selectedAmount}
              onChangeText={setSelectedAmount}
              placeholder="e.g. 500"
              keyboardType="numeric"
              placeholderTextColor={colors.textTertiary}
              style={[styles.textField, { color: colors.text, backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => setAmountModalVisible(false)}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primary }]}
                onPress={handleProceedToPayment}
              >
                <Text style={styles.saveBtnText}>Proceed to Pay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── RAZORPAY CHECKOUT ── */}
      <RazorpayCheckout
        visible={checkoutVisible}
        amount={parseFloat(selectedAmount)}
        onSuccess={handlePaymentSuccess}
        onClose={() => setCheckoutVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 40,
    paddingHorizontal: Spacing.md,
  },
  headerTitle: {
    fontSize: 26,
    color: '#FFFFFF',
    fontFamily: FontFamily.heading,
    marginBottom: 20,
  },
  totalCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BorderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(155, 133, 255, 0.2)',
  },
  totalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: FontFamily.body,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: FontFamily.bodySemi,
  },
  totalValue: {
    fontFamily: FontFamily.heading,
    marginBottom: 16,
  },
  totalStats: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  totalStatItem: { flex: 1 },
  totalStatLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.5)',
    fontFamily: FontFamily.body,
    marginBottom: 2,
  },
  totalStatValue: {
    fontSize: 14,
    fontFamily: FontFamily.headingSemi,
    color: '#FFFFFF',
  },
  totalStatDivider: {
    width: 0.5,
  },
  sectionPad: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FontFamily.headingSemi,
    marginBottom: 12,
  },
  performanceGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  performanceCard: {
    flex: 1,
    padding: 16,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  perfLabel: {
    fontSize: 11,
    fontFamily: FontFamily.body,
  },
  perfVal: {
    fontSize: 16,
    fontFamily: FontFamily.headingSemi,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.lg,
    gap: 12,
  },
  actionIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: { flex: 1, gap: 2 },
  actionTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bodySemi,
  },
  actionSub: {
    fontSize: 11,
    fontFamily: FontFamily.body,
  },
  allocCard: {
    padding: 18,
    borderRadius: BorderRadius.lg,
    gap: 14,
  },
  allocHeader: { gap: 4 },
  allocTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bodySemi,
  },
  allocDesc: {
    fontSize: 11,
    fontFamily: FontFamily.body,
  },
  progressBarBg: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  progressSegment: {
    height: 8,
  },
  allocRow: {
    flexDirection: 'row',
    gap: 16,
  },
  allocItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  allocDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  allocText: {
    fontSize: 12,
    fontFamily: FontFamily.bodyMedium,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FontFamily.heading,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: FontFamily.bodyMedium,
    marginBottom: 8,
  },
  textField: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: FontFamily.body,
    marginBottom: 20,
  },
  modalBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontFamily: FontFamily.bodySemi },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, color: '#FFF', fontFamily: FontFamily.bodySemi },
});
