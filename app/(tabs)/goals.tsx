import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress-bar';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function GoalsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const goals = [
    {
      id: 1,
      emoji: '📱',
      title: 'New iPhone',
      current: 15000,
      target: 30000,
      progress: 50,
      color: colors.goals.gadgets,
    },
    {
      id: 2,
      emoji: '✈️',
      title: 'Trip to Goa',
      current: 8000,
      target: 20000,
      progress: 40,
      color: colors.goals.travel,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>My Goals</Text>
          <Button
            title="New Goal"
            variant="primary"
            size="sm"
            icon={<Ionicons name="add" size={18} color={colors.textInverse} />}
            onPress={() => {}}
          />
        </View>

        {/* Stats Summary */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Active Goals
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>2</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Saved
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>₹23,000</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Completed
              </Text>
              <Text style={[styles.statValue, { color: colors.success }]}>3</Text>
            </View>
          </View>
        </Card>

        {/* Goals List */}
        <View style={styles.section}>
          {goals.map((goal) => (
            <Card key={goal.id} style={styles.goalCard} onPress={() => {}}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIcon}>
                  <Text style={styles.emoji}>{goal.emoji}</Text>
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.goalTitle, { color: colors.text }]}>{goal.title}</Text>
                  <View style={styles.amountRow}>
                    <Text style={[styles.currentAmount, { color: goal.color }]}>
                      ₹{goal.current.toLocaleString()}
                    </Text>
                    <Text style={[styles.targetAmount, { color: colors.textSecondary }]}>
                      {' '}
                      / ₹{goal.target.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              <ProgressBar progress={goal.progress} color={goal.color} style={styles.progress} />

              <View style={styles.goalFooter}>
                <View>
                  <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>
                    Progress
                  </Text>
                  <Text style={[styles.footerValue, { color: colors.text }]}>
                    {goal.progress}%
                  </Text>
                </View>
                <Button
                  title="Contribute"
                  variant="primary"
                  size="sm"
                  onPress={() => {}}
                  icon={<Ionicons name="add-circle-outline" size={16} color={colors.textInverse} />}
                />
              </View>
            </Card>
          ))}
        </View>

        {/* Empty State for New Users */}
        {goals.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyEmoji]}>🎯</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No goals yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Create your first goal and start saving!
            </Text>
            <Button title="Create Goal" variant="primary" onPress={() => {}} style={styles.emptyButton} />
          </View>
        )}

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
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  statsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  section: {
    paddingHorizontal: Spacing.lg,
  },
  goalCard: {
    marginBottom: Spacing.md,
  },
  goalHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  goalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  flex: {
    flex: 1,
  },
  goalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: Spacing.xs,
  },
  currentAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  targetAmount: {
    fontSize: Typography.fontSize.base,
  },
  progress: {
    marginBottom: Spacing.md,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: Typography.fontSize.xs,
  },
  footerValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginTop: Spacing.xs / 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    minWidth: 200,
  },
});
