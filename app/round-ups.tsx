import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  FlatList,
  Modal,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { FontFamily } from '@/constants/fonts';
import { apiService } from '@/app/services/api';
import RoundUpCard from '@/components/ui/roundup-card';
import { createManualTransaction } from '@/app/services/sms-parser';

const TABS = ['Pending', 'History'] as const;
type Tab = typeof TABS[number];

interface RoundUp {
  _id: string;
  merchant: string;
  originalAmount: number;
  roundUpDelta: number;
  roundedAmount: number;
  bankName?: string;
  status: 'pending' | 'approved' | 'skipped' | 'invested';
  createdAt: string;
}

interface VaultData {
  vaultBalance: number;
  threshold: number;
  progress: number;
  canInvest: boolean;
  preferredVehicle: string;
  approvedCount: number;
  marketPrices: {
    niftyIndexFund: { nav: number; name: string };
    digitalGold: { pricePerGram: number; provider: string };
  };
}

export default function RoundUpsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const isDark = colorScheme === 'dark';

  const [activeTab, setActiveTab] = useState<Tab>('Pending');
  const [pending, setPending] = useState<RoundUp[]>([]);
  const [history, setHistory] = useState<RoundUp[]>([]);
  const [vault, setVault] = useState<VaultData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [showInvestSheet, setShowInvestSheet] = useState(false);
  const [manualAmount, setManualAmount] = useState('');
  const [manualMerchant, setManualMerchant] = useState('');
  const [historyStats, setHistoryStats] = useState({ totalSaved: 0, totalInvested: 0, totalRoundUps: 0 });

  const progressAnim = useRef(new Animated.Value(0)).current;

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pendingRes, vaultRes, histRes] = await Promise.all([
        apiService.getRoundUpsPending(),
        apiService.getRoundUpsVault(),
        apiService.getRoundUpsHistory(),
      ]);
      setPending(pendingRes?.roundUps || []);
      setVault(vaultRes || null);
      setHistory(histRes?.roundUps || []);
      setHistoryStats(histRes?.stats || { totalSaved: 0, totalInvested: 0, totalRoundUps: 0 });

      // Animate progress bar
      Animated.timing(progressAnim, {
        toValue: vaultRes?.progress || 0,
        duration: 800,
        useNativeDriver: false,
      }).start();
    } catch (e) {
      console.error('[RoundUps] Fetch error:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, []);

  const handleApprove = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await apiService.approveRoundUp(id);
      if (res?.roundUp) {
        setPending(prev => prev.filter(r => r._id !== id));
        setVault(res.vault);
        Animated.timing(progressAnim, {
          toValue: res.vault?.progress || 0,
          duration: 600,
          useNativeDriver: false,
        }).start();
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to approve round-up. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleSkip = async (id: string) => {
    setActionLoadingId(id);
    try {
      await apiService.skipRoundUp(id);
      setPending(prev => prev.filter(r => r._id !== id));
    } catch (e) {
      Alert.alert('Error', 'Failed to skip. Please try again.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleManualEntry = async () => {
    const amount = parseFloat(manualAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid spend amount');
      return;
    }

    const tx = createManualTransaction(amount, manualMerchant || 'Manual Entry');
    if (tx.roundUpDelta === 0) {
      Alert.alert('No Round-Up Needed', `₹${amount} is already a multiple of 10!`);
      return;
    }

    try {
      await apiService.ingestSMSTransaction({
        amount: tx.amount,
        merchant: tx.merchant,
        smsTimestamp: tx.smsTimestamp,
      });
      setManualAmount('');
      setManualMerchant('');
      setShowManualEntry(false);
      fetchData();
    } catch (e) {
      Alert.alert('Error', 'Failed to add transaction.');
    }
  };

  const handleInvest = async (vehicle: 'mutual_fund' | 'gold') => {
    setShowInvestSheet(false);
    try {
      const res = await apiService.investRoundUpVault({ vehicle });
      if (res?.amountInvested) {
        Alert.alert(
          '🎉 Investment Successful!',
          `₹${res.amountInvested.toFixed(2)} invested in ${vehicle === 'gold' ? 'Digital Gold' : 'Nifty Index Fund'}!\n\nBlockchain receipt generated.`,
          [{ text: 'Great!', onPress: fetchData }]
        );
      }
    } catch (e: any) {
      Alert.alert('Investment Failed', e?.message || 'Please try again.');
    }
  };

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#0F0F23', '#1A1A3E'] : ['#F0F0FF', '#E8E8FF']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Round-Ups</Text>
          <Text style={[styles.headerSub, { color: colors.textSecondary }]}>
            Spare change → investments
          </Text>
        </View>
        <TouchableOpacity onPress={() => setShowManualEntry(true)} style={[styles.addBtn, { backgroundColor: '#7B61FF' }]}>
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </LinearGradient>

      {/* Vault Card */}
      {vault && (
        <LinearGradient
          colors={['#7B61FF', '#5B41CF']}
          style={styles.vaultCard}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.vaultRow}>
            <View>
              <Text style={styles.vaultLabel}>Vault Balance</Text>
              <Text style={styles.vaultAmount}>₹{vault.vaultBalance.toFixed(2)}</Text>
              <Text style={styles.vaultThreshold}>Goal: ₹{vault.threshold}</Text>
            </View>
            <TouchableOpacity
              onPress={() => vault.canInvest ? setShowInvestSheet(true) : Alert.alert('Not Yet!', `Keep approving round-ups to reach ₹${vault.threshold}. You're at ₹${vault.vaultBalance.toFixed(2)}!`)}
              style={[styles.investNowBtn, { opacity: vault.canInvest ? 1 : 0.6 }]}
            >
              <Text style={styles.investNowText}>{vault.canInvest ? 'Invest Now →' : 'Keep Going!'}</Text>
            </TouchableOpacity>
          </View>

          {/* Progress bar */}
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]} />
          </View>
          <Text style={styles.progressText}>{vault.progress.toFixed(0)}% of ₹{vault.threshold} threshold</Text>
        </LinearGradient>
      )}

      {/* Stats Row */}
      <View style={[styles.statsRow, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: '#00D4AA' }]}>₹{historyStats.totalSaved.toFixed(0)}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Total Saved</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: '#7B61FF' }]}>{historyStats.totalRoundUps}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Round-Ups</Text>
        </View>
        <View style={[styles.statDivider, { backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)' }]} />
        <View style={styles.statItem}>
          <Text style={[styles.statVal, { color: '#FFD166' }]}>₹{historyStats.totalInvested.toFixed(0)}</Text>
          <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Invested</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={[styles.tabRow, { borderBottomColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={[styles.tabText, { color: activeTab === tab ? '#7B61FF' : colors.textSecondary }]}>
              {tab} {tab === 'Pending' && pending.length > 0 ? `(${pending.length})` : ''}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {isLoading ? (
        <ActivityIndicator color="#7B61FF" size="large" style={{ marginTop: 40 }} />
      ) : activeTab === 'Pending' ? (
        pending.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🪙</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No Pending Round-Ups</Text>
            <Text style={[styles.emptySub, { color: colors.textSecondary }]}>
              Tap + to add a spend manually, or enable SMS parsing to auto-detect UPI transactions.
            </Text>
            <TouchableOpacity onPress={() => setShowManualEntry(true)} style={styles.emptyBtn}>
              <Text style={styles.emptyBtnText}>Add Spend Manually</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={pending}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <RoundUpCard
                id={item._id}
                merchant={item.merchant}
                originalAmount={item.originalAmount}
                roundUpDelta={item.roundUpDelta}
                bankName={item.bankName}
                createdAt={item.createdAt}
                onApprove={handleApprove}
                onSkip={handleSkip}
                isLoading={actionLoadingId === item._id}
              />
            )}
          />
        )
      ) : (
        <FlatList
          data={history}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={[styles.historyItem, { backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)', borderColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)' }]}>
              <View style={styles.historyLeft}>
                <Text style={[styles.historyMerchant, { color: colors.text }]}>{item.merchant}</Text>
                <Text style={[styles.historyMeta, { color: colors.textSecondary }]}>₹{item.originalAmount.toFixed(2)} · {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Text>
              </View>
              <View style={styles.historyRight}>
                <Text style={[styles.historyDelta, { color: item.status === 'invested' ? '#7B61FF' : item.status === 'approved' ? '#00D4AA' : '#FF6B6B' }]}>
                  {item.status === 'skipped' ? '-' : '+'}₹{item.roundUpDelta}
                </Text>
                <View style={[styles.statusBadge, {
                  backgroundColor: item.status === 'invested' ? '#7B61FF20' : item.status === 'approved' ? '#00D4AA20' : '#FF6B6B20'
                }]}>
                  <Text style={[styles.statusText, {
                    color: item.status === 'invested' ? '#7B61FF' : item.status === 'approved' ? '#00D4AA' : '#FF6B6B'
                  }]}>{item.status}</Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>No history yet</Text>
            </View>
          }
        />
      )}

      {/* Manual Entry Modal */}
      <Modal visible={showManualEntry} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1A1A2E' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Spend Manually</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              Enter any spend and we'll calculate the round-up for you
            </Text>

            <TextInput
              style={[styles.input, { color: colors.text, borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }]}
              placeholder="Amount spent (e.g. 26)"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={manualAmount}
              onChangeText={setManualAmount}
            />

            {manualAmount && parseFloat(manualAmount) > 0 && (
              <View style={styles.previewRow}>
                <Text style={[styles.previewText, { color: colors.textSecondary }]}>
                  ₹{manualAmount} → ₹{Math.ceil(parseFloat(manualAmount) / 10) * 10}
                </Text>
                <Text style={styles.previewDelta}>
                  Round-up: ₹{Math.ceil(parseFloat(manualAmount) / 10) * 10 - parseFloat(manualAmount)}
                </Text>
              </View>
            )}

            <TextInput
              style={[styles.input, { color: colors.text, borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)' }]}
              placeholder="Merchant name (optional)"
              placeholderTextColor={colors.textSecondary}
              value={manualMerchant}
              onChangeText={setManualMerchant}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setShowManualEntry(false)} style={styles.cancelBtn}>
                <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleManualEntry} style={styles.confirmBtn}>
                <Text style={styles.confirmText}>Add Round-Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Invest Sheet */}
      <Modal visible={showInvestSheet} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: isDark ? '#1A1A2E' : '#FFFFFF' }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Invest Vault Balance</Text>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              ₹{vault?.vaultBalance.toFixed(2)} ready to invest. Choose your vehicle:
            </Text>

            <TouchableOpacity
              onPress={() => handleInvest('mutual_fund')}
              style={[styles.vehicleBtn, { borderColor: '#7B61FF' }]}
            >
              <Ionicons name="trending-up" size={22} color="#7B61FF" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.vehicleName, { color: colors.text }]}>Nifty 50 Index Fund</Text>
                <Text style={[styles.vehicleDetail, { color: colors.textSecondary }]}>
                  NAV ₹{vault?.marketPrices?.niftyIndexFund?.nav?.toFixed(2)} · UTI Mutual Fund
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#7B61FF" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleInvest('gold')}
              style={[styles.vehicleBtn, { borderColor: '#FFD166' }]}
            >
              <Ionicons name="diamond" size={22} color="#FFD166" />
              <View style={{ flex: 1 }}>
                <Text style={[styles.vehicleName, { color: colors.text }]}>Digital Gold (24K)</Text>
                <Text style={[styles.vehicleDetail, { color: colors.textSecondary }]}>
                  ₹{vault?.marketPrices?.digitalGold?.pricePerGram?.toLocaleString('en-IN')}/g · SafeGold
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#FFD166" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setShowInvestSheet(false)} style={styles.cancelBtn}>
              <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, padding: Spacing.lg, paddingTop: Platform.OS === 'ios' ? 0 : Spacing.lg },
  backBtn: { padding: 4 },
  headerTitle: { fontFamily: FontFamily.heading, fontSize: 20 },
  headerSub: { fontFamily: FontFamily.body, fontSize: 13, marginTop: 2 },
  addBtn: { marginLeft: 'auto', width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  vaultCard: { margin: Spacing.lg, borderRadius: BorderRadius.xl, padding: Spacing.lg },
  vaultRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: Spacing.md },
  vaultLabel: { fontFamily: FontFamily.bodyMedium, fontSize: 13, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
  vaultAmount: { fontFamily: FontFamily.heading, fontSize: 28, color: '#FFFFFF' },
  vaultThreshold: { fontFamily: FontFamily.body, fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
  investNowBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: 8 },
  investNowText: { fontFamily: FontFamily.headingSemi, fontSize: 13, color: '#FFFFFF' },
  progressTrack: { height: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 3, overflow: 'hidden', marginBottom: 6 },
  progressFill: { height: '100%', backgroundColor: '#00D4AA', borderRadius: 3 },
  progressText: { fontFamily: FontFamily.body, fontSize: 11, color: 'rgba(255,255,255,0.6)' },
  statsRow: { flexDirection: 'row', paddingVertical: Spacing.md, borderBottomWidth: 1, marginHorizontal: Spacing.lg },
  statItem: { flex: 1, alignItems: 'center' },
  statVal: { fontFamily: FontFamily.heading, fontSize: 18 },
  statLabel: { fontFamily: FontFamily.body, fontSize: 11, marginTop: 2 },
  statDivider: { width: 1 },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1 },
  tab: { flex: 1, alignItems: 'center', paddingVertical: Spacing.md, position: 'relative' },
  activeTab: {},
  tabText: { fontFamily: FontFamily.headingSemi, fontSize: 14 },
  tabIndicator: { position: 'absolute', bottom: 0, height: 2, width: '60%', backgroundColor: '#7B61FF', borderRadius: 2 },
  list: { padding: Spacing.lg },
  emptyState: { alignItems: 'center', padding: Spacing.xl, gap: Spacing.sm },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontFamily: FontFamily.headingSemi, fontSize: 18, textAlign: 'center' },
  emptySub: { fontFamily: FontFamily.body, fontSize: 14, textAlign: 'center', lineHeight: 20 },
  emptyBtn: { backgroundColor: '#7B61FF', borderRadius: BorderRadius.lg, paddingHorizontal: Spacing.xl, paddingVertical: Spacing.md, marginTop: Spacing.sm },
  emptyBtnText: { fontFamily: FontFamily.headingSemi, fontSize: 14, color: '#FFFFFF' },
  historyItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderRadius: BorderRadius.lg, borderWidth: 1, padding: Spacing.md, marginBottom: Spacing.sm },
  historyLeft: { flex: 1, gap: 3 },
  historyMerchant: { fontFamily: FontFamily.headingSemi, fontSize: 14 },
  historyMeta: { fontFamily: FontFamily.body, fontSize: 12 },
  historyRight: { alignItems: 'flex-end', gap: 4 },
  historyDelta: { fontFamily: FontFamily.heading, fontSize: 15 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  statusText: { fontFamily: FontFamily.bodyMedium, fontSize: 11, textTransform: 'capitalize' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: Spacing.xl, gap: Spacing.md },
  modalTitle: { fontFamily: FontFamily.heading, fontSize: 20 },
  modalSub: { fontFamily: FontFamily.body, fontSize: 14 },
  input: { borderWidth: 1, borderRadius: BorderRadius.md, padding: Spacing.md, fontFamily: FontFamily.body, fontSize: 16 },
  previewRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 4 },
  previewText: { fontFamily: FontFamily.body, fontSize: 14 },
  previewDelta: { fontFamily: FontFamily.heading, fontSize: 14, color: '#00D4AA' },
  modalActions: { flexDirection: 'row', gap: Spacing.md },
  cancelBtn: { flex: 1, alignItems: 'center', padding: Spacing.md },
  cancelText: { fontFamily: FontFamily.bodyMedium, fontSize: 14 },
  confirmBtn: { flex: 2, backgroundColor: '#7B61FF', borderRadius: BorderRadius.md, padding: Spacing.md, alignItems: 'center' },
  confirmText: { fontFamily: FontFamily.headingSemi, fontSize: 14, color: '#FFFFFF' },
  vehicleBtn: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, borderWidth: 1.5, borderRadius: BorderRadius.lg, padding: Spacing.md },
  vehicleName: { fontFamily: FontFamily.headingSemi, fontSize: 15 },
  vehicleDetail: { fontFamily: FontFamily.body, fontSize: 12, marginTop: 2 },
});
