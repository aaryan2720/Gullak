import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
    Animated,
    Dimensions,
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
  const floatAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Floating animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
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
      
      {/* TOP SECTION - 40% with Gradient */}
      <LinearGradient
        colors={['#5B54FF', '#7B75FF', '#FF5E7E']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 1.2 }}
        style={styles.topSection}
      >
        {/* Floating Animated Logo */}
        <Animated.View style={[styles.logoSection, { transform: [{ translateY: floatAnim }] }]}>
          <Animated.View style={[styles.logoGlowOuter, { transform: [{ scale: pulseAnim }] }]}>
            <LinearGradient
              colors={['rgba(255, 215, 0, 0.5)', 'rgba(255, 165, 0, 0.2)', 'transparent']}
              style={styles.glowGradient}
            />
          </Animated.View>
          
          <View style={styles.logoMain}>
            <LinearGradient
              colors={['#FFFFFF', '#F5F3FF']}
              style={styles.logoInner}
            >
              <Text style={styles.logoG}>G</Text>
              <Ionicons name="trending-up-sharp" size={36} color="#5B54FF" style={styles.arrowIcon} />
            </LinearGradient>
          </View>
          
          <View style={styles.sparkleTop}>
            <Ionicons name="sparkles-sharp" size={18} color="#FFD700" />
          </View>
          <View style={styles.sparkleRight}>
            <Ionicons name="sparkles" size={14} color="#FFA500" />
          </View>
        </Animated.View>

        {/* Brand Name - Distinctive Styling */}
        <View style={styles.brandSection}>
          <View style={styles.brandRow}>
            <Text style={styles.brandGrow}>Grow</Text>
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FF8C00']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.zBox}
            >
              <Text style={styles.brandZ}>-Z</Text>
            </LinearGradient>
            <View style={styles.sparkleZ}>
              <Ionicons name="star" size={16} color="#FFD700" />
            </View>
          </View>
          
          <View style={styles.badgeRow}>
            <Ionicons name="flash-sharp" size={14} color="#FFD700" />
            <Text style={styles.badge}>Invest spare change • Grow wealth daily</Text>
            <Ionicons name="flash-sharp" size={14} color="#FFD700" />
          </View>
        </View>

        {/* Hero Message */}
        <View style={styles.heroBox}>
          <Text style={styles.heroLine1}>Start With Just</Text>
          <View style={styles.heroAmountRow}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.amountBox}
            >
              <Text style={styles.heroAmount}>₹10</Text>
            </LinearGradient>
            <Ionicons name="rocket-sharp" size={28} color="#FFD700" />
          </View>
          <Text style={styles.heroLine2}>& Watch Your Money Grow!</Text>
        </View>

        {/* Mini Stats */}
        <View style={styles.miniStats}>
          <View style={styles.miniStatItem}>
            <Ionicons name="people-sharp" size={16} color="#FFFFFF" />
            <Text style={styles.miniStatText}>50K+ Users</Text>
          </View>
          <View style={styles.miniStatDot} />
          <View style={styles.miniStatItem}>
            <Ionicons name="shield-checkmark" size={16} color="#4CAF50" />
            <Text style={styles.miniStatText}>100% Safe</Text>
          </View>
          <View style={styles.miniStatDot} />
          <View style={styles.miniStatItem}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.miniStatText}>4.9 Rating</Text>
          </View>
        </View>
      </LinearGradient>

      {/* BOTTOM SECTION - 60% White with Content */}
      <View style={styles.bottomSection}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollArea}
        >
          {/* How It Works */}
          <View style={styles.howSection}>
            <View style={styles.howHeader}>
              <Ionicons name="rocket" size={22} color="#5B54FF" />
              <Text style={styles.howTitle}>How It Works</Text>
              <Ionicons name="chevron-down" size={18} color="#5B54FF" />
            </View>
            
            <View style={styles.stepsContainer}>
              <View style={styles.stepBox}>
                <View style={[styles.stepNum, { backgroundColor: '#E8F5E9' }]}>
                  <Text style={[styles.stepNumText, { color: '#4CAF50' }]}>1</Text>
                </View>
                <Ionicons name="card-outline" size={40} color="#4CAF50" />
                <Text style={styles.stepTitle}>Link Card</Text>
                <Text style={styles.stepDesc}>Connect any card securely</Text>
              </View>

              <Ionicons name="arrow-forward" size={24} color="#999" style={styles.arrowBetween} />

              <View style={styles.stepBox}>
                <View style={[styles.stepNum, { backgroundColor: '#FFF3E0' }]}>
                  <Text style={[styles.stepNumText, { color: '#FFA726' }]}>2</Text>
                </View>
                <Ionicons name="cart-outline" size={40} color="#FFA726" />
                <Text style={styles.stepTitle}>Shop</Text>
                <Text style={styles.stepDesc}>Rounds to nearest ₹10</Text>
              </View>

              <Ionicons name="arrow-forward" size={24} color="#999" style={styles.arrowBetween} />

              <View style={styles.stepBox}>
                <View style={[styles.stepNum, { backgroundColor: '#E3F2FD' }]}>
                  <Text style={[styles.stepNumText, { color: '#2196F3' }]}>3</Text>
                </View>
                <Ionicons name="trending-up" size={40} color="#2196F3" />
                <Text style={styles.stepTitle}>Grow</Text>
                <Text style={styles.stepDesc}>Auto-invested for you</Text>
              </View>
            </View>
          </View>

          {/* Features Grid */}
          <View style={styles.featuresSection}>
            <View style={styles.featuresHeader}>
              <Ionicons name="star-sharp" size={22} color="#FFD700" />
              <Text style={styles.featuresTitle}>Why Gen-Z Loves Us</Text>
            </View>
            
            <View style={styles.gridContainer}>
              <TouchableOpacity style={styles.gridBox} activeOpacity={0.7}>
                <LinearGradient colors={['#E8F5E9', '#F5FBF5']} style={styles.gridInner}>
                  <Ionicons name="wallet-sharp" size={42} color="#4CAF50" />
                  <Text style={styles.gridTitle}>Auto Round-up</Text>
                  <Text style={styles.gridSub}>Save effortlessly</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridBox} activeOpacity={0.7}>
                <LinearGradient colors={['#FFF3E0', '#FFF9F0']} style={styles.gridInner}>
                  <Ionicons name="trophy-sharp" size={42} color="#FFA726" />
                  <Text style={styles.gridTitle}>Goals Tracker</Text>
                  <Text style={styles.gridSub}>Achieve dreams</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridBox} activeOpacity={0.7}>
                <LinearGradient colors={['#E3F2FD', '#F0F7FD']} style={styles.gridInner}>
                  <Ionicons name="school-sharp" size={42} color="#2196F3" />
                  <Text style={styles.gridTitle}>Learn & Earn</Text>
                  <Text style={styles.gridSub}>Get rewarded</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridBox} activeOpacity={0.7}>
                <LinearGradient colors={['#F3E5F5', '#F9F0FA']} style={styles.gridInner}>
                  <Ionicons name="sparkles-sharp" size={42} color="#9C27B0" />
                  <Text style={styles.gridTitle}>AI Coach</Text>
                  <Text style={styles.gridSub}>Smart advice</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Trust Row */}
          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark-sharp" size={24} color="#4CAF50" />
              <Text style={styles.trustText}>Bank-grade</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Ionicons name="lock-closed-sharp" size={24} color="#2196F3" />
              <Text style={styles.trustText}>SEBI</Text>
            </View>
            <View style={styles.trustDivider} />
            <View style={styles.trustItem}>
              <Ionicons name="finger-print-sharp" size={24} color="#9C27B0" />
              <Text style={styles.trustText}>Biometric</Text>
            </View>
          </View>

          <View style={{ height: 140 }} />
        </ScrollView>
      </View>

      {/* FIXED CTA BUTTONS */}
      <View style={styles.ctaFixed}>
        <TouchableOpacity 
          style={styles.btnPrimary}
          activeOpacity={0.85}
          onPress={() => router.push('/sign-up')}
        >
          <LinearGradient
            colors={['#5B54FF', '#7B75FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btnGradient}
          >
            <Text style={styles.btnPrimaryText}>Get Free ₹100 Bonus</Text>
            <Ionicons name="arrow-forward-sharp" size={22} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.btnSecondary}
          onPress={() => router.push('/sign-in')}
        >
          <Text style={styles.btnSecondaryText}>Already investing? Sign In →</Text>
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
  topSection: {
    height: height * 0.42,
    paddingHorizontal: 24,
    paddingTop: 50,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoGlowOuter: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    overflow: 'hidden',
  },
  glowGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 70,
  },
  logoMain: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 12,
  },
  logoInner: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoG: {
    fontSize: 42,
    fontWeight: '900',
    color: '#5B54FF',
    marginTop: -8,
  },
  arrowIcon: {
    marginTop: -6,
  },
  sparkleTop: {
    position: 'absolute',
    top: -6,
    right: 10,
  },
  sparkleRight: {
    position: 'absolute',
    bottom: -4,
    right: -8,
  },
  brandSection: {
    alignItems: 'center',
    marginTop: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  brandGrow: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  zBox: {
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 10,
  },
  brandZ: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sparkleZ: {
    position: 'absolute',
    top: -10,
    right: -10,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 25,
    gap: 8,
  },
  badge: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  heroBox: {
    alignItems: 'center',
    marginTop: 8,
  },
  heroLine1: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  heroAmountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    gap: 12,
  },
  amountBox: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 20,
    elevation: 12,
  },
  heroAmount: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroLine2: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  miniStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
    gap: 12,
  },
  miniStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  miniStatText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  miniStatDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  bottomSection: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollArea: {
    paddingTop: 28,
    paddingHorizontal: 20,
  },
  howSection: {
    marginBottom: 32,
  },
  howHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  howTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepBox: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  stepNumText: {
    fontSize: 14,
    fontWeight: '900',
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 8,
  },
  stepDesc: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '600',
  },
  arrowBetween: {
    marginHorizontal: 6,
  },
  featuresSection: {
    marginBottom: 28,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1A1A1A',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 14,
  },
  gridBox: {
    width: (width - 54) / 2,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  gridInner: {
    padding: 20,
    alignItems: 'center',
    minHeight: 140,
    justifyContent: 'center',
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 12,
    textAlign: 'center',
  },
  gridSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '600',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FAFAFA',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: '#F0F0F0',
  },
  trustItem: {
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#1A1A1A',
  },
  trustDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#E0E0E0',
  },
  ctaFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  btnPrimary: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#5B54FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  btnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 28,
    gap: 10,
  },
  btnPrimaryText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  btnSecondary: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnSecondaryText: {
    fontSize: 14,
    color: '#5B54FF',
    fontWeight: '700',
  },
});
