import { Colors, Spacing } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" />
      
      {/* Hero Section with Gradient */}
      <LinearGradient
        colors={['#6C63FF', '#8F88FF', '#FF6584']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          {/* Enhanced Logo/Brand */}
          <View style={styles.brandContainer}>
            <View style={styles.logoContainer}>
              {/* Outer glow circle */}
              <View style={styles.logoGlow}>
                {/* Main logo circle */}
                <View style={styles.logoCircle}>
                  <LinearGradient
                    colors={['#FFFFFF', '#E8E8FF']}
                    style={styles.logoGradient}
                  >
                    <Text style={styles.logoText}>G</Text>
                    <View style={styles.logoArrow}>
                      <Ionicons name="trending-up" size={24} color="#6C63FF" />
                    </View>
                  </LinearGradient>
                </View>
              </View>
            </View>
            
            {/* Brand Name with Highlight */}
            <View style={styles.brandNameContainer}>
              <Text style={styles.brandNameGrow}>Grow</Text>
              <View style={styles.zContainer}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.zHighlight}
                >
                  <Text style={styles.brandNameZ}>-Z</Text>
                </LinearGradient>
                <View style={styles.zSparkle}>
                  <Ionicons name="sparkles" size={16} color="#FFD700" />
                </View>
              </View>
            </View>
            
            <View style={styles.taglineContainer}>
              <Ionicons name="flash" size={12} color="#FFD700" />
              <Text style={styles.tagline}>Pocket-sized Investing for Gen Z</Text>
              <Ionicons name="flash" size={12} color="#FFD700" />
            </View>
          </View>

          {/* Hero Text with Animation */}
          <View style={styles.heroTextContainer}>
            <Text style={styles.heroTitle}>
              Start Investing{'\n'}
              <Text style={styles.heroTitleHighlight}>With Just ₹10</Text>
            </Text>
            <View style={styles.subtitleContainer}>
              <View style={styles.subtitleBadge}>
                <Text style={styles.heroSubtitle}>
                  Turn spare change into real wealth 💰
                </Text>
              </View>
            </View>
          </View>

          {/* Enhanced Floating Stats Cards */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.statCardGradient}
              >
                <Ionicons name="people" size={20} color="#FFD700" />
                <Text style={styles.statNumber}>50K+</Text>
                <Text style={styles.statLabel}>Investors</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.statCardGradient}
              >
                <Ionicons name="cash" size={20} color="#FFD700" />
                <Text style={styles.statNumber}>₹10Cr+</Text>
                <Text style={styles.statLabel}>Invested</Text>
              </LinearGradient>
            </View>
            <View style={styles.statCard}>
              <LinearGradient
                colors={['rgba(255, 255, 255, 0.25)', 'rgba(255, 255, 255, 0.1)']}
                style={styles.statCardGradient}
              >
                <Ionicons name="star" size={20} color="#FFD700" />
                <Text style={styles.statNumber}>4.8★</Text>
                <Text style={styles.statLabel}>Rating</Text>
              </LinearGradient>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Features Section */}
      <ScrollView style={styles.featuresSection} showsVerticalScrollIndicator={false}>
        {/* Section Header with Badge */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionBadge}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.sectionBadgeText}>FEATURES</Text>
          </View>
          <Text style={styles.sectionTitle}>Why Choose Grow-Z?</Text>
          <Text style={styles.sectionSubtitle}>
            Everything you need to start your investment journey
          </Text>
        </View>
        
        <View style={styles.featuresList}>
          {/* Feature 1 */}
          <View style={styles.featureCard}>
            <LinearGradient
              colors={['#E8F5E9', '#F1F8F4']}
              style={styles.featureIconGradient}
            >
              <Ionicons name="wallet-outline" size={28} color="#4CAF50" />
            </LinearGradient>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Auto Round-up</Text>
              <Text style={styles.featureDescription}>
                Every purchase rounds up to ₹10, automatically invested
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textTertiary} />
          </View>

          {/* Feature 2 */}
          <View style={styles.featureCard}>
            <LinearGradient
              colors={['#FFF3E0', '#FFF8F0']}
              style={styles.featureIconGradient}
            >
              <Ionicons name="trophy-outline" size={28} color="#FFA726" />
            </LinearGradient>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Goal-Based Saving</Text>
              <Text style={styles.featureDescription}>
                Set goals, track progress, achieve milestones with ease
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textTertiary} />
          </View>

          {/* Feature 3 */}
          <View style={styles.featureCard}>
            <LinearGradient
              colors={['#E3F2FD', '#F0F7FD']}
              style={styles.featureIconGradient}
            >
              <Ionicons name="school-outline" size={28} color="#2196F3" />
            </LinearGradient>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Learn & Earn</Text>
              <Text style={styles.featureDescription}>
                Gamified lessons, quizzes & badges - like Duolingo for investing!
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textTertiary} />
          </View>

          {/* Feature 4 */}
          <View style={styles.featureCard}>
            <LinearGradient
              colors={['#F3E5F5', '#F8F0FA']}
              style={styles.featureIconGradient}
            >
              <Ionicons name="sparkles-outline" size={28} color="#9C27B0" />
            </LinearGradient>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>AI Coach</Text>
              <Text style={styles.featureDescription}>
                Personal AI advisor for smart investment tips & budget guidance
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={Colors.light.textTertiary} />
          </View>
        </View>

        {/* Trust Indicators */}
        <View style={styles.trustSection}>
          <View style={styles.trustHeader}>
            <Ionicons name="shield-checkmark" size={24} color="#4CAF50" />
            <Text style={styles.trustTitle}>Trusted & Secure</Text>
          </View>
          <View style={styles.trustGrid}>
            <View style={styles.trustCard}>
              <Ionicons name="shield-checkmark" size={28} color="#4CAF50" />
              <Text style={styles.trustCardTitle}>Bank-grade</Text>
              <Text style={styles.trustCardText}>Security</Text>
            </View>
            <View style={styles.trustCard}>
              <Ionicons name="lock-closed" size={28} color="#2196F3" />
              <Text style={styles.trustCardTitle}>SEBI</Text>
              <Text style={styles.trustCardText}>Compliant</Text>
            </View>
            <View style={styles.trustCard}>
              <Ionicons name="finger-print" size={28} color="#9C27B0" />
              <Text style={styles.trustCardTitle}>Biometric</Text>
              <Text style={styles.trustCardText}>Login</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 140 }} />
      </ScrollView>

      {/* Fixed Bottom CTA Buttons */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('sign-up' as any)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#6C63FF', '#8F88FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton}
          >
            <Text style={styles.primaryButtonText}>Get Started Free</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.push('sign-in' as any)}
          activeOpacity={0.8}
        >
          <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    height: '50%',
    paddingHorizontal: Spacing.lg,
    paddingTop: 20,
  },
  heroContent: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  brandContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGlow: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '900',
    color: '#6C63FF',
    marginBottom: -8,
  },
  logoArrow: {
    marginTop: -4,
  },
  brandNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandNameGrow: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  zContainer: {
    position: 'relative',
  },
  zHighlight: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 8,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 12,
    elevation: 8,
  },
  brandNameZ: {
    fontSize: 40,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  zSparkle: {
    position: 'absolute',
    top: -8,
    right: -8,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagline: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  heroTextContainer: {
    alignItems: 'center',
    marginVertical: 16,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 40,
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroTitleHighlight: {
    color: '#FFD700',
    fontSize: 36,
  },
  subtitleContainer: {
    alignItems: 'center',
  },
  subtitleBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  heroSubtitle: {
    fontSize: 15,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  statCardGradient: {
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  featuresSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingTop: 32,
    paddingHorizontal: Spacing.lg,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9E6',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 1,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: Colors.light.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  featuresList: {
    marginTop: 8,
  },
  featureCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.surface,
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.04)',
  },
  featureIconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
    justifyContent: 'center',
  },
  featureTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.light.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: Colors.light.textSecondary,
    lineHeight: 19,
    fontWeight: '500',
  },
  trustSection: {
    marginTop: 32,
    paddingVertical: 28,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.06)',
    alignItems: 'center',
  },
  trustHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  trustTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.light.text,
  },
  trustGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    gap: 12,
  },
  trustCard: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.06)',
  },
  trustCardTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.light.text,
    marginTop: 8,
    textAlign: 'center',
  },
  trustCardText: {
    fontSize: 11,
    color: Colors.light.textSecondary,
    marginTop: 2,
    textAlign: 'center',
    fontWeight: '600',
  },
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.lg,
    paddingTop: 16,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginRight: 8,
  },
  secondaryButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: Colors.light.primary,
    fontWeight: '600',
  },
});
