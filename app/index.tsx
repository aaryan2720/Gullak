import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
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

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  
  // Smooth, subtle animations
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    // Subtle floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Smooth fade in on load
    Animated.parallel([
      Animated.timing(fadeInAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAFAFA" />
      
      {/* Modern Gradient Background - Subtle */}
      <LinearGradient
        colors={['#FAFAFA', '#F5F5FF', '#FFF5FA']}
        style={styles.backgroundGradient}
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* AI Agent Badge - Top Right (Clean Position) */}
          <Animated.View
            style={[
              styles.agentBadge,
              {
                opacity: fadeInAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.agentButton}
              activeOpacity={0.7}
              onPress={() => router.push('/features' as any)}
            >
              <View style={styles.agentDot} />
              <Text style={styles.agentText}>AI Agent</Text>
              <Ionicons name="sparkles" size={14} color="#6C63FF" />
            </TouchableOpacity>
          </Animated.View>

          {/* Hero Section - Safe Area Aware */}
          <Animated.View
            style={[
              styles.heroSection,
              {
                opacity: fadeInAnim,
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            {/* Brand Logo - Centered, Clean */}
            <Animated.View
              style={[
                styles.logoContainer,
                { transform: [{ translateY: floatAnim }] },
              ]}
            >
              <View style={styles.logoWrapper}>
                <View style={styles.coinContainer}>
                  <Text style={styles.coinEmoji}>🪙</Text>
                </View>
              </View>
            </Animated.View>

            {/* Brand Name */}
            <View style={styles.brandSection}>
              <Text style={styles.brandName}>Gullak</Text>
              <Text style={styles.tagline}>Smart Micro-Investing</Text>
            </View>

            {/* Hero Headline */}
            <View style={styles.headlineSection}>
              <Text style={styles.headline}>Grow Your Wealth</Text>
              <Text style={styles.subheadline}>Starting with just</Text>
              
              <View style={styles.amountContainer}>
                <LinearGradient
                  colors={['#6C63FF', '#8F88FF']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.amountBadge}
                >
                  <Text style={styles.amountSymbol}>₹</Text>
                  <Text style={styles.amountValue}>10</Text>
                </LinearGradient>
              </View>

              <Text style={styles.description}>
                Your AI-powered investment companion that turns spare change into wealth
              </Text>
            </View>

            {/* Features Grid */}
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#E8F5E9' }]}>
                  <Ionicons name="trending-up" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.featureText}>Auto-Invest</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#E3F2FD' }]}>
                  <Ionicons name="shield-checkmark" size={20} color="#2196F3" />
                </View>
                <Text style={styles.featureText}>SEBI Safe</Text>
              </View>
              
              <View style={styles.featureItem}>
                <View style={[styles.featureIcon, { backgroundColor: '#F3E5F5' }]}>
                  <Ionicons name="sparkles" size={20} color="#9C27B0" />
                </View>
                <Text style={styles.featureText}>AI Guided</Text>
              </View>
            </View>
          </Animated.View>

          {/* Trust Bar - Fixed to Bottom of Content */}
          <View style={styles.trustBar}>
            <View style={styles.trustItemContainer}>
              <Ionicons name="shield-checkmark-outline" size={16} color="#6C63FF" />
              <Text style={styles.trustLabel}>SEBI Registered</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItemContainer}>
              <Ionicons name="people-outline" size={16} color="#6C63FF" />
              <Text style={styles.trustLabel}>50K+ Users</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItemContainer}>
              <Ionicons name="lock-closed-outline" size={16} color="#6C63FF" />
              <Text style={styles.trustLabel}>Bank-Grade Security</Text>
            </View>
          </View>

          {/* CTA Buttons */}
          <Animated.View
            style={[
              styles.ctaSection,
              {
                opacity: fadeInAnim,
                transform: [{ translateY: slideUpAnim }],
              },
            ]}
          >
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => router.push('/sign-up')}
            >
              <LinearGradient
                colors={['#6C63FF', '#8F88FF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.primaryButtonGradient}
              >
                <View style={styles.buttonContent}>
                  <Text style={styles.primaryButtonText}>Get Started Free</Text>
                  <View style={styles.bonusBadge}>
                    <Text style={styles.bonusText}>₹300 Bonus 🎉</Text>
                  </View>
                </View>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.7}
              onPress={() => router.push('/sign-in')}
            >
              <Text style={styles.secondaryButtonText}>Already have an account?</Text>
              <Text style={styles.signInLink}>Sign In →</Text>
            </TouchableOpacity>
          </Animated.View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  backgroundGradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  
  // AI Agent Badge - Top Right (Clean, Modern)
  agentBadge: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 50,
    right: 20,
    zIndex: 100,
  },
  agentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  agentDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
  },
  agentText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  
  // Hero Section - Clean, Modern Layout
  heroSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  
  // Logo - Clean and Minimal
  logoContainer: {
    marginBottom: 24,
  },
  logoWrapper: {
    alignItems: 'center',
  },
  coinContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
  },
  coinEmoji: {
    fontSize: 64,
  },
  
  // Brand Section
  brandSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  brandName: {
    fontSize: 48,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 8,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },

  // Headline Section
  headlineSection: {
    alignItems: 'center',
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  headline: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  subheadline: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
    marginBottom: 16,
  },
  amountContainer: {
    marginBottom: 20,
  },
  amountBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  amountSymbol: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 4,
  },
  amountValue: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
  },

  // Features Grid
  featuresGrid: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 32,
    paddingHorizontal: 20,
  },
  featureItem: {
    alignItems: 'center',
    flex: 1,
    maxWidth: 100,
  },
  featureIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
  },

  // Trust Bar
  trustBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 40,
    marginBottom: 32,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  trustItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
    justifyContent: 'center',
  },
  trustLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  trustDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
  },

  // CTA Section
  ctaSection: {
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 24,
  },
  buttonContent: {
    flex: 1,
  },
  primaryButtonText: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bonusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  bonusText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    marginBottom: 4,
  },
  signInLink: {
    fontSize: 16,
    color: '#6C63FF',
    fontWeight: '700',
  },
});
