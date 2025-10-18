import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress-bar';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LearnScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const lessons = [
    {
      id: 1,
      title: 'What is Investing?',
      category: 'Basics',
      duration: '5 min',
      points: 10,
      completed: true,
      icon: '📚',
    },
    {
      id: 2,
      title: 'Understanding Mutual Funds',
      category: 'Basics',
      duration: '8 min',
      points: 15,
      completed: false,
      icon: '📊',
    },
    {
      id: 3,
      title: 'Power of Compounding',
      category: 'Advanced',
      duration: '10 min',
      points: 20,
      completed: false,
      icon: '🚀',
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Learn</Text>
        </View>

        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <View>
              <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>
                Learning Streak
              </Text>
              <View style={styles.streakRow}>
                <Ionicons name="flame" size={24} color="#FF6584" />
                <Text style={[styles.streakValue, { color: colors.text }]}>15 days</Text>
              </View>
            </View>
            <View style={styles.levelBadge}>
              <Text style={[styles.levelText, { color: colors.primary }]}>Level 3</Text>
            </View>
          </View>

          <View style={styles.xpRow}>
            <Text style={[styles.xpLabel, { color: colors.textSecondary }]}>
              120 / 200 XP
            </Text>
            <Text style={[styles.xpPercentage, { color: colors.textSecondary }]}>60%</Text>
          </View>
          <ProgressBar progress={60} color={colors.primary} height={8} />
        </Card>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Badges</Text>
          <View style={styles.badgesRow}>
            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: colors.success + '20' }]}>
                <Text style={styles.badgeEmoji}>🎯</Text>
              </View>
              <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>
                First Goal
              </Text>
            </View>
            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: colors.warning + '20' }]}>
                <Text style={styles.badgeEmoji}>🔥</Text>
              </View>
              <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>
                15 Day Streak
              </Text>
            </View>
            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: colors.info + '20' }]}>
                <Text style={styles.badgeEmoji}>📚</Text>
              </View>
              <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>
                Quick Learner
              </Text>
            </View>
          </View>
        </View>

        {/* Lessons */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Continue Learning</Text>
          {lessons.map((lesson) => (
            <Card key={lesson.id} style={styles.lessonCard} onPress={() => {}}>
              <View style={styles.lessonHeader}>
                <View style={styles.lessonIconContainer}>
                  <Text style={styles.lessonIcon}>{lesson.icon}</Text>
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.lessonTitle, { color: colors.text }]}>
                    {lesson.title}
                  </Text>
                  <View style={styles.lessonMeta}>
                    <Badge label={lesson.category} variant="primary" size="sm" />
                    <View style={styles.metaItem}>
                      <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {lesson.duration}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                        {lesson.points} pts
                      </Text>
                    </View>
                  </View>
                </View>
                {lesson.completed && (
                  <View style={[styles.completedIcon, { backgroundColor: colors.success }]}>
                    <Ionicons name="checkmark" size={20} color={colors.textInverse} />
                  </View>
                )}
              </View>
            </Card>
          ))}
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  progressCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  progressLabel: {
    fontSize: Typography.fontSize.sm,
    marginBottom: Spacing.xs,
  },
  streakRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakValue: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginLeft: Spacing.xs,
  },
  levelBadge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: '#6C63FF20',
    borderRadius: 20,
  },
  levelText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  xpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  xpLabel: {
    fontSize: Typography.fontSize.sm,
  },
  xpPercentage: {
    fontSize: Typography.fontSize.sm,
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.md,
  },
  badgesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  badgeItem: {
    alignItems: 'center',
  },
  badgeIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badgeEmoji: {
    fontSize: 32,
  },
  badgeLabel: {
    fontSize: Typography.fontSize.xs,
  },
  lessonCard: {
    marginBottom: Spacing.md,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  lessonIcon: {
    fontSize: 24,
  },
  flex: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  lessonMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  metaText: {
    fontSize: Typography.fontSize.xs,
  },
  completedIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
