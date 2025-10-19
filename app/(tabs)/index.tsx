import Card from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress-bar';
import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  const router = useRouter();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome back,</Text>
            <Text style={[styles.userName, { color: colors.text }]}>Rahul! 👋</Text>
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

        {/* Portfolio Card */}
        <View style={[styles.portfolioCard, { backgroundColor: colors.primary }]}>
          <View style={styles.portfolioHeader}>
            <Text style={[styles.portfolioLabel, { color: colors.textInverse }]}>
              Total Portfolio Value
            </Text>
            <View style={styles.eyeIcon}>
              <Ionicons name="eye-outline" size={20} color={colors.textInverse} />
            </View>
          </View>
          <Text style={[styles.portfolioValue, { color: colors.textInverse }]}>₹5,250</Text>
          <View style={styles.portfolioStats}>
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={16} color={colors.textInverse} />
              <Text style={[styles.statText, { color: colors.textInverse }]}>
                +₹250 (5.0%)
              </Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="calendar-outline" size={16} color={colors.textInverse} />
              <Text style={[styles.statText, { color: colors.textInverse }]}>This month</Text>
            </View>
          </View>
        </View>

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

        {/* Active Goals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Active Goals</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/goals')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>

          <Card style={styles.goalCard}>
            <View style={styles.goalHeader}>
              <View style={styles.goalIconContainer}>
                <Text style={styles.goalEmoji}>📱</Text>
              </View>
              <View style={styles.flex}>
                <Text style={[styles.goalTitle, { color: colors.text }]}>New iPhone</Text>
                <Text style={[styles.goalAmount, { color: colors.textSecondary }]}>
                  ₹15,000 / ₹30,000
                </Text>
              </View>
            </View>
            <ProgressBar progress={50} color={colors.goals.gadgets} style={styles.goalProgress} />
            <View style={styles.goalFooter}>
              <Text style={[styles.goalDays, { color: colors.textSecondary }]}>
                45 days left
              </Text>
              <Text style={[styles.goalPercentage, { color: colors.goals.gadgets }]}>50%</Text>
            </View>
          </Card>
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Activity</Text>

          <Card style={styles.activityCard}>
            <View style={styles.activityRow}>
              <View style={[styles.activityIcon, { backgroundColor: colors.success + '20' }]}>
                <Ionicons name="arrow-up" size={20} color={colors.success} />
              </View>
              <View style={styles.flex}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>
                  Round-up Investment
                </Text>
                <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                  2 hours ago
                </Text>
              </View>
              <Text style={[styles.activityAmount, { color: colors.success }]}>+₹10</Text>
            </View>
          </Card>

          <Card style={styles.activityCard}>
            <View style={styles.activityRow}>
              <View style={[styles.activityIcon, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="trophy" size={20} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text style={[styles.activityTitle, { color: colors.text }]}>
                  Badge Earned: 15 Day Streak
                </Text>
                <Text style={[styles.activityTime, { color: colors.textSecondary }]}>
                  1 day ago
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Learning Streak */}
        <View style={styles.section}>
          <View style={[styles.streakCard, { backgroundColor: '#FF6584' }]}>
            <View style={styles.streakContent}>
              <View>
                <Text style={[styles.streakLabel, { color: colors.textInverse }]}>
                  Learning Streak
                </Text>
                <View style={styles.streakRow}>
                  <Ionicons name="flame" size={32} color={colors.textInverse} />
                  <Text style={[styles.streakValue, { color: colors.textInverse }]}>15 Days</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.continueButton}>
                <Text style={[styles.continueText, { color: '#FF6584' }]}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
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
});

