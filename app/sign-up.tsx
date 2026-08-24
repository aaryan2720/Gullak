import React, { useState, useEffect } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/context/auth-context';
import { FontFamily } from '@/constants/fonts';

export default function SignUpPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const { register, isAuthenticated } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleSignUp = async () => {
    if (!name || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }
    setLoading(true);
    const res = await register(name, email, phone, password);
    setLoading(false);
    if (res.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Registration Failed', res.error || 'Failed to create account.');
    }
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: '#0A0E27' }]} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <StatusBar barStyle="light-content" />
        
        {/* Header with Gradient */}
        <LinearGradient
          colors={['#0D1128', '#1A1040', '#0D1128']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerContent}>
            <View style={[styles.logoCircle, { backgroundColor: colors.secondary + '25', borderColor: colors.secondary + '60', borderWidth: 1.5 }]}>
              <Text style={{ fontSize: 32 }}>🚀</Text>
            </View>
            <Text style={styles.headerTitle}>Join Gullak</Text>
            <Text style={styles.headerSubtitle}>Start your investing journey today!</Text>
          </View>
        </LinearGradient>

        {/* Form Section */}
        <ScrollView
          style={[styles.formSection, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Create Account</Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
              Fill in your details to get started
            </Text>

            {/* Benefits Cards */}
            <View style={styles.benefitsContainer}>
              <View style={[styles.benefitCard, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name="gift-outline" size={18} color={colors.primary} />
                <Text style={[styles.benefitText, { color: colors.text }]}>₹100 Bonus</Text>
              </View>
              <View style={[styles.benefitCard, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name="shield-checkmark-outline" size={18} color={colors.success} />
                <Text style={[styles.benefitText, { color: colors.text }]}>100% Safe</Text>
              </View>
              <View style={[styles.benefitCard, { backgroundColor: colors.surfaceVariant }]}>
                <Ionicons name="flash-outline" size={18} color={colors.warning} />
                <Text style={[styles.benefitText, { color: colors.text }]}>2 Min Setup</Text>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Input
                label="Full Name"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
                leftIcon="person-outline"
              />

              <Input
                label="Email"
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                leftIcon="mail-outline"
                keyboardType="email-address"
              />

              <Input
                label="Phone Number"
                placeholder="+91 98765 43210"
                value={phone}
                onChangeText={setPhone}
                leftIcon="call-outline"
                keyboardType="phone-pad"
              />

              <Input
                label="Password"
                placeholder="Create a strong password"
                value={password}
                onChangeText={setPassword}
                leftIcon="lock-closed-outline"
                secureTextEntry
              />

              <Input
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                leftIcon="lock-closed-outline"
                secureTextEntry
              />
            </View>

            <Button
              variant="primary"
              size="lg"
              onPress={handleSignUp}
              style={styles.signUpButton}
              title={loading ? 'Registering...' : 'Create Account'}
              disabled={loading}
            />

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Signup Buttons */}
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => {}}>
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>Sign up with Google</Text>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text style={[styles.signInText, { color: colors.textSecondary }]}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push('sign-in' as any)}>
                <Text style={[styles.signInLink, { color: colors.primary }]}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 16,
    paddingBottom: 36,
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerContent: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 26,
    color: '#FFFFFF',
    fontFamily: FontFamily.heading,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: FontFamily.body,
  },
  formSection: {
    flex: 1,
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    marginTop: -20,
  },
  formContainer: {
    padding: Spacing.lg,
    paddingTop: 28,
  },
  formTitle: {
    fontSize: 22,
    fontFamily: FontFamily.heading,
    marginBottom: 6,
  },
  formSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.body,
    marginBottom: 20,
  },
  benefitsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  benefitCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginHorizontal: 4,
  },
  benefitText: {
    fontSize: 11,
    fontFamily: FontFamily.bodySemi,
    marginLeft: 6,
  },
  inputContainer: {
    marginBottom: 20,
  },
  signUpButton: {
    marginVertical: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 0.5,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 12,
    fontFamily: FontFamily.bodySemi,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    marginBottom: 12,
  },
  socialButtonText: {
    fontSize: 14,
    fontFamily: FontFamily.bodySemi,
    marginLeft: 12,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 24,
  },
  signInText: {
    fontSize: 14,
    fontFamily: FontFamily.body,
  },
  signInLink: {
    fontSize: 14,
    fontFamily: FontFamily.bodySemi,
  },
});
