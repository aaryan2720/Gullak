import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useLayoutEffect } from 'react';
import {
    Dimensions,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0;

export default function FeaturesScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  // Hide the default header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const features = [
    {
      icon: 'wallet',
      color: '#4CAF50',
      gradient: ['#E8F5E9', '#F1F8F4'],
      title: 'Auto Round-up',
      description: 'Every purchase rounds up to nearest ₹10. Spare change automatically invested in diversified portfolios.',
      benefits: ['Set & forget', 'Save effortlessly', 'Grow passively'],
    },
    {
      icon: 'trophy',
      color: '#FFA726',
      gradient: ['#FFF3E0', '#FFF8F0'],
      title: 'Goal-Based Investing',
      description: 'Set financial goals and watch your progress. Whether it\'s a bike, vacation, or emergency fund - we\'ve got you covered.',
      benefits: ['Track progress', 'Milestone rewards', 'Achieve faster'],
    },
    {
      icon: 'school',
      color: '#2196F3',
      gradient: ['#E3F2FD', '#F0F7FD'],
      title: 'Learn & Earn',
      description: 'Gamified investing education like Duolingo! Complete lessons, take quizzes, earn XP, unlock badges, and get real rewards.',
      benefits: ['Interactive lessons', 'Earn rewards', 'Build confidence'],
    },
    {
      icon: 'sparkles',
      color: '#9C27B0',
      gradient: ['#F3E5F5', '#F8F0FA'],
      title: 'AI Investment Coach',
      description: '24/7 personal AI advisor powered by advanced algorithms. Get smart investment tips, budget guidance, and portfolio recommendations.',
      benefits: ['Expert advice', 'Personalized tips', 'Always available'],
    },
    {
      icon: 'pie-chart',
      color: '#FF6584',
      gradient: ['#FFE8EC', '#FFF0F3'],
      title: 'Diversified Portfolios',
      description: 'Professionally managed portfolios with automatic rebalancing. Invest in mutual funds, stocks, and bonds based on your risk profile.',
      benefits: ['Low risk', 'Auto-balanced', 'Professional'],
    },
    {
      icon: 'shield-checkmark',
      color: '#00BCD4',
      gradient: ['#E0F7FA', '#F0FBFC'],
      title: 'Bank-Grade Security',
      description: '256-bit encryption, SEBI compliant, and secure biometric authentication. Your money and data are completely safe.',
      benefits: ['Encrypted', 'SEBI approved', 'Biometric login'],
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <LinearGradient
        colors={['#5B54FF', '#7B75FF']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Features</Text>
        <View style={styles.headerSpacer} />
      </LinearGradient>

      <ScrollView 
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Features List */}
        <View style={styles.featuresContainer}>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureCard}>
              <LinearGradient
                colors={feature.gradient as [string, string]}
                style={styles.featureGradient}
              >
                {/* Icon Header */}
                <View style={styles.featureHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: feature.color + '30' }]}>
                    <Ionicons name={feature.icon as any} size={36} color={feature.color} />
                  </View>
                  <View style={styles.numberBadge}>
                    <Text style={styles.numberText}>{index + 1}</Text>
                  </View>
                </View>

                {/* Title */}
                <Text style={styles.featureTitle}>{feature.title}</Text>

                {/* Description */}
                <Text style={styles.featureDescription}>{feature.description}</Text>

                {/* Benefits */}
                <View style={styles.benefitsContainer}>
                  {feature.benefits.map((benefit, idx) => (
                    <View key={idx} style={styles.benefitRow}>
                      <Ionicons name="checkmark-circle" size={18} color={feature.color} />
                      <Text style={styles.benefitText}>{benefit}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>

        {/* How It Works Section */}
        <View style={styles.howItWorksSection}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <View style={styles.stepsContainer}>
            <View style={styles.stepItem}>
              <View style={[styles.stepBadge, { backgroundColor: '#E8F5E9' }]}>
                <Text style={[styles.stepNumber, { color: '#4CAF50' }]}>1</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Link Your Card</Text>
                <Text style={styles.stepDescription}>Securely connect any debit or credit card</Text>
              </View>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.stepItem}>
              <View style={[styles.stepBadge, { backgroundColor: '#FFF3E0' }]}>
                <Text style={[styles.stepNumber, { color: '#FFA726' }]}>2</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Shop Normally</Text>
                <Text style={styles.stepDescription}>Every purchase rounds up to nearest ₹10</Text>
              </View>
            </View>

            <View style={styles.stepDivider} />

            <View style={styles.stepItem}>
              <View style={[styles.stepBadge, { backgroundColor: '#E3F2FD' }]}>
                <Text style={[styles.stepNumber, { color: '#2196F3' }]}>3</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepTitle}>Auto-Invest</Text>
                <Text style={styles.stepDescription}>Spare change invested in your portfolio</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Trust Section */}
        <View style={styles.trustSection}>
          <Text style={styles.sectionTitle}>Trusted & Secure</Text>
          
          <View style={styles.trustGrid}>
            <View style={styles.trustCard}>
              <Ionicons name="shield-checkmark" size={32} color="#4CAF50" />
              <Text style={styles.trustCardTitle}>SEBI Registered</Text>
              <Text style={styles.trustCardText}>Fully compliant with regulations</Text>
            </View>

            <View style={styles.trustCard}>
              <Ionicons name="lock-closed" size={32} color="#2196F3" />
              <Text style={styles.trustCardTitle}>Encrypted</Text>
              <Text style={styles.trustCardText}>256-bit bank-grade security</Text>
            </View>

            <View style={styles.trustCard}>
              <Ionicons name="finger-print" size={32} color="#9C27B0" />
              <Text style={styles.trustCardTitle}>Biometric</Text>
              <Text style={styles.trustCardText}>Secure login with fingerprint</Text>
            </View>

            <View style={styles.trustCard}>
              <Ionicons name="people" size={32} color="#FF6584" />
              <Text style={styles.trustCardTitle}>50K+ Users</Text>
              <Text style={styles.trustCardText}>Join the growing community</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Fixed CTA */}
      <View style={styles.ctaFixed}>
        <TouchableOpacity 
          style={styles.ctaButton}
          activeOpacity={0.85}
          onPress={() => router.push('/sign-up')}
        >
          <LinearGradient
            colors={['#5B54FF', '#7B75FF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={styles.ctaText}>Get Started Now</Text>
            <Ionicons name="arrow-forward-sharp" size={22} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: STATUSBAR_HEIGHT + 16,
    paddingBottom: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  headerSpacer: {
    width: 34,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 0,
  },
  introSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  introTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 12,
    lineHeight: 36,
  },
  introSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
    fontWeight: '500',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    gap: 20,
  },
  featureCard: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  featureGradient: {
    padding: 24,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#333',
  },
  featureTitle: {
    fontSize: 24,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 12,
  },
  featureDescription: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    marginBottom: 16,
    fontWeight: '500',
  },
  benefitsContainer: {
    gap: 10,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  benefitText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },
  howItWorksSection: {
    marginTop: 32,
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1A1A1A',
    marginBottom: 24,
    textAlign: 'center',
  },
  stepsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  stepBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: {
    fontSize: 24,
    fontWeight: '900',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  stepDivider: {
    height: 24,
    width: 2,
    backgroundColor: '#E0E0E0',
    marginLeft: 27,
    marginVertical: 8,
  },
  trustSection: {
    paddingHorizontal: 24,
  },
  trustGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  trustCard: {
    width: (width - 64) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  trustCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1A1A1A',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  trustCardText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    fontWeight: '500',
  },
  ctaFixed: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 12,
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#5B54FF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 12,
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
