import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress-bar';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function InvestScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Invest</Text>
          <TouchableOpacity>
            <Ionicons name="information-circle-outline" size={24} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Quick Stats */}
        <Card style={styles.statsCard}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Monthly Investment
          </Text>
          <Text style={[styles.statValue, { color: colors.text }]}>₹1,245</Text>
          <Text style={[styles.statSubtext, { color: colors.success }]}>
            <Ionicons name="trending-up" size={14} /> +15% from last month
          </Text>
        </Card>

        {/* Round-up Settings */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Round-up Investments</Text>
          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.iconContainer}>
                <Ionicons name="repeat" size={24} color={colors.primary} />
              </View>
              <View style={styles.flex}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Auto Round-up
                </Text>
                <Text style={[styles.cardSubtext, { color: colors.textSecondary }]}>
                  Round purchases to ₹10
                </Text>
              </View>
              <View style={[styles.toggleOn, { backgroundColor: colors.primary }]}>
                <Text style={[styles.toggleText, { color: colors.textInverse }]}>ON</Text>
              </View>
            </View>
          </Card>

          <Card style={styles.card}>
            <View style={styles.row}>
              <View>
                <Text style={[styles.cardTitle, { color: colors.text }]}>This Month</Text>
                <Text style={[styles.amountText, { color: colors.primary }]}>₹340</Text>
              </View>
              <View>
                <Text style={[styles.cardSubtext, { color: colors.textSecondary }]}>
                  23 transactions
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* Manual Investment */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Manual Investment</Text>
          <Button
            title="Invest Now"
            variant="primary"
            fullWidth
            icon={<Ionicons name="add-circle-outline" size={20} color={colors.textInverse} />}
            onPress={() => {}}
          />
        </View>

        {/* Auto-Invest Setup */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Auto-Invest</Text>
          <Card style={styles.card}>
            <View style={styles.row}>
              <View style={styles.flex}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>
                  Daily Auto-Invest
                </Text>
                <Text style={[styles.cardSubtext, { color: colors.textSecondary }]}>
                  Set it and forget it
                </Text>
              </View>
              <Button title="Setup" variant="outline" onPress={() => {}} />
            </View>
          </Card>
        </View>

        {/* Investment Allocation */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Investment Allocation
          </Text>
          <Card style={styles.card}>
            <View style={styles.allocationRow}>
              <View style={styles.allocationInfo}>
                <View style={[styles.dot, { backgroundColor: colors.investment.equity }]} />
                <Text style={[styles.allocationLabel, { color: colors.text }]}>
                  Index Funds
                </Text>
              </View>
              <Text style={[styles.allocationValue, { color: colors.text }]}>60%</Text>
            </View>
            <ProgressBar progress={60} color={colors.investment.equity} height={6} />

            <View style={[styles.allocationRow, { marginTop: Spacing.md }]}>
              <View style={styles.allocationInfo}>
                <View style={[styles.dot, { backgroundColor: colors.investment.gold }]} />
                <Text style={[styles.allocationLabel, { color: colors.text }]}>
                  Digital Gold
                </Text>
              </View>
              <Text style={[styles.allocationValue, { color: colors.text }]}>30%</Text>
            </View>
            <ProgressBar progress={30} color={colors.investment.gold} height={6} />

            <View style={[styles.allocationRow, { marginTop: Spacing.md }]}>
              <View style={styles.allocationInfo}>
                <View style={[styles.dot, { backgroundColor: colors.investment.bonds }]} />
                <Text style={[styles.allocationLabel, { color: colors.text }]}>Bonds</Text>
              </View>
              <Text style={[styles.allocationValue, { color: colors.text }]}>10%</Text>
            </View>
            <ProgressBar progress={10} color={colors.investment.bonds} height={6} />
          </Card>
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
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  statsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  statValue: {
    fontSize: Typography.fontSize['4xl'],
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.xs,
  },
  statSubtext: {
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
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
  card: {
    marginBottom: Spacing.md,
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
  amountText: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    marginTop: Spacing.xs,
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
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  allocationLabel: {
    fontSize: Typography.fontSize.sm,
  },
  allocationValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
});
