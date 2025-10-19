import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width, height } = Dimensions.get('window');

export default function LandingPage() {
  const router = useRouter();
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const learnMorePulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating animation for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -12,
          duration: 2500,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation for glow
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Fade in animation for content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      delay: 300,
      useNativeDriver: true,
    }).start();

    // Pulsing animation for Learn More button
    Animated.loop(
      Animated.sequence([
        Animated.timing(learnMorePulse, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(learnMorePulse, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Animated Features Badge - Top Left */}
      <Animated.View 
        style={[
          styles.featuresBadge,
          { transform: [{ scale: learnMorePulse }] }
        ]}
      >
        <TouchableOpacity 
          style={styles.featuresBadgeButton}
          onPress={() => router.push('/features' as any)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.featuresBadgeGradient}
          >
            <View style={styles.aiDot} />
            <Text style={styles.featuresBadgeText}>AI Features</Text>
            <Ionicons name="chevron-forward" size={16} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      
      {/* HERO SECTION - 80% of screen */}
      <LinearGradient
        colors={['#5B54FF', '#7B75FF', '#9D8FFF', '#FF6B9D']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.heroSection}
      >
        <View style={styles.heroContent}>
          {/* Animated Logo - Large & Centered */}
          <Animated.View 
            style={[
              styles.logoContainer,
              { 
                transform: [{ translateY: floatAnim }],
                opacity: fadeAnim,
              }
            ]}
          >
            {/* Outer Glow */}
            <Animated.View 
              style={[
                styles.logoGlow,
                { transform: [{ scale: pulseAnim }] }
              ]}
            >
              <LinearGradient
                colors={['rgba(255, 215, 0, 0.6)', 'rgba(255, 165, 0, 0.3)', 'transparent']}
                style={styles.glowGradient}
              />
            </Animated.View>

            {/* Main Logo - Gullak Pot */}
            <View style={styles.logoCircle}>
              <Text style={styles.gullakEmoji}>🪙</Text>
              <Text style={styles.potEmoji}>🏺</Text>
            </View>

            {/* Sparkles */}
            <View style={styles.sparkle1}>
              <Ionicons name="sparkles-sharp" size={20} color="#FFD700" />
            </View>
            <View style={styles.sparkle2}>
              <Ionicons name="sparkles" size={16} color="#FFA500" />
            </View>
            <View style={styles.sparkle3}>
              <Ionicons name="star" size={14} color="#FFD700" />
            </View>
          </Animated.View>

          {/* Brand Name - Gullak */}
          <Animated.View style={[styles.brandContainer, { opacity: fadeAnim }]}>
            <Text style={styles.brandName}>Gullak</Text>
            <Text style={styles.tagline}>AI-Powered Micro-Investing</Text>
            
            {/* AI Agent Badge */}
            <View style={styles.aiBadge}>
              <Ionicons name="sparkles" size={14} color="#FFD700" />
              <Text style={styles.aiBadgeText}>Powered by Agentic AI</Text>
              <Ionicons name="sparkles" size={14} color="#FFD700" />
            </View>
          </Animated.View>

          {/* Hero Message */}
          <Animated.View 
            style={[
              styles.heroMessageBox,
              { opacity: fadeAnim }
            ]}
          >
            <Text style={styles.heroTitle}>Start Investing With</Text>
            <View style={styles.amountRow}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.amountBadge}
              >
                <Text style={styles.amountText}>Just ₹10</Text>
              </LinearGradient>
              <Ionicons name="rocket-sharp" size={32} color="#FFD700" />
            </View>
            <Text style={styles.heroSubtitle}>Watch your spare change grow into wealth</Text>
          </Animated.View>

          {/* Trust Indicators with AI Highlight */}
          <Animated.View style={[styles.trustRow, { opacity: fadeAnim }]}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark" size={18} color="#FFD700" />
              <Text style={styles.trustText}>SEBI Registered</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Ionicons name="sparkles-outline" size={18} color="#FFD700" />
              <Text style={styles.trustText}>AI Agent Active</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Ionicons name="people" size={18} color="#FFD700" />
              <Text style={styles.trustText}>50K+ Users</Text>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>

      {/* FIXED CTA BUTTONS - 20% */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => router.push('/sign-up')}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryGradient}
          >
            <View style={styles.aiAssistChip}>
              <Ionicons name="chatbubble-ellipses" size={12} color="#FFD700" />
              <Text style={styles.aiChipText}>AI Assists You</Text>
            </View>
            <Text style={styles.primaryButtonText}>Start with ₹300 Free 🪙</Text>
            <Ionicons name="arrow-forward-sharp" size={22} color="#1A1A1A" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/sign-in')}
        >
          <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // ANIMATED FEATURES BADGE (Top-Left)
  featuresBadge: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 100,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  featuresBadgeButton: {
    borderRadius: 30,
    overflow: 'hidden',
  },
  featuresBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    gap: 8,
    borderRadius: 30,
  },
  aiDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF00',
    shadowColor: '#00FF00',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 6,
  },
  featuresBadgeText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // HERO SECTION (80%)
  heroSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  heroContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  
  // ANIMATED LOGO
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 90,
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
    position: 'relative',
  },
  gullakEmoji: {
    fontSize: 45,
    position: 'absolute',
    top: 20,
    right: 35,
  },
  potEmoji: {
    fontSize: 70,
    marginTop: 10,
  },
  sparkle1: {
    position: 'absolute',
    top: -10,
    right: 5,
  },
  sparkle2: {
    position: 'absolute',
    bottom: -5,
    right: -10,
  },
  sparkle3: {
    position: 'absolute',
    top: 10,
    left: -5,
  },
  
  // BRAND NAME & AI BADGE
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandName: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    marginBottom: 8,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.4)',
  },
  aiBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFD700',
    letterSpacing: 0.5,
  },
  
  // HERO MESSAGE
  heroMessageBox: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  amountBadge: {
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 20,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 15,
  },
  amountText: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  
  // TRUST ROW
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  trustDivider: {
    width: 1,
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  
  // FIXED CTA (20%)
  ctaContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 15,
  },
  primaryButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#5B54FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  primaryGradient: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    gap: 8,
  },
  aiAssistChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 4,
  },
  aiChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FFD700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#5B54FF',
    fontWeight: '700',
  },
});
