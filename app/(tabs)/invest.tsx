import Card from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress-bar';
import RazorpayCheckout from '@/components/ui/razorpay-checkout';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Modal, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiService } from '../services/api';

export default function InvestScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const [autoInvestEnabled, setAutoInvestEnabled] = useState(false);

  // Dynamic portfolio states
  const [totalInvested, setTotalInvested] = useState(24567);
  const [currentValue, setCurrentValue] = useState(26845);
  const [monthlyInvested, setMonthlyInvested] = useState(1245);
  
  useEffect(() => {
    const loadPortfolioData = async () => {
      const data = await apiService.getPortfolio();
      if (data && data.summary && data.summary.totalInvested > 0) {
        setTotalInvested(data.summary.totalInvested);
        setCurrentValue(data.summary.currentValue);
        setMonthlyInvested(data.summary.totalInvested * 0.05); // Simulated monthly portion
      }
    };
    loadPortfolioData();
  }, []);

  // Payment states
  const [amountModalVisible, setAmountModalVisible] = useState(false);
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState('500');
  const [investmentType, setInvestmentType] = useState<'One-Time' | 'SIP' | 'Bonus'>('One-Time');

  // Calculates returns values
  const returnsValue = currentValue - totalInvested;
  const returnsPercent = ((returnsValue / totalInvested) * 100).toFixed(1);

  const handleOpenAmountModal = (type: 'One-Time' | 'SIP' | 'Bonus') => {
    setInvestmentType(type);
    if (type === 'One-Time') setSelectedAmount('500');
    else if (type === 'SIP') setSelectedAmount('1000');
    else setSelectedAmount('250');
    setAmountModalVisible(true);
  };

  const handleProceedToPayment = () => {
    const amt = parseInt(selectedAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert('Invalid Amount', 'Please enter a valid investment amount.');
      return;
    }
    setAmountModalVisible(false);
    setTimeout(() => {
      setCheckoutVisible(true);
    }, 100);
  };

  const handlePaymentSuccess = async (paymentId: string, txHash: string) => {
    const amt = parseInt(selectedAmount);
    setCheckoutVisible(false);
    
    // API Call
    await apiService.investManual(amt, { indexFunds: 60, digitalGold: 30, bonds: 10 });

    // Dynamically update portfolio
    setTotalInvested(prev => prev + amt);
    setCurrentValue(prev => prev + amt);
    setMonthlyInvested(prev => prev + amt);

    Alert.alert(
      'Investment Successful! 🎉',
      `You invested ₹${amt.toLocaleString()} successfully.\n\nRazorpay ID: ${paymentId}\nPolygon Tx Hash: ${txHash.slice(0, 10)}...${txHash.slice(-6)}\n\nYour portfolio has been updated in real-time.`,
      [{ text: 'Great!' }]
    );
  };

  return (
    <LinearGradient
      colors={['#FAFAFA', '#F5F5FF', '#FFF5FA']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Investment Hub</Text>
            <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
              Smart investing made simple
            </Text>
          </View>
          <TouchableOpacity style={styles.headerButton} activeOpacity={0.7}>
            <Ionicons name="stats-chart" size={24} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Total Investment Overview */}
        <LinearGradient
          colors={['#6C63FF', '#8F88FF']}
          style={styles.totalCard}
        >
          <View style={styles.totalHeader}>
            <Text style={styles.totalLabel}>Total Invested</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="shield-checkmark" size={14} color="#4CAF50" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
          <Text style={styles.totalValue}>₹{totalInvested.toLocaleString()}</Text>
          <View style={styles.totalStats}>
            <View style={styles.totalStatItem}>
              <Text style={styles.totalStatLabel}>Current Value</Text>
              <Text style={styles.totalStatValue}>₹{currentValue.toLocaleString()}</Text>
            </View>
            <View style={styles.totalStatDivider} />
            <View style={styles.totalStatItem}>
              <Text style={styles.totalStatLabel}>Returns</Text>
              <Text style={[styles.totalStatValue, { color: '#4CAF50' }]}>
                +₹{returnsValue.toLocaleString()} ({returnsPercent}%)
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* Monthly Performance */}
        <Card style={styles.performanceCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              This Month's Activity
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.performanceGrid}>
            <View style={styles.performanceItem}>
              <View style={[styles.performanceIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                <Ionicons name="trending-up" size={20} color="#4CAF50" />
              </View>
              <Text style={[styles.performanceValue, { color: colors.text }]}>₹{monthlyInvested.toLocaleString()}</Text>
              <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>
                Invested
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <View style={[styles.performanceIcon, { backgroundColor: '#2196F3' + '20' }]}>
                <Ionicons name="repeat" size={20} color="#2196F3" />
              </View>
              <Text style={[styles.performanceValue, { color: colors.text }]}>₹340</Text>
              <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>
                Round-ups
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <View style={[styles.performanceIcon, { backgroundColor: '#FF9800' + '20' }]}>
                <Ionicons name="flash" size={20} color="#FF9800" />
              </View>
              <Text style={[styles.performanceValue, { color: colors.text }]}>₹180</Text>
              <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>
                Auto-Invest
              </Text>
            </View>
            <View style={styles.performanceItem}>
              <View style={[styles.performanceIcon, { backgroundColor: '#9C27B0' + '20' }]}>
                <Ionicons name="trophy" size={20} color="#9C27B0" />
              </View>
              <Text style={[styles.performanceValue, { color: colors.text }]}>+9.3%</Text>
              <Text style={[styles.performanceLabel, { color: colors.textSecondary }]}>
                Growth
              </Text>
            </View>
          </View>
        </Card>

        {/* Round-up Investments */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Round-up Investments
          </Text>
          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Ionicons name="repeat" size={24} color="#2196F3" />
              </View>
              <View style={styles.flex}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Auto Round-up
                </Text>
                <Text style={[styles.cardSubtext, { color: colors.textSecondary }]}>
                  Round purchases to nearest ₹10
                </Text>
              </View>
              <View style={[styles.toggleOn, { backgroundColor: colors.primary }]}>
                <Text style={[styles.toggleText, { color: colors.textInverse }]}>ON</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
                  This Month
                </Text>
                <Text style={[styles.statItemValue, { color: colors.primary }]}>₹340</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
                  Transactions
                </Text>
                <Text style={[styles.statItemValue, { color: colors.text }]}>23</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
                  All Time
                </Text>
                <Text style={[styles.statItemValue, { color: colors.text }]}>₹4,580</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.configButton} activeOpacity={0.7}>
              <Ionicons name="settings-outline" size={18} color={colors.primary} />
              <Text style={[styles.configButtonText, { color: colors.primary }]}>
                Configure Round-up Settings
              </Text>
            </TouchableOpacity>
          </Card>

          {/* Recent Round-ups */}
          <View style={styles.recentTransactions}>
            <Text style={[styles.subsectionTitle, { color: colors.text }]}>
              Recent Round-ups
            </Text>
            {[
              { name: 'Coffee Shop', amount: '₹8', time: '2 hours ago' },
              { name: 'Grocery Store', amount: '₹15', time: '5 hours ago' },
              { name: 'Online Shopping', amount: '₹12', time: '1 day ago' },
            ].map((item, index) => (
              <View key={index} style={styles.transactionItem}>
                <View style={[styles.transactionIcon, { backgroundColor: colors.primary + '15' }]}>
                  <Ionicons name="repeat" size={16} color={colors.primary} />
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.transactionName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.transactionTime, { color: colors.textSecondary }]}>
                    {item.time}
                  </Text>
                </View>
                <Text style={[styles.transactionAmount, { color: colors.primary }]}>
                  {item.amount}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Auto-Invest Setup */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Daily Auto-Invest
          </Text>
          <Card style={styles.card}>
            <View style={styles.autoInvestHeader}>
              <View style={[styles.autoInvestIcon, { backgroundColor: '#FF9800' + '20' }]}>
                <Ionicons name="flash" size={32} color="#FF9800" />
              </View>
              <View style={styles.flex}>
                <Text style={[styles.autoInvestTitle, { color: colors.text }]}>
                  {autoInvestEnabled ? 'Auto-Invest Active' : 'Set Up Auto-Invest'}
                </Text>
                <Text style={[styles.autoInvestDesc, { color: colors.textSecondary }]}>
                  {autoInvestEnabled
                    ? 'Investing ₹50 daily • Next on Jan 15'
                    : 'Automate your investments and build wealth effortlessly'}
                </Text>
              </View>
            </View>

            {autoInvestEnabled ? (
              <>
                <View style={styles.divider} />
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
                      Daily Amount
                    </Text>
                    <Text style={[styles.statItemValue, { color: colors.text }]}>₹50</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
                      This Month
                    </Text>
                    <Text style={[styles.statItemValue, { color: colors.text }]}>₹700</Text>
                  </View>
                  <View style={styles.statItem}>
                    <Text style={[styles.statItemLabel, { color: colors.textSecondary }]}>
                      Total
                    </Text>
                    <Text style={[styles.statItemValue, { color: colors.text }]}>₹8,450</Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={[styles.cleanButton, { backgroundColor: colors.primary + '10' }]}
                  activeOpacity={0.7}
                  onPress={() => setAutoInvestEnabled(false)}
                >
                  <Ionicons name="settings-outline" size={18} color={colors.primary} />
                  <Text style={[styles.cleanButtonText, { color: colors.primary }]}>
                    Manage Auto-Invest
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={styles.benefitsList}>
                  {[
                    { icon: 'calendar', text: 'Invest daily, weekly, or monthly' },
                    { icon: 'trending-up', text: 'Dollar-cost averaging strategy' },
                    { icon: 'notifications', text: 'Flexible pause and resume anytime' },
                  ].map((benefit, index) => (
                    <View key={index} style={styles.benefitItem}>
                      <Ionicons name={benefit.icon as any} size={18} color={colors.primary} />
                      <Text style={[styles.benefitText, { color: colors.text }]}>
                        {benefit.text}
                      </Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity
                  style={[styles.cleanButton, { backgroundColor: colors.primary }]}
                  activeOpacity={0.7}
                  onPress={() => setAutoInvestEnabled(true)}
                >
                  <Ionicons name="flash" size={20} color="#FFFFFF" />
                  <Text style={[styles.cleanButtonText, { color: '#FFFFFF' }]}>
                    Enable Auto-Invest
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </Card>
        </View>

        {/* Quick Investment Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF' }]}
              activeOpacity={0.7}
              onPress={() => handleOpenAmountModal('One-Time')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                <Ionicons name="wallet" size={24} color="#4CAF50" />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                One-Time Invest
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF' }]}
              activeOpacity={0.7}
              onPress={() => handleOpenAmountModal('SIP')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#2196F3' + '20' }]}>
                <Ionicons name="calendar" size={24} color="#2196F3" />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                SIP Setup
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.quickActionCard, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#FFFFFF' }]}
              activeOpacity={0.7}
              onPress={() => handleOpenAmountModal('Bonus')}
            >
              <View style={[styles.quickActionIcon, { backgroundColor: '#FF9800' + '20' }]}>
                <Ionicons name="gift" size={24} color="#FF9800" />
              </View>
              <Text style={[styles.quickActionLabel, { color: colors.text }]}>
                Bonus Invest
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Choose Amount Modal */}
        <Modal
          visible={amountModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setAmountModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.amountModalContent, { backgroundColor: colors.background }]}>
              <View style={styles.modalHeaderRow}>
                <Text style={[styles.modalHeading, { color: colors.text }]}>
                  {investmentType} Investment
                </Text>
                <TouchableOpacity onPress={() => setAmountModalVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.text} />
                </TouchableOpacity>
              </View>

              <Text style={[styles.modalDesc, { color: colors.textSecondary }]}>
                Choose or enter the amount you want to invest. This transaction will be processed securely via Razorpay.
              </Text>

              {/* Quick Select Buttons */}
              <View style={styles.quickSelectRow}>
                {['100', '500', '1000', '5000'].map((amt) => (
                  <TouchableOpacity
                    key={amt}
                    style={[
                      styles.quickAmtBtn,
                      selectedAmount === amt && { backgroundColor: colors.primary }
                    ]}
                    onPress={() => setSelectedAmount(amt)}
                  >
                    <Text
                      style={[
                        styles.quickAmtText,
                        selectedAmount === amt ? { color: '#FFFFFF', fontWeight: '700' } : { color: colors.text }
                      ]}
                    >
                      ₹{parseInt(amt).toLocaleString()}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Custom Input */}
              <View style={[styles.inputWrapper, { borderColor: colors.border }]}>
                <Text style={[styles.currencyPrefix, { color: colors.textSecondary }]}>₹</Text>
                <TextInput
                  style={[styles.customInput, { color: colors.text }]}
                  keyboardType="numeric"
                  value={selectedAmount}
                  onChangeText={setSelectedAmount}
                  placeholder="Enter custom amount"
                  placeholderTextColor={colors.textTertiary}
                />
              </View>

              <TouchableOpacity
                style={[styles.proceedBtn, { backgroundColor: colors.primary }]}
                activeOpacity={0.8}
                onPress={handleProceedToPayment}
              >
                <Text style={styles.proceedBtnText}>Proceed to Pay ₹{parseInt(selectedAmount || '0').toLocaleString()}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Razorpay Checkout sheet */}
        <RazorpayCheckout
          visible={checkoutVisible}
          amount={parseInt(selectedAmount || '0')}
          onSuccess={handlePaymentSuccess}
          onClose={() => setCheckoutVisible(false)}
        />

        {/* Investment Allocation */}
        <View style={styles.section}>
          <View style={styles.cardHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Portfolio Allocation
            </Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.viewAll, { color: colors.primary }]}>Rebalance</Text>
            </TouchableOpacity>
          </View>
          <Card style={styles.card}>
            <Text style={[styles.allocationSubtext, { color: colors.textSecondary }]}>
              AI-optimized for your risk profile • Last updated: Jan 14
            </Text>

            <View style={[styles.allocationRow, { marginTop: Spacing.md }]}>
              <View style={styles.allocationInfo}>
                <View style={[styles.dot, { backgroundColor: colors.investment.equity }]} />
                <View>
                  <Text style={[styles.allocationLabel, { color: colors.text }]}>
                    Index Funds
                  </Text>
                  <Text style={[styles.allocationAmount, { color: colors.textSecondary }]}>
                    ₹14,740 invested
                  </Text>
                </View>
              </View>
              <Text style={[styles.allocationValue, { color: colors.text }]}>60%</Text>
            </View>
            <ProgressBar progress={60} color={colors.investment.equity} height={8} />

            <View style={[styles.allocationRow, { marginTop: Spacing.md }]}>
              <View style={styles.allocationInfo}>
                <View style={[styles.dot, { backgroundColor: colors.investment.gold }]} />
                <View>
                  <Text style={[styles.allocationLabel, { color: colors.text }]}>
                    Digital Gold
                  </Text>
                  <Text style={[styles.allocationAmount, { color: colors.textSecondary }]}>
                    ₹7,370 invested
                  </Text>
                </View>
              </View>
              <Text style={[styles.allocationValue, { color: colors.text }]}>30%</Text>
            </View>
            <ProgressBar progress={30} color={colors.investment.gold} height={8} />

            <View style={[styles.allocationRow, { marginTop: Spacing.md }]}>
              <View style={styles.allocationInfo}>
                <View style={[styles.dot, { backgroundColor: colors.investment.bonds }]} />
                <View>
                  <Text style={[styles.allocationLabel, { color: colors.text }]}>
                    Bonds & Debt
                  </Text>
                  <Text style={[styles.allocationAmount, { color: colors.textSecondary }]}>
                    ₹2,457 invested
                  </Text>
                </View>
              </View>
              <Text style={[styles.allocationValue, { color: colors.text }]}>10%</Text>
            </View>
            <ProgressBar progress={10} color={colors.investment.bonds} height={8} />
          </Card>
        </View>

        {/* Investment Insights */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            AI Insights & Recommendations
          </Text>
          <Card style={styles.insightCard}>
            <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: '#9C27B0' + '20' }]}>
                <Ionicons name="bulb" size={24} color="#9C27B0" />
              </View>
              <View style={styles.flex}>
                <Text style={[styles.insightTitle, { color: colors.text }]}>
                  Market Opportunity
                </Text>
                <Text style={[styles.insightDesc, { color: colors.textSecondary }]}>
                  Markets are favorable for index funds right now. Consider increasing allocation by 5%.
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.cleanButton, { backgroundColor: colors.primary + '10' }]}
              activeOpacity={0.7}
            >
              <Text style={[styles.cleanButtonText, { color: colors.primary }]}>
                View Analysis
              </Text>
            </TouchableOpacity>
          </Card>

          <View style={{ marginTop: Spacing.md }}>
            <Card style={styles.insightCard}>
              <View style={styles.insightHeader}>
              <View style={[styles.insightIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                <Ionicons name="trophy" size={24} color="#4CAF50" />
              </View>
              <View style={styles.flex}>
                <Text style={[styles.insightTitle, { color: colors.text }]}>
                  You're Doing Great!
                </Text>
                <Text style={[styles.insightDesc, { color: colors.textSecondary }]}>
                  Your investments are outperforming 78% of users in your age group.
                </Text>
              </View>
            </View>
            </Card>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    marginTop: 4,
  },
  headerButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#6C63FF15',
  },
  // Total Investment Card
  totalCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    borderRadius: 20,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  totalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: Typography.fontSize.sm,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '600',
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  verifiedText: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: Spacing.md,
  },
  totalStats: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  totalStatItem: {
    flex: 1,
  },
  totalStatLabel: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    marginBottom: 4,
  },
  totalStatValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  totalStatDivider: {
    width: 1,
    backgroundColor: '#FFFFFF',
    opacity: 0.3,
  },
  // Performance Card
  performanceCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  viewAll: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  performanceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  performanceItem: {
    flex: 1,
    minWidth: '45%',
    alignItems: 'center',
    padding: Spacing.md,
  },
  performanceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  performanceValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  // General
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
  },
  subsectionTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  card: {
    marginBottom: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6C63FF20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  flex: {
    flex: 1,
  },
  cardTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  cardSubtext: {
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs / 2,
  },
  toggleOn: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
  },
  toggleText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: Typography.fontWeight.bold,
  },
  // Round-up & Transactions
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statItemLabel: {
    fontSize: Typography.fontSize.xs,
    marginBottom: 4,
  },
  statItemValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
  },
  configButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
  },
  configButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  recentTransactions: {
    marginTop: Spacing.md,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  transactionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  transactionTime: {
    fontSize: Typography.fontSize.xs,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
  // Auto-Invest
  autoInvestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  autoInvestIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  autoInvestTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    marginBottom: 4,
  },
  autoInvestDesc: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },
  benefitsList: {
    marginVertical: Spacing.md,
    gap: Spacing.sm,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  benefitText: {
    fontSize: Typography.fontSize.sm,
    flex: 1,
  },
  cleanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
  },
  cleanButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
  },
  // Quick Actions
  quickActionsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  quickActionCard: {
    flex: 1,
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  quickActionLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  // Allocation
  allocationSubtext: {
    fontSize: Typography.fontSize.xs,
    marginBottom: Spacing.sm,
  },
  allocationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  allocationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    flex: 1,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  allocationLabel: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
  },
  allocationAmount: {
    fontSize: Typography.fontSize.xs,
    marginTop: 2,
  },
  allocationValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  // Insights
  insightCard: {
    marginBottom: 0,
    backgroundColor: '#FFF5E0',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  insightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  insightTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  amountModalContent: {
    width: '100%',
    borderRadius: 20,
    padding: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  modalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalHeading: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
  },
  modalDesc: {
    fontSize: Typography.fontSize.sm,
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  quickSelectRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  quickAmtBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    alignItems: 'center',
  },
  quickAmtText: {
    fontSize: Typography.fontSize.sm,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: Spacing.md,
    height: 52,
    marginBottom: Spacing.xl,
  },
  currencyPrefix: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    marginRight: 6,
  },
  customInput: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    height: '100%',
  },
  proceedBtn: {
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  proceedBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: Typography.fontSize.base,
  },
});
