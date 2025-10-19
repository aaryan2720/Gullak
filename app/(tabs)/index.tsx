import Card from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress-bar';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Modal, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Agent animations
  const agentPulse = useRef(new Animated.Value(1)).current;
  const activityAnim = useRef(new Animated.Value(0)).current;
  const scanAnim = useRef(new Animated.Value(0)).current;

  // Agent activity cycle
  const [agentActivity, setAgentActivity] = useState('Observing transactions...');
  const [agentColor, setAgentColor] = useState('#2196F3');
  const [agentModalVisible, setAgentModalVisible] = useState(false);

  useEffect(() => {
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    // Agent pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(agentPulse, {
          toValue: 1.15,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(agentPulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Scanning animation for agent
    Animated.loop(
      Animated.timing(scanAnim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      })
    ).start();

    // Agent activity cycle (changes every 4 seconds)
    const activities = [
      { text: 'Observing transactions...', color: '#2196F3' },
      { text: 'Analyzing spending patterns...', color: '#9C27B0' },
      { text: 'Calculating optimal investments...', color: '#FFA726' },
      { text: 'Executing round-up...', color: '#4CAF50' },
      { text: 'Rebalancing portfolio...', color: '#FF6584' },
      { text: 'Learning your preferences...', color: '#00BCD4' },
    ];

    let activityIndex = 0;
    const activityInterval = setInterval(() => {
      activityIndex = (activityIndex + 1) % activities.length;
      setAgentActivity(activities[activityIndex].text);
      setAgentColor(activities[activityIndex].color);
      
      // Animate activity change
      Animated.sequence([
        Animated.timing(activityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(activityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();
    }, 4000);

    return () => {
      clearInterval(timeInterval);
      clearInterval(activityInterval);
    };
  }, []);

  const scanTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-100, 100],
  });

  // Agent activities data
  const agentActivities = [
    {
      id: 1,
      action: 'Auto Round-up',
      detail: 'Invested ₹47 from 3 transactions',
      time: '2 min ago',
      icon: 'wallet',
      color: '#4CAF50',
    },
    {
      id: 2,
      action: 'Portfolio Rebalance',
      detail: 'Optimized asset allocation',
      time: '15 min ago',
      icon: 'pie-chart',
      color: '#2196F3',
    },
    {
      id: 3,
      action: 'Goal Analysis',
      detail: 'Updated bike goal timeline',
      time: '1 hour ago',
      icon: 'analytics',
      color: '#FFA726',
    },
    {
      id: 4,
      action: 'Learning Path',
      detail: 'Suggested "Risk Management" course',
      time: '3 hours ago',
      icon: 'school',
      color: '#9C27B0',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colorScheme === 'dark' ? 'light-content' : 'dark-content'} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>
              Good {currentTime.getHours() < 12 ? 'Morning' : currentTime.getHours() < 18 ? 'Afternoon' : 'Evening'}
            </Text>
            <Text style={[styles.userName, { color: colors.text }]}>Your AI Agent is Active 🤖</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications' as any)}>
            <View style={styles.notificationIconWrapper}>
              <Ionicons name="notifications-outline" size={24} color={colors.text} />
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>2</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Live Agent Status Card */}
        <TouchableOpacity 
          activeOpacity={0.9}
          onPress={() => setAgentModalVisible(true)}
          style={styles.agentStatusContainer}
        >
          <LinearGradient
            colors={['#5B54FF', '#7B75FF']}
            style={styles.agentStatusGradient}
          >
            {/* Scanning effect */}
            <Animated.View
              style={[
                styles.scanLine,
                {
                  transform: [{ translateX: scanTranslate }],
                  backgroundColor: agentColor,
                },
              ]}
            />

            <View style={styles.agentStatusContent}>
              <Animated.View
                style={[
                  styles.agentIcon,
                  {
                    transform: [{ scale: agentPulse }],
                    backgroundColor: agentColor + '30',
                  },
                ]}
              >
                <Text style={styles.agentEmoji}>🤖</Text>
                <View style={[styles.activeIndicator, { backgroundColor: agentColor }]} />
              </Animated.View>

              <View style={styles.agentStatusText}>
                <Text style={styles.agentStatusTitle}>Agentic AI Working</Text>
                <Animated.Text
                  style={[
                    styles.agentActivityText,
                    { opacity: activityAnim },
                  ]}
                >
                  {agentActivity}
                </Animated.Text>
                <View style={styles.agentMetrics}>
                  <View style={styles.metricItem}>
                    <Ionicons name="flash" size={14} color="#FFD700" />
                    <Text style={styles.metricText}>24/7 Active</Text>
                  </View>
                  <View style={styles.metricItem}>
                    <Ionicons name="trending-up" size={14} color="#4CAF50" />
                    <Text style={styles.metricText}>₹247 Today</Text>
                  </View>
                </View>
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Portfolio Card with AI Management */}
        <Card style={styles.portfolioCard}>
          <View style={styles.portfolioHeader}>
            <View>
              <Text style={[styles.portfolioLabel, { color: colors.textSecondary }]}>
                Total Portfolio Value
              </Text>
              <Text style={[styles.portfolioValue, { color: colors.text }]}>₹5,250</Text>
            </View>
            <View style={styles.portfolioChange}>
              <Ionicons name="arrow-up" size={16} color="#4CAF50" />
              <Text style={styles.changeText}>+₹250 (5%)</Text>
            </View>
          </View>
          <View style={styles.portfolioStats}>
            <View style={styles.statsItem}>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Invested</Text>
              <Text style={[styles.statsValue, { color: colors.text }]}>₹4,800</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsItem}>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>Returns</Text>
              <Text style={[styles.statsValue, { color: '#4CAF50' }]}>₹450</Text>
            </View>
            <View style={styles.statsDivider} />
            <View style={styles.statsItem}>
              <Text style={[styles.statsLabel, { color: colors.textSecondary }]}>AI Managed</Text>
              <Text style={[styles.statsValue, { color: colors.text }]}>100%</Text>
            </View>
          </View>
          <View style={styles.aiManagedBadge}>
            <Ionicons name="sparkles" size={12} color="#FFD700" />
            <Text style={styles.aiManagedText}>Fully Managed by AI Agent</Text>
          </View>
        </Card>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/invest')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="add-circle-outline" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Invest</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/goals')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.secondary + '20' }]}>
                <Ionicons name="flag-outline" size={28} color={colors.secondary} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>New Goal</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/invest')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="repeat-outline" size={28} color={colors.success} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>Round-up</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => router.push('/(tabs)/learn')}
            >
              <View style={[styles.actionIcon, { backgroundColor: colors.warning + '20' }]}>
                <Ionicons name="chatbubble-outline" size={28} color={colors.warning} />
              </View>
              <Text style={[styles.actionLabel, { color: colors.text }]}>AI Coach</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Active Goals - Agent Suggested */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Goals</Text>
            <View style={styles.agentBadge}>
              <Ionicons name="sparkles" size={12} color="#FFD700" />
              <Text style={styles.agentBadgeText}>AI Suggested</Text>
            </View>
          </View>

          <Card style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <Text style={styles.goalEmoji}>🚲</Text>
              </View>
              <View style={styles.flex}>
                <View style={styles.goalTitleRow}>
                  <Text style={[styles.goalTitle, { color: colors.text }]}>New Bike</Text>
                  <View style={styles.agentTag}>
                    <Ionicons name="hardware-chip" size={10} color="#9C27B0" />
                  </View>
                </View>
                <Text style={[styles.goalAmount, { color: colors.textSecondary }]}>
                  ₹12,500 / ₹45,000
                </Text>
              </View>
            </View>
            <ProgressBar progress={28} color="#4CAF50" style={styles.goalProgress} />
            <View style={styles.goalFooter}>
              <Text style={[styles.goalDays, { color: colors.textSecondary }]}>
                Agent tracking: 32 months left
              </Text>
              <Text style={[styles.goalPercentage, { color: '#4CAF50' }]}>28%</Text>
            </View>
          </Card>

          <Card style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <Text style={styles.goalEmoji}>✈️</Text>
              </View>
              <View style={styles.flex}>
                <View style={styles.goalTitleRow}>
                  <Text style={[styles.goalTitle, { color: colors.text }]}>Goa Trip</Text>
                  <View style={styles.agentTag}>
                    <Ionicons name="hardware-chip" size={10} color="#9C27B0" />
                  </View>
                </View>
                <Text style={[styles.goalAmount, { color: colors.textSecondary }]}>
                  ₹8,200 / ₹30,000
                </Text>
              </View>
            </View>
            <ProgressBar progress={27} color="#2196F3" style={styles.goalProgress} />
            <View style={styles.goalFooter}>
              <Text style={[styles.goalDays, { color: colors.textSecondary }]}>
                Agent tracking: 18 months left
              </Text>
              <Text style={[styles.goalPercentage, { color: '#2196F3' }]}>27%</Text>
            </View>
          </Card>
        </View>

        {/* Agent Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Agent Activities</Text>
            <TouchableOpacity>
              <Text style={[styles.seeAll, { color: colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>

          {agentActivities.map((activity) => (
            <Card key={activity.id} style={styles.activityCard}>
              <View style={styles.activityRow}>
                <View style={[styles.activityIcon, { backgroundColor: activity.color + '20' }]}>
                  <Ionicons name={activity.icon as any} size={20} color={activity.color} />
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.activityTitle, { color: colors.text }]}>
                    {activity.action}
                  </Text>
                  <Text style={[styles.activityDetail, { color: colors.textSecondary }]}>
                    {activity.detail}
                  </Text>
                </View>
                <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                  {activity.time}
                </Text>
              </View>
            </Card>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Agent Activity Details Modal */}
      <Modal
        visible={agentModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setAgentModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setAgentModalVisible(false)} activeOpacity={0.7}>
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Agent Activity Details</Text>
            <View style={{ width: 28 }} />
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Current Status */}
            <Card style={styles.modalCard}>
              <View style={styles.modalStatusHeader}>
                <Animated.View
                  style={[
                    styles.modalAgentIcon,
                    {
                      transform: [{ scale: agentPulse }],
                      backgroundColor: agentColor + '30',
                    },
                  ]}
                >
                  <Text style={styles.modalAgentEmoji}>🤖</Text>
                </Animated.View>
                <View style={styles.flex}>
                  <Text style={[styles.modalAgentTitle, { color: colors.text }]}>
                    Agentic AI is Active
                  </Text>
                  <Text style={[styles.modalAgentStatus, { color: agentColor }]}>
                    {agentActivity}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Activity Timeline */}
            <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Recent Activities</Text>
            
            <Card style={styles.timelineCard}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#4CAF50' }]} />
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineTitle, { color: colors.text }]}>
                    Portfolio Rebalanced
                  </Text>
                  <Text style={[styles.timelineDesc, { color: colors.textSecondary }]}>
                    Agent optimized your portfolio allocation
                  </Text>
                  <Text style={[styles.timelineTime, { color: colors.textSecondary }]}>
                    2 minutes ago
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.timelineCard}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#2196F3' }]} />
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineTitle, { color: colors.text }]}>
                    Round-up Executed
                  </Text>
                  <Text style={[styles.timelineDesc, { color: colors.textSecondary }]}>
                    Invested ₹247 from today's transactions
                  </Text>
                  <Text style={[styles.timelineTime, { color: colors.textSecondary }]}>
                    15 minutes ago
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.timelineCard}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#9C27B0' }]} />
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineTitle, { color: colors.text }]}>
                    Spending Pattern Analyzed
                  </Text>
                  <Text style={[styles.timelineDesc, { color: colors.textSecondary }]}>
                    Identified savings opportunity of ₹1,200/month
                  </Text>
                  <Text style={[styles.timelineTime, { color: colors.textSecondary }]}>
                    1 hour ago
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.timelineCard}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#FFA726' }]} />
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineTitle, { color: colors.text }]}>
                    Goal Progress Updated
                  </Text>
                  <Text style={[styles.timelineDesc, { color: colors.textSecondary }]}>
                    "New Bike" goal reached 28% - on track!
                  </Text>
                  <Text style={[styles.timelineTime, { color: colors.textSecondary }]}>
                    3 hours ago
                  </Text>
                </View>
              </View>
            </Card>

            <Card style={styles.timelineCard}>
              <View style={styles.timelineItem}>
                <View style={[styles.timelineDot, { backgroundColor: '#00BCD4' }]} />
                <View style={styles.timelineContent}>
                  <Text style={[styles.timelineTitle, { color: colors.text }]}>
                    Learning Preferences Updated
                  </Text>
                  <Text style={[styles.timelineDesc, { color: colors.textSecondary }]}>
                    Agent adapted to your investment style
                  </Text>
                  <Text style={[styles.timelineTime, { color: colors.textSecondary }]}>
                    5 hours ago
                  </Text>
                </View>
              </View>
            </Card>

            {/* Stats */}
            <Text style={[styles.modalSectionTitle, { color: colors.text }]}>Today's Performance</Text>
            
            <View style={styles.statsGrid}>
              <Card style={styles.statCard}>
                <Ionicons name="flash" size={24} color="#FFD700" />
                <Text style={[styles.statValue, { color: colors.text }]}>24/7</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Active</Text>
              </Card>

              <Card style={styles.statCard}>
                <Ionicons name="trending-up" size={24} color="#4CAF50" />
                <Text style={[styles.statValue, { color: colors.text }]}>₹247</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Invested</Text>
              </Card>

              <Card style={styles.statCard}>
                <Ionicons name="analytics" size={24} color="#2196F3" />
                <Text style={[styles.statValue, { color: colors.text }]}>12</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Transactions</Text>
              </Card>

              <Card style={styles.statCard}>
                <Ionicons name="checkmark-circle" size={24} color="#9C27B0" />
                <Text style={[styles.statValue, { color: colors.text }]}>5</Text>
                <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Actions</Text>
              </Card>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  greeting: {
    fontSize: Typography.fontSize.sm,
  },
  userName: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  portfolioCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.xl,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  portfolioLabel: {
    fontSize: Typography.fontSize.sm,
    opacity: 0.9,
  },
  eyeIcon: {
    padding: Spacing.xs,
  },
  portfolioValue: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
  },
  portfolioStats: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statText: {
    fontSize: Typography.fontSize.sm,
    opacity: 0.9,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  seeAll: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    alignItems: 'center',
    width: (width - Spacing.lg * 2 - Spacing.md * 3) / 4,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  actionLabel: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  goalCard: {
    marginBottom: Spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  goalEmoji: {
    fontSize: 24,
  },
  flex: {
    flex: 1,
  },
  goalTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  goalAmount: {
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs / 2,
  },
  goalProgress: {
    marginBottom: Spacing.sm,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  goalDays: {
    fontSize: Typography.fontSize.sm,
  },
  goalPercentage: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  activityCard: {
    marginBottom: Spacing.sm,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  activityTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  activityTime: {
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.xs / 2,
  },
  activityAmount: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  streakCard: {
    paddingVertical: Spacing.xl,
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
  },
  streakContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  streakLabel: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
    opacity: 0.9,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  streakValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  continueButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  continueText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  notificationIconWrapper: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6584',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // AGENT STATUS CARD
  agentStatusContainer: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    borderRadius: 20,
    overflow: 'hidden',
  },
  agentStatusGradient: {
    padding: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  scanLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 100,
    opacity: 0.3,
  },
  agentStatusContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  agentIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  agentEmoji: {
    fontSize: 36,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  agentStatusText: {
    flex: 1,
  },
  agentStatusTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  agentActivityText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 8,
  },
  agentMetrics: {
    flexDirection: 'row',
    gap: 16,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '700',
  },

  // PORTFOLIO UPDATES
  portfolioChange: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  changeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4CAF50',
  },
  statsItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  statsDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E0E0E0',
  },
  aiManagedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginTop: 12,
    gap: 6,
  },
  aiManagedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFA500',
  },

  // AGENT BADGES
  agentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  agentBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFA500',
    textTransform: 'uppercase',
  },
  agentTag: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(156, 39, 176, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  goalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // ACTIVITY DETAILS
  activityDetail: {
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.xs / 2,
  },

  // LEARNING CARDS
  learningCard: {
    marginBottom: Spacing.md,
  },
  learningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  learningIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  learningTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  learningMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  xpBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  xpText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFA500',
  },
  learningStatus: {
    fontSize: 12,
    fontWeight: '600',
  },
  recommendedBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(156, 39, 176, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  learningProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  learningProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  learningProgressFill: {
    height: '100%',
    borderRadius: 3,
  },
  learningProgressText: {
    fontSize: 13,
    fontWeight: '700',
    width: 40,
    textAlign: 'right',
  },

  // MODAL STYLES
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
  },
  modalCard: {
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  modalStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  modalAgentIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalAgentEmoji: {
    fontSize: 28,
  },
  modalAgentTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs / 2,
  },
  modalAgentStatus: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  modalSectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  timelineCard: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  timelineItem: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs / 2,
  },
  timelineDesc: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs / 2,
  },
  timelineTime: {
    fontSize: Typography.fontSize.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  statCard: {
    flex: 1,
    minWidth: (width - Spacing.lg * 3) / 2,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    marginTop: Spacing.xs / 2,
  },
});

