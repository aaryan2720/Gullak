import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Platform,
  FlatList,
  Linking,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import GlowCard from '@/components/ui/glow-card';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/auth-context';
import { usePortfolio } from '@/context/portfolio-context';
import { apiService } from '@/app/services/api';
import { FontFamily } from '@/constants/fonts';

interface BlockchainEvent {
  _id: string;
  txHash: string;
  blockNumber: number;
  action: string;
  amount: number;
  explorerUrl?: string;
  createdAt: string;
}

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const router = useRouter();
  const { user, logout } = useAuth();
  const { portfolio } = usePortfolio();

  // Modals
  const [blockchainModalVisible, setBlockchainModalVisible] = useState(false);
  const [securityModalVisible, setSecurityModalVisible] = useState(false);
  const [helpModalVisible, setHelpModalVisible] = useState(false);

  // States
  const [userStats, setUserStats] = useState<any>(null);
  const [blockchainEvents, setBlockchainEvents] = useState<BlockchainEvent[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  // Settings Toggles
  const [biometricAuth, setBiometricAuth] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);

  useEffect(() => {
    loadUserStats();
  }, []);

  const loadUserStats = async () => {
    try {
      const stats = await apiService.getUserStats();
      if (stats) setUserStats(stats);
    } catch (e) {
      console.warn('Failed to load user stats');
    }
  };

  const loadBlockchainEvents = async () => {
    setLoadingEvents(true);
    try {
      const data = await apiService.getBlockchainAudit(1);
      setBlockchainEvents(data.events || []);
    } catch (e) {
      console.warn('Failed to load audit events');
    } finally {
      setLoadingEvents(false);
    }
  };

  useEffect(() => {
    if (blockchainModalVisible) {
      loadBlockchainEvents();
    }
  }, [blockchainModalVisible]);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/sign-in');
          },
        },
      ],
      { cancelable: true }
    );
  };

  const openExplorer = (url?: string) => {
    if (url) {
      Linking.openURL(url).catch(() => Alert.alert('Error', 'Cannot open link.'));
    }
  };

  const nameInitial = user?.name ? user.name.slice(0, 2).toUpperCase() : 'GS';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Hero Area */}
        <LinearGradient
          colors={['#0D1128', '#1A1040', '#0D1128']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>My Profile</Text>

          {/* Profile Card */}
          <View style={styles.userCard}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '20', borderColor: colors.primary + '50', borderWidth: 1 }]}>
              <Text style={[styles.avatarText, { color: colors.primary }]}>{nameInitial}</Text>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user?.name || 'Gullak User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@gullak.app'}</Text>
              <View style={[styles.kycBadge, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="shield-checkmark" size={12} color={colors.success} />
                <Text style={[styles.kycText, { color: colors.success }]}>
                  KYC {user?.kycStatus ? user.kycStatus.toUpperCase() : 'VERIFIED'}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Gamified stats bar */}
        <View style={styles.statsContainer}>
          <GlowCard glowColor={colors.primary} style={styles.statCard}>
            <Ionicons name="wallet-outline" size={20} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              ₹{(portfolio?.summary?.currentValue || 0).toLocaleString('en-IN')}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Value</Text>
          </GlowCard>
          <GlowCard glowColor="#FFD166" style={styles.statCard}>
            <Ionicons name="flame-outline" size={20} color="#FFD166" />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {userStats?.streak || 0} Days
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Streak</Text>
          </GlowCard>
          <GlowCard glowColor="#00D4AA" style={styles.statCard}>
            <Ionicons name="trophy-outline" size={20} color="#00D4AA" />
            <Text style={[styles.statValue, { color: colors.text }]}>
              Lvl {userStats?.level || 1}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rank</Text>
          </GlowCard>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setBlockchainModalVisible(true)}
          >
            <View style={[styles.menuIcon, { backgroundColor: '#8247E520' }]}>
              <Ionicons name="cube-outline" size={22} color="#8247E5" />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>Web3 Audit Trail</Text>
              <Text style={[styles.menuSub, { color: colors.textSecondary }]}>View on-chain transaction records</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setSecurityModalVisible(true)}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.primary + '20' }]}>
              <Ionicons name="shield-checkmark-outline" size={22} color={colors.primary} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>Security Settings</Text>
              <Text style={[styles.menuSub, { color: colors.textSecondary }]}>Manage biometric & security locks</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.menuItem, { backgroundColor: colors.surface, borderColor: colors.border }]}
            onPress={() => setHelpModalVisible(true)}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.secondary + '20' }]}>
              <Ionicons name="help-circle-outline" size={22} color={colors.secondary} />
            </View>
            <View style={styles.menuText}>
              <Text style={[styles.menuTitle, { color: colors.text }]}>Help & Support</Text>
              <Text style={[styles.menuSub, { color: colors.textSecondary }]}>FAQs & customer support service</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Preferences Toggle Card */}
        <View style={styles.preferencesContainer}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>App Preferences</Text>
          <View style={[styles.prefCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.prefRow}>
              <Text style={[styles.prefText, { color: colors.text }]}>Biometric Lock</Text>
              <Switch value={biometricAuth} onValueChange={setBiometricAuth} trackColor={{ true: colors.primary }} />
            </View>
            <View style={[styles.prefDivider, { backgroundColor: colors.border }]} />
            <View style={styles.prefRow}>
              <Text style={[styles.prefText, { color: colors.text }]}>Push Notifications</Text>
              <Switch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ true: colors.primary }} />
            </View>
          </View>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#FF4D6D" />
          <Text style={styles.logoutText}>Sign Out Account</Text>
        </TouchableOpacity>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* ── BLOCKCHAIN MODAL ── */}
      <Modal visible={blockchainModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Web3 Audit Ledger</Text>
              <TouchableOpacity onPress={() => setBlockchainModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
              All Gullak transactions are permanently anchored onto the Polygon blockchain.
            </Text>

            {loadingEvents ? (
              <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 40 }} />
            ) : blockchainEvents.length === 0 ? (
              <View style={styles.emptyLedger}>
                <Text style={{ fontSize: 44 }}>⛓️</Text>
                <Text style={[styles.emptyLedgerText, { color: colors.textSecondary }]}>No ledger records found yet.</Text>
              </View>
            ) : (
              <FlatList
                data={blockchainEvents}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={[styles.ledgerItem, { borderColor: colors.border }]}>
                    <View style={styles.ledgerTop}>
                      <Text style={[styles.ledgerAction, { color: colors.text }]}>
                        {item.action === 'goal_contribution' ? 'Goal Saving' : 'Direct Investment'}
                      </Text>
                      <Text style={[styles.ledgerAmt, { color: colors.success }]}>
                        +₹{item.amount}
                      </Text>
                    </View>
                    <Text style={[styles.ledgerMeta, { color: colors.textTertiary }]}>
                      Block #{item.blockNumber} · Hash: {item.txHash.slice(0, 14)}...
                    </Text>
                    <TouchableOpacity
                      style={[styles.explorerBtn, { backgroundColor: colors.primary + '15' }]}
                      onPress={() => openExplorer(item.explorerUrl)}
                    >
                      <Ionicons name="eye-outline" size={14} color={colors.primary} />
                      <Text style={[styles.explorerBtnText, { color: colors.primary }]}>View on Explorer</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* ── SECURITY MODAL ── */}
      <Modal visible={securityModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Security Settings</Text>
              <TouchableOpacity onPress={() => setSecurityModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <Text style={[styles.modalSub, { color: colors.textSecondary }]}>
                Configure additional device constraints to secure your investments.
              </Text>
              <View style={styles.prefRow}>
                <Text style={[styles.prefText, { color: colors.text }]}>Force Pin Lock</Text>
                <Switch value={true} onValueChange={() => {}} trackColor={{ true: colors.primary }} />
              </View>
              <View style={styles.prefRow}>
                <Text style={[styles.prefText, { color: colors.text }]}>Biometric Fingerprint</Text>
                <Switch value={biometricAuth} onValueChange={setBiometricAuth} trackColor={{ true: colors.primary }} />
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── HELP MODAL ── */}
      <Modal visible={helpModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Help & Customer Support</Text>
              <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
                <Ionicons name="close" size={24} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false} style={{ marginTop: 12 }}>
              <Text style={[styles.faqQuestion, { color: colors.text }]}>How do spares and roundups work?</Text>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                We link to your transactions, round up to the nearest ₹10, and accumulate the difference. Once it reaches ₹100, we execute an automated sweep to invest.
              </Text>

              <Text style={[styles.faqQuestion, { color: colors.text }]}>Is digital gold secure?</Text>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                Yes, your digital gold purchases are backed by 99.99% pure physical gold bullion stored securely in safe vaults.
              </Text>

              <Text style={[styles.faqQuestion, { color: colors.text }]}>How do I withdraw my savings?</Text>
              <Text style={[styles.faqAnswer, { color: colors.textSecondary }]}>
                Go to the Invest tab, click Withdraw, select your amount, and funds will hit your primary linked UPI account in 2-4 hours.
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: BorderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(155, 133, 255, 0.2)',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontFamily: FontFamily.heading,
  },
  userInfo: { flex: 1, gap: 4 },
  userName: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: FontFamily.headingSemi,
  },
  userEmail: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: FontFamily.body,
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginTop: 2,
  },
  kycText: {
    fontSize: 10,
    fontFamily: FontFamily.bodySemi,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: Spacing.md,
    marginTop: -20,
  },
  statCard: {
    flex: 1,
    padding: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    gap: 6,
  },
  statValue: {
    fontSize: 15,
    fontFamily: FontFamily.headingSemi,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: FontFamily.body,
  },
  menuContainer: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuText: { flex: 1, gap: 2 },
  menuTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bodySemi,
  },
  menuSub: {
    fontSize: 11,
    fontFamily: FontFamily.body,
  },
  preferencesContainer: {
    paddingHorizontal: Spacing.md,
    marginTop: Spacing.lg,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: FontFamily.headingSemi,
  },
  prefCard: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  prefText: {
    fontSize: 14,
    fontFamily: FontFamily.bodyMedium,
  },
  prefDivider: {
    height: 0.5,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: Spacing.md,
    marginTop: 28,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1.5,
    borderColor: '#FF4D6D',
  },
  logoutText: {
    fontSize: 14,
    color: '#FF4D6D',
    fontFamily: FontFamily.bodySemi,
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
    height: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: FontFamily.heading,
  },
  modalSub: {
    fontSize: 13,
    fontFamily: FontFamily.body,
    lineHeight: 20,
    marginBottom: 16,
  },
  emptyLedger: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyLedgerText: {
    fontSize: 14,
    fontFamily: FontFamily.bodySemi,
  },
  ledgerItem: {
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  ledgerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ledgerAction: {
    fontSize: 14,
    fontFamily: FontFamily.bodySemi,
  },
  ledgerAmt: {
    fontSize: 15,
    fontFamily: FontFamily.heading,
  },
  ledgerMeta: {
    fontSize: 11,
    fontFamily: FontFamily.body,
    marginBottom: 8,
  },
  explorerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  explorerBtnText: {
    fontSize: 11,
    fontFamily: FontFamily.bodySemi,
  },
  modalContent: {
    gap: 16,
  },
  faqQuestion: {
    fontSize: 14,
    fontFamily: FontFamily.bodySemi,
    marginTop: 12,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 12,
    fontFamily: FontFamily.body,
    lineHeight: 18,
    marginBottom: 12,
  },
});
