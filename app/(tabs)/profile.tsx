import Card from '@/components/ui/card';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const menuItems = [
    {
      id: 1,
      title: 'Account Settings',
      icon: 'person-outline',
      color: colors.primary,
    },
    {
      id: 2,
      title: 'Linked Banks',
      icon: 'card-outline',
      color: colors.secondary,
    },
    {
      id: 3,
      title: 'Notifications',
      icon: 'notifications-outline',
      color: colors.warning,
    },
    {
      id: 4,
      title: 'Security & Privacy',
      icon: 'shield-checkmark-outline',
      color: colors.success,
    },
    {
      id: 5,
      title: 'Help & Support',
      icon: 'help-circle-outline',
      color: colors.info,
    },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
        </View>

        {/* User Info Card */}
        <Card style={styles.userCard}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.primary + '20' }]}>
              <Text style={styles.avatarText}>RS</Text>
            </View>
          </View>
          <Text style={[styles.userName, { color: colors.text }]}>Rahul Sharma</Text>
          <Text style={[styles.userEmail, { color: colors.textSecondary }]}>
            rahul@example.com
          </Text>
          <View style={styles.kycBadge}>
            <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            <Text style={[styles.kycText, { color: colors.success }]}>KYC Verified</Text>
          </View>
        </Card>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>₹5,250</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              Portfolio Value
            </Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="flame" size={24} color="#FF6584" />
            <Text style={[styles.statValue, { color: colors.text }]}>15</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Day Streak</Text>
          </Card>
          <Card style={styles.statCard}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={[styles.statValue, { color: colors.text }]}>Level 3</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Rank</Text>
          </Card>
        </View>

        {/* Menu Items */}
        <View style={styles.section}>
          {menuItems.map((item) => (
            <TouchableOpacity key={item.id}>
              <Card style={styles.menuCard}>
                <View style={styles.menuRow}>
                  <View
                    style={[
                      styles.menuIcon,
                      { backgroundColor: item.color + '20' },
                    ]}
                  >
                    <Ionicons name={item.icon as any} size={24} color={item.color} />
                  </View>
                  <Text style={[styles.menuTitle, { color: colors.text }]}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                </View>
              </Card>
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <View style={styles.section}>
          <TouchableOpacity>
            <Card style={styles.logoutCard}>
              <View style={styles.menuRow}>
                <View
                  style={[
                    styles.menuIcon,
                    { backgroundColor: colors.error + '20' },
                  ]}
                >
                  <Ionicons name="log-out-outline" size={24} color={colors.error} />
                </View>
                <Text style={[styles.menuTitle, { color: colors.error }]}>Logout</Text>
              </View>
            </Card>
          </TouchableOpacity>
        </View>

        {/* App Version */}
        <Text style={[styles.versionText, { color: colors.textTertiary }]}>
          Grow-Z v1.0.0
        </Text>

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
  userCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  avatarContainer: {
    marginBottom: Spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: Typography.fontWeight.bold,
    color: '#6C63FF',
  },
  userName: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs / 2,
  },
  userEmail: {
    fontSize: Typography.fontSize.base,
    marginBottom: Spacing.md,
  },
  kycBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  kycText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.medium,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  statValue: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.bold,
    marginVertical: Spacing.xs,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  menuCard: {
    marginBottom: Spacing.sm,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  menuTitle: {
    flex: 1,
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.medium,
  },
  logoutCard: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  versionText: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
    marginVertical: Spacing.md,
  },
});
