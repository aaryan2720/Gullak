import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useLayoutEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function FeaturesScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const agentPulse = useRef(new Animated.Value(1)).current;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  useEffect(() => {
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

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  const features = [
    {
      icon: 'wallet-outline',
      color: '#4CAF50',
      title: 'Auto Round-up',
      description: 'AI Agent automatically rounds up every purchase to ₹10 and invests spare change in diversified portfolios.',
      benefits: ['AI-powered automation', 'Save effortlessly', 'Grow passively'],
    },
    {
      icon: 'trophy-outline',
      color: '#FFA726',
      title: 'Goal-Based Investing',
      description: 'AI analyzes your spending and suggests personalized goals. Track progress for bike, vacation, or emergency fund.',
      benefits: ['AI goal suggestions', 'Smart tracking', 'Achieve faster'],
    },
    {
      icon: 'school-outline',
      color: '#2196F3',
      title: 'Learn & Earn',
      description: 'AI-driven gamified investing education! Complete lessons, quizzes, earn XP, unlock badges, and real rewards.',
      benefits: ['AI personalized lessons', 'Earn rewards', 'Build confidence'],
    },
    {
      icon: 'sparkles-outline',
      color: '#9C27B0',
      title: 'AI Investment Coach',
      description: '24/7 Agentic AI advisor that learns from your behavior. Get real-time investment tips, budget guidance, and portfolio recommendations.',
      benefits: ['Agentic AI brain', 'Learns your habits', 'Always available'],
    },
    {
      icon: 'pie-chart-outline',
      color: '#FF6584',
      title: 'AI Portfolio Manager',
      description: 'Agentic AI continuously monitors and rebalances your portfolio. Automatic diversification across mutual funds, stocks, and bonds.',
      benefits: ['AI auto-rebalancing', 'Risk optimization', 'Professional grade'],
    },
    {
      icon: 'shield-checkmark-outline',
      color: '#00BCD4',
      title: 'Bank-Grade Security',
      description: 'AI-powered fraud detection with 256-bit encryption, SEBI compliance, and secure biometric authentication.',
      benefits: ['AI fraud detection', 'SEBI approved', 'Biometric login'],
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Features</Text>
          <View style={styles.aiStatusDot} />
        </View>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Animated.View style={[styles.heroSection, { opacity: fadeAnim }]}>
          <Animated.View
            style={[
              styles.agentIconContainer,
              { transform: [{ scale: agentPulse }] },
            ]}
          >
            <LinearGradient
              colors={['#6C63FF', '#8F88FF']}
              style={styles.agentCircle}
            >
              <Text style={styles.agentEmoji}></Text>
              <View style={styles.activeIndicator} />
            </LinearGradient>
          </Animated.View>

          <Text style={styles.heroTitle}>AI-Powered Features</Text>
          <Text style={styles.heroSubtitle}>
            Discover how our intelligent agent helps you save, invest, and grow your wealth effortlessly
          </Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Ionicons name="flash" size={20} color="#FFD700" />
              <Text style={styles.statValue}>24/7</Text>
              <Text style={styles.statLabel}>Active</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="people" size={20} color="#6C63FF" />
              <Text style={styles.statValue}>50K+</Text>
              <Text style={styles.statLabel}>Users</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Ionicons name="trending-up" size={20} color="#4CAF50" />
              <Text style={styles.statValue}>₹10+</Text>
              <Text style={styles.statLabel}>Start From</Text>
            </View>
          </View>
        </Animated.View>

        <View style={styles.featuresContainer}>
          <Text style={styles.sectionTitle}>Core Features</Text>
          {features.map((feature, index) => (
            <Animated.View 
              key={index} 
              style={[styles.featureCard, { opacity: fadeAnim }]}
            >
              <View style={styles.featureContent}>
                <View style={styles.featureHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: feature.color + '20' }]}>
                    <Ionicons name={feature.icon as any} size={32} color={feature.color} />
                  </View>
                  <View style={styles.aiPoweredBadge}>
                    <Ionicons name="sparkles" size={10} color="#FFD700" />
                    <Text style={styles.aiPoweredText}>AI</Text>
                  </View>
                </View>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
                <View style={styles.benefitsContainer}>
                  {feature.benefits.map((benefit, idx) => (
                    <View key={idx} style={styles.benefitRow}>
                      <Ionicons name="checkmark-circle" size={16} color={feature.color} />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          <View style={styles.stepsContainer}>
            <View style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.stepNumberText, { color: '#4CAF50' }]}>1</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Link Your Card</Text>
                <Text style={styles.stepDescription}>Securely connect any debit or credit card</Text>
              </View>
            </View>
            <View style={styles.stepDivider} />
            <View style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[styles.stepNumberText, { color: '#FFA726' }]}>2</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Shop Normally</Text>
                <Text style={styles.stepDescription}>Every purchase rounds up to nearest ₹10</Text>
              </View>
            </View>
            <View style={styles.stepDivider} />
            <View style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: '#E3F2FD' }]}>
                <Text style={[styles.stepNumberText, { color: '#2196F3' }]}>3</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Auto-Invest</Text>
                <Text style={styles.stepDescription}>Spare change invested in your portfolio</Text>
              </View>
            </View>
            <View style={styles.stepDivider} />
            <View style={styles.stepCard}>
              <View style={[styles.stepNumber, { backgroundColor: '#F3E5F5' }]}>
                <Text style={[styles.stepNumberText, { color: '#9C27B0' }]}>4</Text>
              </View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>Track & Grow</Text>
                <Text style={styles.stepDescription}>AI manages and grows your investments</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.trustSection}>
          <Text style={styles.sectionTitle}>Trusted & Secure</Text>
          <View style={styles.trustGrid}>
            <View style={styles.trustCard}>
              <Ionicons name="shield-checkmark" size={28} color="#4CAF50" />
              <Text style={styles.trustCardTitle}>SEBI Registered</Text>
              <Text style={styles.trustCardText}>Fully compliant</Text>
            </View>
            <View style={styles.trustCard}>
              <Ionicons name="lock-closed" size={28} color="#2196F3" />
              <Text style={styles.trustCardTitle}>Encrypted</Text>
              <Text style={styles.trustCardText}>256-bit security</Text>
            </View>
            <View style={styles.trustCard}>
              <Ionicons name="finger-print" size={28} color="#9C27B0" />
              <Text style={styles.trustCardTitle}>Biometric</Text>
              <Text style={styles.trustCardText}>Secure login</Text>
            </View>
            <View style={styles.trustCard}>
              <Ionicons name="people" size={28} color="#FF6584" />
              <Text style={styles.trustCardTitle}>50K+ Users</Text>
              <Text style={styles.trustCardText}>Join us today</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.ctaFixed}>
        <TouchableOpacity 
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={() => router.push('/sign-up')}
        >
          <LinearGradient
            colors={['#6C63FF', '#8F88FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <View style={styles.ctaContent}>
              <View>
                <View style={styles.ctaAiBadge}>
                  <Ionicons name="flash" size={10} color="#FFD700" />
                  <Text style={styles.ctaAiText}>AI Ready</Text>
                </View>
                <Text style={styles.ctaText}>Start Your Gullak Journey</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  backButton: { padding: 4 },
  headerTitleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1A1A1A' },
  aiStatusDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#4CAF50', shadowColor: '#4CAF50', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 8 },
  headerSpacer: { width: 32 },
  scrollContainer: { flex: 1 },
  scrollContent: { paddingTop: 24 },
  heroSection: { alignItems: 'center', paddingHorizontal: 24, paddingBottom: 32 },
  agentIconContainer: { marginBottom: 24 },
  agentCircle: { width: 100, height: 100, borderRadius: 50, alignItems: 'center', justifyContent: 'center', shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 8, position: 'relative' },
  agentEmoji: { fontSize: 48 },
  activeIndicator: { position: 'absolute', bottom: 8, right: 8, width: 16, height: 16, borderRadius: 8, backgroundColor: '#4CAF50', borderWidth: 3, borderColor: '#FFFFFF' },
  heroTitle: { fontSize: 32, fontWeight: '900', color: '#1A1A1A', textAlign: 'center', marginBottom: 12, letterSpacing: -0.5 },
  heroSubtitle: { fontSize: 16, color: '#666', textAlign: 'center', lineHeight: 24, marginBottom: 24, paddingHorizontal: 16 },
  statsContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4, width: '100%' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#1A1A1A', marginTop: 8 },
  statLabel: { fontSize: 12, color: '#666', marginTop: 4, fontWeight: '600' },
  statDivider: { width: 1, height: 40, backgroundColor: '#E0E0E0' },
  featuresContainer: { paddingHorizontal: 20, marginBottom: 32 },
  sectionTitle: { fontSize: 24, fontWeight: '900', color: '#1A1A1A', marginBottom: 20 },
  featureCard: { backgroundColor: '#FFFFFF', borderRadius: 20, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  featureContent: { padding: 20 },
  featureHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  iconCircle: { width: 60, height: 60, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  aiPoweredBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 12, gap: 4 },
  aiPoweredText: { fontSize: 11, fontWeight: '800', color: '#FFD700', letterSpacing: 0.5 },
  featureTitle: { fontSize: 22, fontWeight: '900', color: '#1A1A1A', marginBottom: 10 },
  featureDescription: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 16 },
  benefitsContainer: { gap: 10 },
  benefitRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  benefitText: { fontSize: 14, color: '#333', fontWeight: '600' },
  howItWorksSection: { paddingHorizontal: 20, marginBottom: 32 },
  stepsContainer: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  stepCard: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  stepNumber: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  stepNumberText: { fontSize: 22, fontWeight: '900' },
  stepInfo: { flex: 1 },
  stepTitle: { fontSize: 17, fontWeight: '800', color: '#1A1A1A', marginBottom: 4 },
  stepDescription: { fontSize: 14, color: '#666', fontWeight: '500' },
  stepDivider: { height: 20, width: 2, backgroundColor: '#E0E0E0', marginLeft: 25, marginVertical: 12 },
  trustSection: { paddingHorizontal: 20 },
  trustGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'space-between' },
  trustCard: { width: (width - 52) / 2, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  trustCardTitle: { fontSize: 15, fontWeight: '800', color: '#1A1A1A', marginTop: 10, textAlign: 'center' },
  trustCardText: { fontSize: 13, color: '#666', textAlign: 'center', marginTop: 4, fontWeight: '500' },
  ctaFixed: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFFFFF', paddingHorizontal: 20, paddingTop: 16, paddingBottom: Platform.OS === 'ios' ? 24 : 20, borderTopWidth: 1, borderTopColor: '#F0F0F0', shadowColor: '#000', shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 12 },
  ctaButton: { borderRadius: 16, overflow: 'hidden', shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 12, elevation: 8 },
  ctaGradient: { paddingVertical: 16, paddingHorizontal: 20 },
  ctaContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  ctaAiBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.2)', paddingVertical: 3, paddingHorizontal: 8, borderRadius: 8, gap: 4, marginBottom: 6, alignSelf: 'flex-start' },
  ctaAiText: { fontSize: 10, fontWeight: '800', color: '#FFD700', textTransform: 'uppercase', letterSpacing: 0.5 },
  ctaText: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
});
