import Badge from '@/components/ui/badge';
import Card from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress-bar';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function LearnScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Animation values
  const agentPulse = useRef(new Animated.Value(1)).current;
  const agentOpacity = useRef(new Animated.Value(0.3)).current;
  const [agentMessage, setAgentMessage] = useState('Analyzing your learning style...');
  const [messageIndex, setMessageIndex] = useState(0);

  // Agent messages rotation
  const agentMessages = [
    '🎯 Found 3 perfect lessons for you!',
    '🚀 You\'re crushing it! Keep going!',
    '💡 Based on your portfolio...',
    '📊 Smart choice! Let\'s learn together',
    '🔥 Your streak is on fire!',
  ];

  useEffect(() => {
    // Pulse animation
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

    // Opacity/Glow animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(agentOpacity, {
          toValue: 0.6,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(agentOpacity, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Message rotation
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % agentMessages.length);
    }, 4000);

    return () => clearInterval(messageInterval);
  }, []);

  useEffect(() => {
    setAgentMessage(agentMessages[messageIndex]);
  }, [messageIndex]);

  // Learning categories with AI personalization
  const categories = [
    {
      id: 1,
      title: 'Mutual Funds Basics',
      icon: '📊',
      color: '#6C63FF',
      lessons: 12,
      agentRecommended: true,
      description: 'Agent explains in Gen Z language',
    },
    {
      id: 2,
      title: 'Smart Investing',
      icon: '💰',
      color: '#4CAF50',
      lessons: 8,
      agentRecommended: false,
      description: 'Real-time market insights',
    },
    {
      id: 3,
      title: 'Portfolio Strategy',
      icon: '📈',
      color: '#FF9800',
      lessons: 15,
      agentRecommended: true,
      description: 'Personalized for your goals',
    },
    {
      id: 4,
      title: 'Risk Management',
      icon: '🎯',
      color: '#F44336',
      lessons: 10,
      agentRecommended: false,
      description: 'Agent analyzes your risk profile',
    },
  ];

  const lessons = [
    {
      id: 1,
      title: 'Understanding SIP & Mutual Funds',
      category: 'Recommended',
      duration: '8 min',
      points: 25,
      completed: false,
      icon: '📊',
      agentPick: true,
      difficulty: 'Beginner',
      insights: 'Agent found this perfect for your portfolio',
    },
    {
      id: 2,
      title: 'Power of Compounding',
      category: 'Popular',
      duration: '10 min',
      points: 30,
      completed: false,
      icon: '🚀',
      agentPick: true,
      difficulty: 'Intermediate',
      insights: 'Based on your investment goals',
    },
    {
      id: 3,
      title: 'What is Investing?',
      category: 'Basics',
      duration: '5 min',
      points: 15,
      completed: true,
      icon: '📚',
      agentPick: false,
      difficulty: 'Beginner',
      insights: null,
    },
    {
      id: 4,
      title: 'Diversification Strategies',
      category: 'Advanced',
      duration: '12 min',
      points: 40,
      completed: false,
      icon: '🎯',
      agentPick: false,
      difficulty: 'Advanced',
      insights: 'Unlocks at Level 5',
    },
  ];

  return (
    <LinearGradient
      colors={['#FAFAFA', '#F5F5FF', '#FFF5FA']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: '#1A1A1A' }]}>AI-Powered Learning</Text>
            <Text style={[styles.subtitle, { color: '#666' }]}>
              Your personal AI coach curating lessons
            </Text>
          </View>

          {/* Hero Agent Section */}
          <Card style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.agentSection}>
              <View style={styles.agentAvatarContainer}>
                <Animated.View
                  style={[
                    styles.agentAvatarGlow,
                    {
                      transform: [{ scale: agentPulse }],
                      backgroundColor: colors.primary + '20',
                      opacity: agentOpacity,
                    },
                  ]}
                />
                <View style={[styles.agentAvatar, { backgroundColor: colors.primary + '15' }]}>
                  <Text style={styles.agentEmoji}>🤖</Text>
                  <View style={[styles.agentStatus, { backgroundColor: colors.success }]}>
                    <View style={styles.agentStatusDot} />
                  </View>
                </View>
              </View>
              <View style={styles.agentMessageContainer}>
                <Text style={[styles.agentLabel, { color: colors.textSecondary }]}>
                  Your AI Learning Coach
                </Text>
                <Text style={[styles.agentMessage, { color: colors.text }]}>
                  {agentMessage}
                </Text>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={[styles.chatButton, { backgroundColor: colors.primary }]}>
              <Ionicons name="chatbubbles" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Progress & Streak Card */}
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

        {/* Learning Categories */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            <Ionicons name="sparkles" size={20} color="#FFD700" /> Agent-Curated Paths
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
            {categories.map((category) => (
              <TouchableOpacity key={category.id} activeOpacity={0.7}>
                <Card style={styles.categoryCard}>
                  {category.agentRecommended && (
                    <View style={[styles.recommendedBadge, { backgroundColor: '#FFD700' }]}>
                      <Ionicons name="sparkles" size={12} color="#000" />
                      <Text style={styles.recommendedText}>AI Pick</Text>
                    </View>
                  )}
                  <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
                    <Text style={styles.categoryEmoji}>{category.icon}</Text>
                  </View>
                  <Text style={[styles.categoryTitle, { color: colors.text }]}>{category.title}</Text>
                  <Text style={[styles.categoryDesc, { color: colors.textSecondary }]}>
                    {category.description}
                  </Text>
                  <View style={styles.categoryFooter}>
                    <Ionicons name="book-outline" size={14} color={category.color} />
                    <Text style={[styles.categoryLessons, { color: category.color }]}>
                      {category.lessons} lessons
                    </Text>
                  </View>
                </Card>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Badges */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Achievement Wall</Text>
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
            <View style={styles.badgeItem}>
              <View style={[styles.badgeIcon, { backgroundColor: '#FFD700' + '20' }]}>
                <Text style={styles.badgeEmoji}>⭐</Text>
              </View>
              <Text style={[styles.badgeLabel, { color: colors.textSecondary }]}>
                Level 3
              </Text>
            </View>
          </View>
        </View>

        {/* Lessons */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Personalized For You</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {lessons.map((lesson) => (
            <TouchableOpacity key={lesson.id} activeOpacity={0.7}>
              <Card style={styles.lessonCard}>
                <View style={styles.lessonHeader}>
                  <View style={[
                    styles.lessonIconContainer,
                    { backgroundColor: lesson.agentPick ? colors.primary + '20' : colors.border }
                  ]}>
                    <Text style={styles.lessonIcon}>{lesson.icon}</Text>
                    {lesson.agentPick && (
                      <View style={[styles.agentPickBadge, { backgroundColor: '#FFD700' }]}>
                        <Ionicons name="sparkles" size={10} color="#000" />
                      </View>
                    )}
                  </View>
                  <View style={styles.flex}>
                    <View style={styles.lessonTitleRow}>
                      <Text style={[styles.lessonTitle, { color: colors.text }]}>
                        {lesson.title}
                      </Text>
                      {lesson.completed && (
                        <View style={[styles.completedIcon, { backgroundColor: colors.success }]}>
                          <Ionicons name="checkmark" size={16} color="#fff" />
                        </View>
                      )}
                    </View>
                    {lesson.insights && (
                      <View style={[styles.insightBanner, { backgroundColor: colors.warning + '15' }]}>
                        <Ionicons name="bulb" size={12} color={colors.warning} />
                        <Text style={[styles.insightText, { color: colors.textSecondary }]}>
                          {lesson.insights}
                        </Text>
                      </View>
                    )}
                    <View style={styles.lessonMeta}>
                      <Badge label={lesson.difficulty} variant="primary" size="sm" />
                      <View style={styles.metaItem}>
                        <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                          {lesson.duration}
                        </Text>
                      </View>
                      <View style={styles.metaItem}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={[styles.metaText, { color: colors.textSecondary }]}>
                          +{lesson.points} XP
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginTop: Spacing.sm,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.fontSize.sm,
    marginTop: Spacing.xs,
  },
  // Hero Agent Card
  heroCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  agentSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  agentAvatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  agentAvatarGlow: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    top: 0,
    left: 0,
    backgroundColor: '#6C63FF',
  },
  agentAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    backgroundColor: '#F5F5FF',
  },
  agentEmoji: {
    fontSize: 32,
  },
  agentStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  agentMessageContainer: {
    flex: 1,
  },
  agentLabel: {
    fontSize: Typography.fontSize.xs,
    marginBottom: Spacing.xs / 2,
  },
  agentMessage: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
  },
  chatButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
    backgroundColor: '#6C63FF',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  progressCard: {
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
    backgroundColor: '#F5F5FF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0FF',
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
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
    backgroundColor: '#F5F5FF',
  },
  badgeEmoji: {
    fontSize: 36,
  },
  badgeLabel: {
    fontSize: Typography.fontSize.xs,
  },
  lessonCard: {
    marginBottom: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  lessonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lessonIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5FF',
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
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Categories
  categoriesScroll: {
    marginLeft: -Spacing.lg,
    paddingLeft: Spacing.lg,
  },
  categoryCard: {
    width: width * 0.65,
    marginRight: Spacing.md,
    padding: Spacing.lg,
    position: 'relative',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  recommendedBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: 12,
    gap: Spacing.xs / 2,
    backgroundColor: '#FFF5E0',
    borderWidth: 1,
    borderColor: '#FFE0B2',
  },
  recommendedText: {
    fontSize: Typography.fontSize.xs - 2,
    fontWeight: Typography.fontWeight.bold,
    color: '#000',
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    backgroundColor: '#F5F5FF',
  },
  categoryEmoji: {
    fontSize: 28,
  },
  categoryTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
    marginBottom: Spacing.xs,
  },
  categoryDesc: {
    fontSize: Typography.fontSize.xs,
    marginBottom: Spacing.md,
    lineHeight: 16,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs / 2,
  },
  categoryLessons: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  seeAll: {
    fontSize: Typography.fontSize.sm,
    fontWeight: Typography.fontWeight.semibold,
  },
  // Lesson Cards
  agentPickBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: '#FFF5E0',
  },
  lessonTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  insightBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: 8,
    gap: Spacing.xs / 2,
    marginBottom: Spacing.sm,
    backgroundColor: '#FFF5E0',
  },
  insightText: {
    fontSize: Typography.fontSize.xs,
    flex: 1,
  },
});
