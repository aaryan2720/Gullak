import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

interface RazorpayCheckoutProps {
  visible: boolean;
  amount: number;
  onSuccess: (paymentId: string, txHash: string) => void;
  onClose: () => void;
}

export default function RazorpayCheckout({
  visible,
  amount,
  onSuccess,
  onClose,
}: RazorpayCheckoutProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];
  
  // Payment states: 'checkout' | 'processing' | 'success'
  const [paymentState, setPaymentState] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [paymentId, setPaymentId] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  
  // Animation value
  const [slideAnim] = useState(new Animated.Value(height));

  useEffect(() => {
    if (visible) {
      setPaymentState('checkout');
      setProcessingStep(0);
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: height,
        duration: 350,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const handlePay = () => {
    setPaymentState('processing');
    setProcessingStep(1);

    // Step 1: Connecting to Razorpay Sandbox
    setTimeout(() => {
      setProcessingStep(2);
      
      // Step 2: Processing Payment
      setTimeout(() => {
        setProcessingStep(3);
        
        // Generate Mock Payment ID and Polygon Tx Hash
        const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
        const mockPayId = `pay_Gullak_${randomId}`;
        const randomHash = Array.from({ length: 40 }, () =>
          Math.floor(Math.random() * 16).toString(16)
        ).join('');
        const mockTxHash = `0x${randomHash}`;
        
        setPaymentId(mockPayId);
        setTxHash(mockTxHash);

        // Step 3: Logging to Polygon Blockchain
        setTimeout(() => {
          setPaymentState('success');
        }, 1800);
      }, 1500);
    }, 1200);
  };

  const handleSuccessClose = () => {
    onSuccess(paymentId, txHash);
  };

  const renderCheckout = () => (
    <View style={styles.sheetContent}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.brandLogoRow}>
          <Text style={styles.brandLogoEmoji}>🏺</Text>
          <View>
            <Text style={styles.brandName}>Gullak Micro-Invest</Text>
            <Text style={styles.merchantId}>order_Gullak_{amount}_{Date.now().toString().slice(-5)}</Text>
          </View>
        </View>
        <View style={styles.securedBadge}>
          <Ionicons name="shield-checkmark" size={12} color="#00BCD4" />
          <Text style={styles.securedText}>SECURE</Text>
        </View>
      </View>

      {/* Amount Area */}
      <View style={styles.amountArea}>
        <Text style={styles.amountLabel}>Amount to Invest</Text>
        <Text style={styles.amountValue}>₹{amount.toLocaleString()}</Text>
      </View>

      {/* Payment Options */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>CHOOSE PAYMENT METHOD</Text>
        
        {/* UPI Option */}
        <TouchableOpacity
          style={[
            styles.methodItem,
            selectedMethod === 'upi' && styles.methodItemSelected,
            { borderColor: colors.border }
          ]}
          activeOpacity={0.7}
          onPress={() => setSelectedMethod('upi')}
        >
          <View style={styles.methodIconWrapper}>
            <Ionicons name="phone-portrait-outline" size={24} color="#6C63FF" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={[styles.methodTitle, { color: colors.text }]}>UPI / Google Pay / PhonePe</Text>
            <Text style={[styles.methodDesc, { color: colors.textSecondary }]}>Pay instantly using any UPI app</Text>
          </View>
          <View style={[styles.radio, selectedMethod === 'upi' && styles.radioSelected]} />
        </TouchableOpacity>

        {/* Card Option */}
        <TouchableOpacity
          style={[
            styles.methodItem,
            selectedMethod === 'card' && styles.methodItemSelected,
            { borderColor: colors.border }
          ]}
          activeOpacity={0.7}
          onPress={() => setSelectedMethod('card')}
        >
          <View style={styles.methodIconWrapper}>
            <Ionicons name="card-outline" size={24} color="#FF6584" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={[styles.methodTitle, { color: colors.text }]}>Credit / Debit Card</Text>
            <Text style={[styles.methodDesc, { color: colors.textSecondary }]}>Visa, MasterCard, RuPay, Maestro</Text>
          </View>
          <View style={[styles.radio, selectedMethod === 'card' && styles.radioSelected]} />
        </TouchableOpacity>

        {/* Netbanking Option */}
        <TouchableOpacity
          style={[
            styles.methodItem,
            selectedMethod === 'netbanking' && styles.methodItemSelected,
            { borderColor: colors.border }
          ]}
          activeOpacity={0.7}
          onPress={() => setSelectedMethod('netbanking')}
        >
          <View style={styles.methodIconWrapper}>
            <Ionicons name="business-outline" size={24} color="#4CAF50" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={[styles.methodTitle, { color: colors.text }]}>Netbanking</Text>
            <Text style={[styles.methodDesc, { color: colors.textSecondary }]}>All Indian banks supported</Text>
          </View>
          <View style={[styles.radio, selectedMethod === 'netbanking' && styles.radioSelected]} />
        </TouchableOpacity>
      </View>

      {/* Razorpay Footer Info */}
      <View style={styles.gatewayFooter}>
        <View style={styles.razorpayBrand}>
          <Text style={styles.razorpayText}>Secured by </Text>
          <Text style={styles.razorpayBold}>Razorpay</Text>
        </View>
        <Text style={styles.sandboxBadge}>SANDBOX MODE</Text>
      </View>

      {/* Pay Button */}
      <TouchableOpacity
        style={styles.payButton}
        activeOpacity={0.8}
        onPress={handlePay}
      >
        <Ionicons name="lock-closed" size={18} color="#FFFFFF" />
        <Text style={styles.payButtonText}>Pay Securely ₹{amount}</Text>
      </TouchableOpacity>
    </View>
  );

  const renderProcessing = () => (
    <View style={styles.processingContent}>
      <ActivityIndicator size="large" color="#6C63FF" style={styles.loader} />
      <Text style={[styles.processingTitle, { color: colors.text }]}>Securing Payment</Text>
      
      <View style={styles.stepsContainer}>
        {/* Step 1: Gateway */}
        <View style={styles.stepRow}>
          <Ionicons
            name={processingStep >= 2 ? "checkmark-circle" : "ellipse-outline"}
            size={20}
            color={processingStep >= 2 ? "#4CAF50" : "#6C63FF"}
          />
          <Text
            style={[
              styles.stepText,
              processingStep === 1 && styles.stepTextActive,
              processingStep >= 2 && styles.stepTextDone,
              { color: colors.text }
            ]}
          >
            Connecting to Razorpay Secure Gateway...
          </Text>
        </View>

        {/* Step 2: Processing */}
        <View style={styles.stepRow}>
          <Ionicons
            name={processingStep >= 3 ? "checkmark-circle" : "ellipse-outline"}
            size={20}
            color={processingStep >= 3 ? "#4CAF50" : processingStep === 2 ? "#6C63FF" : "#E0E0E0"}
          />
          <Text
            style={[
              styles.stepText,
              processingStep === 2 && styles.stepTextActive,
              processingStep >= 3 && styles.stepTextDone,
              { color: colors.text }
            ]}
          >
            Processing Transaction amount ₹{amount}...
          </Text>
        </View>

        {/* Step 3: Blockchain */}
        <View style={styles.stepRow}>
          <Ionicons
            name={processingStep > 3 ? "checkmark-circle" : "ellipse-outline"}
            size={20}
            color={processingStep === 3 ? "#8247E5" : "#E0E0E0"}
          />
          <Text
            style={[
              styles.stepText,
              processingStep === 3 && styles.stepTextActive,
              { color: colors.text }
            ]}
          >
            Logging transaction ledger to Polygon Blockchain...
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.successContent}>
      <View style={styles.successCircle}>
        <Ionicons name="checkmark" size={60} color="#FFFFFF" />
      </View>
      <Text style={[styles.successTitle, { color: colors.text }]}>Investment Successful!</Text>
      <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
        Your payment has been completed and secured on-chain.
      </Text>

      {/* Transaction Details Card */}
      <View style={[styles.receiptCard, { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5FF' }]}>
        <View style={styles.receiptRow}>
          <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Status</Text>
          <Text style={[styles.receiptValue, { color: '#4CAF50', fontWeight: '700' }]}>SUCCESS</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Amount</Text>
          <Text style={[styles.receiptValue, { color: colors.text, fontWeight: '700' }]}>₹{amount}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Razorpay ID</Text>
          <Text style={[styles.receiptValue, { color: colors.text }]} numberOfLines={1}>
            {paymentId}
          </Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Polygon Tx Hash</Text>
          <Text style={[styles.receiptValue, { color: '#8247E5', fontSize: 11 }]} numberOfLines={1} ellipsizeMode="middle">
            {txHash}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.successButton}
        activeOpacity={0.8}
        onPress={handleSuccessClose}
      >
        <Text style={styles.successButtonText}>Back to Dashboard</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Click outside to close (only if not processing/success) */}
        <TouchableOpacity
          style={styles.dismissOverlay}
          activeOpacity={1}
          onPress={() => {
            if (paymentState === 'checkout') onClose();
          }}
        />

        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: slideAnim }],
              backgroundColor: colors.background,
            },
          ]}
        >
          {/* Header handle indicator */}
          <View style={styles.handle} />

          {/* Close button (only visible during checkout) */}
          {paymentState === 'checkout' && (
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          )}

          {/* Render states */}
          {paymentState === 'checkout' && renderCheckout()}
          {paymentState === 'processing' && renderProcessing()}
          {paymentState === 'success' && renderSuccess()}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  dismissOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xl + 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 20,
    alignItems: 'center',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#CCCCCC',
    borderRadius: 3,
    marginBottom: Spacing.md,
  },
  closeBtn: {
    position: 'absolute',
    top: 15,
    right: 20,
    zIndex: 10,
  },
  sheetContent: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
  },
  // Brand Header
  brandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: Spacing.md,
  },
  brandLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brandLogoEmoji: {
    fontSize: 28,
  },
  brandName: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: '#0A2540',
  },
  merchantId: {
    fontSize: 10,
    color: '#666666',
    marginTop: 2,
  },
  securedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F7FA',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 3,
  },
  securedText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#00BCD4',
  },
  // Amount Area
  amountArea: {
    backgroundColor: '#0A2540',
    borderRadius: 16,
    padding: Spacing.md,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  amountLabel: {
    fontSize: Typography.fontSize.xs,
    color: '#B8C5D6',
    fontWeight: '600',
  },
  amountValue: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 4,
  },
  // Section Options
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  methodItemSelected: {
    borderColor: '#6C63FF',
    backgroundColor: '#6C63FF0B',
  },
  methodIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  methodInfo: {
    flex: 1,
  },
  methodTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
  methodDesc: {
    fontSize: 11,
    marginTop: 2,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCCCCC',
  },
  radioSelected: {
    borderColor: '#6C63FF',
    borderWidth: 6,
  },
  // Footer
  gatewayFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  razorpayBrand: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  razorpayText: {
    fontSize: 11,
    color: '#666666',
  },
  razorpayBold: {
    fontSize: 11,
    color: '#13274F',
    fontWeight: '800',
  },
  sandboxBadge: {
    fontSize: 9,
    fontWeight: '800',
    color: '#E65100',
    backgroundColor: '#FFE0B2',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  payButton: {
    backgroundColor: '#0A2540',
    borderRadius: 14,
    paddingVertical: Spacing.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: Spacing.xs,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: Typography.fontSize.base,
  },
  // Processing State
  processingContent: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  loader: {
    marginBottom: Spacing.md,
  },
  processingTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '700',
    marginBottom: Spacing.xl,
  },
  stepsContainer: {
    width: '100%',
    gap: Spacing.md,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.sm,
  },
  stepText: {
    fontSize: Typography.fontSize.sm,
    color: '#999999',
    flex: 1,
  },
  stepTextActive: {
    color: '#6C63FF',
    fontWeight: '700',
  },
  stepTextDone: {
    color: '#4CAF50',
    textDecorationLine: 'none',
  },
  // Success State
  successContent: {
    width: '100%',
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  successTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '900',
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: Typography.fontSize.sm,
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 20,
  },
  receiptCard: {
    width: '100%',
    borderRadius: 16,
    padding: Spacing.md,
    marginVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 12,
  },
  receiptValue: {
    fontSize: 12,
  },
  successButton: {
    backgroundColor: '#4CAF50',
    width: '100%',
    borderRadius: 14,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  successButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: Typography.fontSize.base,
  },
});
