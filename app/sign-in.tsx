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
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Button from '@/components/ui/button';
import Input from '@/components/ui/input';
import { Colors, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useAuth } from '@/app/context/auth-context';
import { FontFamily } from '@/constants/fonts';

const BIOMETRIC_EMAIL_KEY = '@gullak_biometric_email';
const BIOMETRIC_PASSWORD_KEY = '@gullak_biometric_password';

export default function SignInPage() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const { login, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isBiometricSupported, setIsBiometricSupported] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkBiometrics();
    loadSavedEmail();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const checkBiometrics = async () => {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setIsBiometricSupported(compatible && enrolled);
  };

  const loadSavedEmail = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem(BIOMETRIC_EMAIL_KEY);
      if (savedEmail) {
        setEmail(savedEmail);
      }
    } catch (e) {
      console.warn('Failed to load saved email');
    }
  };

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }
    setLoading(true);
    const res = await login(email, password);
    setLoading(false);
    if (res.success) {
      // Save credentials for biometrics future login
      try {
        await AsyncStorage.setItem(BIOMETRIC_EMAIL_KEY, email);
        await AsyncStorage.setItem(BIOMETRIC_PASSWORD_KEY, password);
      } catch (e) {
        console.warn('Failed to persist biometric keys');
      }
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', res.error || 'Invalid credentials');
    }
  };

  const handleBiometricAuth = async () => {
    try {
      const savedEmail = await AsyncStorage.getItem(BIOMETRIC_EMAIL_KEY);
      const savedPassword = await AsyncStorage.getItem(BIOMETRIC_PASSWORD_KEY);

      if (!savedEmail || !savedPassword) {
        Alert.alert('Not Enabled', 'Please sign in manually with email and password first to enable biometric authentication.');
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Unlock Gullak',
        fallbackLabel: 'Enter Password',
        disableDeviceFallback: false,
      });

      if (result.success) {
        setLoading(true);
        const res = await login(savedEmail, savedPassword);
        setLoading(false);
        if (res.success) {
          router.replace('/(tabs)');
        } else {
          Alert.alert('Login Failed', res.error || 'Biometric authentication failed.');
        }
      }
    } catch (e) {
      Alert.alert('Error', 'Biometric authentication failed.');
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
            <View style={[styles.logoCircle, { backgroundColor: colors.primary + '25', borderColor: colors.primary + '60', borderWidth: 1.5 }]}>
              <Text style={{ fontSize: 32 }}>🪙</Text>
            </View>
            <Text style={styles.headerTitle}>Welcome Back!</Text>
            <Text style={styles.headerSubtitle}>Sign in to continue investing</Text>
          </View>
        </LinearGradient>

        {/* Form Section */}
        <ScrollView
          style={[styles.formSection, { backgroundColor: colors.background }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formContainer}>
            <Text style={[styles.formTitle, { color: colors.text }]}>Sign In</Text>
            <Text style={[styles.formSubtitle, { color: colors.textSecondary }]}>
              Enter your credentials to access your Gullak
            </Text>

            <View style={styles.inputContainer}>
              <Input
                label="Email"
                placeholder="your.email@example.com"
                value={email}
                onChangeText={setEmail}
                leftIcon="mail-outline"
                keyboardType="email-address"
              />

              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                leftIcon="lock-closed-outline"
                secureTextEntry
              />

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={[styles.forgotPasswordText, { color: colors.primary }]}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <Button
                variant="primary"
                size="lg"
                onPress={handleSignIn}
                style={StyleSheet.flatten([styles.signInButton, { flex: 1 }])}
                title={loading ? 'Signing In...' : 'Sign In'}
                disabled={loading}
              />
              
              {isBiometricSupported && (
                <TouchableOpacity
                  style={[styles.biometricBtn, { backgroundColor: colors.surfaceVariant, borderColor: colors.border, borderWidth: 1 }]}
                  onPress={handleBiometricAuth}
                >
                  <Ionicons name="finger-print" size={24} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
              <View>
                <Text style={[styles.dividerText, { color: colors.textSecondary }]}>OR</Text>
              </View>
              <View style={[styles.divider, { backgroundColor: colors.border }]} />
            </View>

            {/* Social Login Buttons */}
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: colors.surface, borderColor: colors.border }]} onPress={() => {}}>
              <Ionicons name="logo-google" size={20} color="#EA4335" />
              <Text style={[styles.socialButtonText, { color: colors.text }]}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Sign Up Link */}
            <View style={styles.signUpContainer}>
              <Text style={[styles.signUpText, { color: colors.textSecondary }]}>Don't have an account?{' '}</Text>
              <TouchableOpacity onPress={() => router.push('sign-up' as any)}>
                <Text style={[styles.signUpLink, { color: colors.primary }]}>Sign Up</Text>
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
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginTop: 6,
  },
  forgotPasswordText: {
    fontSize: 13,
    fontFamily: FontFamily.bodySemi,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  signInButton: {
    marginVertical: 0,
  },
  biometricBtn: {
    width: 52,
    height: 52,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
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
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
    marginBottom: 24,
  },
  signUpText: {
    fontSize: 14,
    fontFamily: FontFamily.body,
  },
  signUpLink: {
    fontSize: 14,
    fontFamily: FontFamily.bodySemi,
  },
});
