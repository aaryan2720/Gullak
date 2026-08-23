import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Animated,
  Dimensions,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, Gradients, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { FontFamily } from '@/constants/fonts';
import { useAuth } from '@/app/context/auth-context';
import { usePortfolio } from '@/app/context/portfolio-context';
import { apiService } from '@/app/services/api';
import GlowCard from '@/components/ui/glow-card';
import StatCounter from '@/components/ui/stat-counter';
import TransactionCard from '@/components/ui/transaction-card';
import { PortfolioCardSkeleton, TransactionSkeleton, ListSkeleton } from '@/components/ui/skeleton-loader';

const { width } = Dimensions.get('window');

const QUICK_ACTIONS = [
  { id: 'invest', icon: 'trending-up', label: 'Invest', color: '#7B61FF', route: '/(tabs)/invest' as const },
  { id: 'goals', icon: 'flag', label: 'Goals', color: '#00D4AA', route: '/(tabs)/goals' as const },
  { id: 'coach', icon: 'chatbubble-ellipses', label: 'AI Coach', color: '#FFD166', route: '/ai-coach' as const },
  { id: 'history', icon: 'receipt', label: 'History', color: '#FF6B9D', route: '/(tabs)/transactions' as const },
];

const AGENT_STATES = [
  { text: 'Watching transactions...', icon: 'eye', color: '#7B61FF' },
  { text: 'Analyzing your spending...', icon: 'analytics', color: '#00D4AA' },
  { text: 'Finding investment windows...', icon: 'search', color: '#FFD166' },
  { text: 'Calculating round-ups...', icon: 'calculator', color: '#FF6B9D' },
  { text: 'Rebalancing portfolio...', icon: 'refresh-circle', color: '#4D9FFF' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'dark'];
  const router = useRouter();
  const { user } = useAuth();
  const { portfolio, isLoading: portfolioLoading, refresh: refreshPortfolio } = usePortfolio();

  const [refreshing, setRefreshing] = useState(false);
  const [recentTx, setRecentTx] = useState<any[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState({ weeklyInvested: 0, weeklyRoundUps: 0, roundUpCount: 0 });
  const [agentState, setAgentState] = useState(AGENT_STATES[0]);
  const [agentIndex, setAgentIndex] = useState(0);

  // Animations
  const agentPulse = useRef(new Animated.Value(1)).current;
  const agentTextOpacity = useRef(new Animated.Value(1)).current;
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(-20)).current;

  useEffect(() => {
    // Header entrance animation
    Animated.parallel([
      Animated.timing(headerOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(headerSlide, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
    ]).start();

    // AI Agent pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(agentPulse, { toValue: 1.12, duration: 1600, useNativeDriver: true }),
        Animated.timing(agentPulse, { toValue: 1, duration: 1600, useNativeDriver: true }),
      ])
    ).start();

    // Agent state cycle every 5s
    const interval = setInterval(() => {
      setAgentIndex(prev => {
        const next = (prev + 1) % AGENT_STATES.length;
        // Fade transition
        Animated.sequence([
          Animated.timing(agentTextOpacity, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(agentTextOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
        setTimeout(() => setAgentState(AGENT_STATES[next]), 200);
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadData = useCallback(async () => {
    setTxLoading(true);
    try {
      const [txData, summary] = await Promise.all([
        apiService.getTransactions({ page: 1, limit: 5 }),
        apiService.getWeeklySummary(),
      ]);
      setRecentTx(txData.transactions || []);
      setWeeklySummary(summary);
    } catch (e) {
      setRecentTx([]);
    } finally {
      setTxLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshPortfolio(), loadData()]);
    setRefreshing(false);
  }, [refreshPortfolio, loadData]);

  const portfolioValue = portfolio?.summary?.currentValue ?? 0;
  const totalInvested = portfolio?.summary?.totalInvested ?? 0;
  const totalReturns = portfolio?.summary?.totalReturns ?? 0;
  const returnPct = portfolio?.summary?.returnPercentage ?? 0;
  const isPositive = totalReturns >= 0;

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = user?.name?.split(' ')[0] || 'Investor';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? colors.background : '#0A0E27'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HERO HEADER GRADIENT ── */}
        <LinearGradient
          colors={isDark ? ['#0D1128', '#1A1040', '#0D1128'] : ['#0A0E27', '#1A1040', '#111627']}
          style={styles.heroGradient}
        >
          {/* Header row */}
          <Animated.View style={[styles.headerRow, { opacity: headerOpacity, transform: [{ translateY: headerSlide }] }]}>
            <View>
              <Text style={styles.greeting}>{greeting()},</Text>
              <Text style={styles.name}>{firstName} 👋</Text>
            </View>
            <TouchableOpacity
              style={[styles.notifBtn, { backgroundColor: 'rgba(255,255,255,0.08)' }]}
              onPress={() => router.push('/notifications')}
            >
              <Ionicons name="notifications" size={22} color="#FFFFFF" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </Animated.View>

          {/* ── PORTFOLIO BALANCE CARD ── */}
          {portfolioLoading ? (
            <View style={[styles.balanceCard, { backgroundColor: 'rgba(255,255,255,0.06)' }]}>
              <PortfolioCardSkeleton />
            </View>
          ) : (
            <View style={[styles.balanceCard, { backgroundColor: 'rgba(255,255,255,0.06)', borderColor: 'rgba(155,133,255,0.2)', borderWidth: 1 }]}>
              <Text style={styles.balanceLabel}>Total Portfolio Value</Text>
              <StatCounter
                value={portfolioValue}
                prefix="₹"
                style={styles.balanceValue}
                color="#FFFFFF"
                fontSize={42}
                fontFamily={FontFamily.heading}
              />
              <View style={styles.returnsRow}>
                <View style={[styles.returnsBadge, { backgroundColor: isPositive ? '#00FFB320' : '#FF4D6D20' }]}>
                  <Ionicons
                    name={isPositive ? 'trending-up' : 'trending-down'}
                    size={14}
                    color={isPositive ? '#00FFB3' : '#FF4D6D'}
                  />
                  <Text style={[styles.returnsText, { color: isPositive ? '#00FFB3' : '#FF4D6D' }]}>
                    {isPositive ? '+' : ''}₹{Math.abs(totalReturns).toLocaleString('en-IN')} ({returnPct.toFixed(1)}%)
                  </Text>
                </View>
                <Text style={styles.investedText}>
                  Invested ₹{totalInvested.toLocaleString('en-IN')}
                </Text>
              </View>

              {/* Weekly mini stats */}
              <View style={styles.weeklyRow}>
                <View style={styles.miniStat}>
                  <Ionicons name="flash" size={12} color="#FFD166" />
                  <Text style={styles.miniStatText}>₹{weeklySummary.weeklyRoundUps} round-ups this week</Text>
                </View>
                <View style={styles.miniStat}>
                  <Ionicons name="trending-up" size={12} color="#9B85FF" />
                  <Text style={styles.miniStatText}>₹{weeklySummary.weeklyInvested} invested</Text>
                </View>
              </View>
            </View>
          )}

          {/* ── QUICK ACTIONS ── */}
          <View style={styles.quickActionsRow}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.quickAction}
                onPress={() => router.push(action.route as any)}
                activeOpacity={0.75}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color + '22' }]}>
                  <Ionicons name={action.icon as any} size={22} color={action.color} />
                </View>
                <Text style={styles.quickActionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </LinearGradient>

        {/* ── AI AGENT STATUS CARD ── */}
        <View style={[styles.sectionPad, { marginTop: -12 }]}>
          <GlowCard glowColor={agentState.color} onMount>
            <LinearGradient
              colors={[colors.surface, colors.surfaceVariant]}
              style={styles.agentCard}
            >
              <Animated.View style={[styles.agentOrb, { backgroundColor: agentState.color + '25', transform: [{ scale: agentPulse }] }]}>
                <Ionicons name={agentState.icon as any} size={22} color={agentState.color} />
              </Animated.View>
              <View style={styles.agentInfo}>
                <Text style={[styles.agentTitle, { color: colors.text }]}>AI Agent</Text>
                <Animated.Text style={[styles.agentActivity, { color: agentState.color, opacity: agentTextOpacity }]}>
                  {agentState.text}
                </Animated.Text>
              </View>
              <TouchableOpacity
                style={[styles.agentBtn, { backgroundColor: colors.primary + '20' }]}
                onPress={() => router.push('/ai-coach')}
              >
                <Text style={[styles.agentBtnText, { color: colors.primary }]}>Ask</Text>
                <Ionicons name="arrow-forward" size={14} color={colors.primary} />
              </TouchableOpacity>
            </LinearGradient>
          </GlowCard>
        </View>

        {/* ── RECENT TRANSACTIONS ── */}
        <View style={styles.sectionPad}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/transactions' as any)}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all →</Text>
            </TouchableOpacity>
          </View>

          <View style={[styles.txContainer, { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }]}>
            {txLoading ? (
              <ListSkeleton count={4} />
            ) : recentTx.length === 0 ? (
              <View style={styles.emptyTx}>
                <Text style={{ fontSize: 40 }}>🪙</Text>
                <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions yet</Text>
                <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                  Make your first investment to see activity here
                </Text>
              </View>
            ) : (
              recentTx.map((tx) => (
                <TransactionCard
                  key={tx._id}
                  id={tx._id}
                  type={tx.type}
                  category={tx.category}
                  amount={tx.amount}
                  description={tx.metadata?.description}
                  merchantName={tx.metadata?.merchantName}
                  goalTitle={tx.destination?.goalId?.title}
                  status={tx.status}
                  blockchainVerified={tx.blockchainReceipt?.verified}
                  txHash={tx.blockchainReceipt?.txHash}
                  createdAt={tx.createdAt}
                />
              ))
            )}
          </View>
        </View>

        {/* ── ASSET ALLOCATION SNAPSHOT ── */}
        {portfolio && totalInvested > 0 && (
          <View style={styles.sectionPad}>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 12 }]}>Asset Allocation</Text>
            <GlowCard glowColor="#7B61FF" onMount>
              <LinearGradient colors={[colors.surface, colors.surfaceVariant]} style={styles.allocationCard}>
                {[
                  { label: 'Index Funds', pct: portfolio.assetAllocation?.equity || 60, color: '#7B61FF' },
                  { label: 'Digital Gold', pct: portfolio.assetAllocation?.gold || 30, color: '#FFD166' },
                  { label: 'Bonds', pct: portfolio.assetAllocation?.bonds || 10, color: '#00FFB3' },
                ].map((item) => (
                  <View key={item.label} style={styles.allocationRow}>
                    <View style={[styles.allocationDot, { backgroundColor: item.color }]} />
                    <Text style={[styles.allocationLabel, { color: colors.text }]}>{item.label}</Text>
                    <View style={styles.allocationBarBg}>
                      <View style={[styles.allocationBarFill, { width: `${item.pct}%` as any, backgroundColor: item.color }]} />
                    </View>
                    <Text style={[styles.allocationPct, { color: item.color }]}>{item.pct}%</Text>
                  </View>
                ))}
              </LinearGradient>
            </GlowCard>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // Hero
  heroGradient: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 28,
    paddingHorizontal: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: FontFamily.body,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontFamily: FontFamily.heading,
    marginTop: 2,
  },
  notifBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4D6D',
    borderWidth: 1.5,
    borderColor: '#0D1128',
  },

  // Balance card
  balanceCard: {
    borderRadius: BorderRadius.lg,
    padding: 20,
    marginBottom: 24,
  },
  balanceLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: FontFamily.body,
    marginBottom: 4,
  },
  balanceValue: {
    fontFamily: FontFamily.heading,
    marginBottom: 8,
  },
  returnsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  returnsBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  returnsText: {
    fontSize: 13,
    fontFamily: FontFamily.bodySemi,
  },
  investedText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: FontFamily.body,
  },
  weeklyRow: {
    flexDirection: 'row',
    gap: 16,
    paddingTop: 14,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  miniStat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniStatText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    fontFamily: FontFamily.body,
  },

  // Quick actions
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  quickAction: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  quickActionIcon: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: FontFamily.bodyMedium,
  },

  // Section
  sectionPad: { paddingHorizontal: Spacing.md, marginTop: Spacing.lg },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontFamily: FontFamily.headingSemi,
  },
  seeAll: {
    fontSize: 13,
    fontFamily: FontFamily.bodyMedium,
  },

  // AI Agent
  agentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
    borderRadius: BorderRadius.lg,
  },
  agentOrb: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentInfo: { flex: 1 },
  agentTitle: {
    fontSize: 13,
    fontFamily: FontFamily.bodySemi,
    marginBottom: 2,
  },
  agentActivity: {
    fontSize: 12,
    fontFamily: FontFamily.body,
  },
  agentBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  agentBtnText: {
    fontSize: 13,
    fontFamily: FontFamily.bodySemi,
  },

  // Transactions
  txContainer: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  emptyTx: {
    alignItems: 'center',
    padding: 40,
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FontFamily.bodySemi,
  },
  emptySubtext: {
    fontSize: 13,
    fontFamily: FontFamily.body,
    textAlign: 'center',
  },

  // Allocation
  allocationCard: {
    padding: 18,
    borderRadius: BorderRadius.lg,
    gap: 14,
  },
  allocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  allocationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  allocationLabel: {
    fontSize: 13,
    fontFamily: FontFamily.bodyMedium,
    width: 90,
  },
  allocationBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  allocationBarFill: {
    height: 6,
    borderRadius: 3,
  },
  allocationPct: {
    fontSize: 12,
    fontFamily: FontFamily.bodySemi,
    width: 36,
    textAlign: 'right',
  },
});
