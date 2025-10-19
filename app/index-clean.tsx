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
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HERO SECTION - 70% of screen */}
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

            {/* Main Logo */}
            <View style={styles.logoCircle}>
              <LinearGradient
                colors={['#FFFFFF', '#F8F6FF']}
                style={styles.logoInner}
              >
                <Text style={styles.logoLetter}>G</Text>
                <Ionicons name="trending-up-sharp" size={42} color="#5B54FF" style={styles.trendIcon} />
              </LinearGradient>
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

          {/* Brand Name */}
          <Animated.View style={[styles.brandContainer, { opacity: fadeAnim }]}>
            <View style={styles.brandNameRow}>
              <Text style={styles.brandGrow}>Grow</Text>
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF8C00']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.zBox}
              >
                <Text style={styles.brandZ}>-Z</Text>
              </LinearGradient>
            </View>
            
            {/* Tagline */}
            <View style={styles.taglineBadge}>
              <Ionicons name="flash-sharp" size={14} color="#FFD700" />
              <Text style={styles.tagline}>Micro-Investing for Gen-Z</Text>
              <Ionicons name="flash-sharp" size={14} color="#FFD700" />
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

          {/* Trust Indicators - Minimal */}
          <Animated.View style={[styles.trustRow, { opacity: fadeAnim }]}>
            <View style={styles.trustItem}>
              <Ionicons name="people-sharp" size={18} color="rgba(255, 255, 255, 0.9)" />
              <Text style={styles.trustText}>50K+ Users</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Ionicons name="star-sharp" size={18} color="#FFD700" />
              <Text style={styles.trustText}>4.9 Rating</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark-sharp" size={18} color="#4CAF50" />
              <Text style={styles.trustText}>100% Safe</Text>
            </View>
          </Animated.View>
        </View>
      </LinearGradient>

      {/* BOTTOM SECTION - 30% Clean & Simple */}
      <View style={styles.bottomSection}>
        <View style={styles.bottomContent}>
          {/* Value Prop - Clean */}
          <View style={styles.valueSection}>
            <View style={styles.valueItem}>
              <View style={styles.valueIcon}>
                <Ionicons name="wallet" size={24} color="#5B54FF" />
              </View>
              <Text style={styles.valueText}>Round-up spare change automatically</Text>
            </View>
            
            <View style={styles.valueItem}>
              <View style={styles.valueIcon}>
                <Ionicons name="trophy" size={24} color="#FFA500" />
              </View>
              <Text style={styles.valueText}>Achieve goals with smart tracking</Text>
            </View>
            
            <View style={styles.valueItem}>
              <View style={styles.valueIcon}>
                <Ionicons name="sparkles" size={24} color="#9C27B0" />
              </View>
              <Text style={styles.valueText}>Learn investing with AI coach</Text>
            </View>
          </View>
        </View>
      </View>

      {/* FIXED CTA BUTTONS - Always Visible */}
      <View style={styles.ctaContainer}>
        <TouchableOpacity 
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={() => router.push('/sign-up')}
        >
          <LinearGradient
            colors={['#5B54FF', '#7B75FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.primaryButtonText}>Get Started - Free ₹100</Text>
            <Ionicons name="arrow-forward-sharp" size={22} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => router.push('/sign-in')}
        >
          <Text style={styles.secondaryButtonText}>Already have an account? Sign In</Text>
        </TouchableOpacity>

        {/* Learn More Link */}
        <TouchableOpacity 
          style={styles.learnMoreButton}
          onPress={() => router.push('/features' as any)}
        >
          <Text style={styles.learnMoreText}>Learn more about Grow-Z</Text>
          <Ionicons name="chevron-forward" size={16} color="#5B54FF" />
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
  
  // HERO SECTION (70%)
  heroSection: {
    height: height * 0.70,
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
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 15,
  },
  logoInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoLetter: {
    fontSize: 52,
    fontWeight: '900',
    color: '#5B54FF',
    marginTop: -12,
  },
  trendIcon: {
    marginTop: -8,
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
  
  // BRAND NAME
  brandContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  brandNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  brandGrow: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  zBox: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 14,
    marginLeft: 6,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 12,
  },
  brandZ: {
    fontSize: 56,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 6,
  },
  taglineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 30,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  tagline: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '700',
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
  
  // BOTTOM SECTION (30%)
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: 32,
  },
  bottomContent: {
    paddingHorizontal: 32,
  },
  valueSection: {
    gap: 20,
  },
  valueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  valueIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    fontWeight: '600',
    lineHeight: 22,
  },
  
  // FIXED CTA
  ctaContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
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
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 32,
    gap: 12,
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  secondaryButtonText: {
    fontSize: 14,
    color: '#5B54FF',
    fontWeight: '700',
  },
  learnMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  learnMoreText: {
    fontSize: 13,
    color: '#5B54FF',
    fontWeight: '600',
  },
});
