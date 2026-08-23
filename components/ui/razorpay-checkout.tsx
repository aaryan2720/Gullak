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
  Alert,
  NativeModules,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Spacing, Shadows, Typography } from '@/constants/theme';
import { FontFamily } from '@/constants/fonts';
import { apiService } from '@/app/services/api';

// Safely import native Razorpay module
const { RazorpayCheckout } = NativeModules;

const { width, height } = Dimensions.get('window');

interface RazorpayCheckoutProps {
  visible: boolean;
  amount: number;
  goalId?: string;
  allocation?: any;
  onSuccess: (paymentId: string, txHash: string) => void;
  onClose: () => void;
}

export default function RazorpayCheckoutComponent({
  visible,
  amount,
  goalId,
  allocation,
  onSuccess,
  onClose,
}: RazorpayCheckoutProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];

  // Payment states: 'checkout' | 'processing' | 'success' | 'failed'
  const [paymentState, setPaymentState] = useState<'checkout' | 'processing' | 'success' | 'failed'>('checkout');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [processingStep, setProcessingStep] = useState<number>(0);
  const [paymentId, setPaymentId] = useState<string>('');
  const [txHash, setTxHash] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [slideAnim] = useState(new Animated.Value(height));

  useEffect(() => {
    if (visible) {
      setPaymentState('checkout');
      setProcessingStep(0);
      setErrorMessage('');
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

  const handleNativeCheckout = async (orderId: string, keyId: string) => {
    const options = {
      description: goalId ? 'Gullak Goal Contribution' : 'Gullak Investment Sweep',
      image: 'https://i.imgur.com/3g7A6Zt.png',
      currency: 'INR',
      key: keyId,
      amount: amount * 100,
      name: 'Gullak Micro-Save',
      order_id: orderId,
      prefill: {
        email: 'user@gullak.app',
        contact: '9876543210',
        name: 'Gullak User'
      },
      theme: { color: colors.primary }
    };

    try {
      // Calls native Razorpay SDK (works when compiled / dev-client)
      const data = await RazorpayCheckout.open(options);
      
      // Payment successful natively, verify signature on backend
      setPaymentState('processing');
      setProcessingStep(1); // Verifying signature

      const verification = await apiService.verifyPayment({
        razorpayOrderId: orderId,
        razorpayPaymentId: data.razorpay_payment_id,
        razorpaySignature: data.razorpay_signature,
        amount,
        goalId,
        allocation,
        isMock: false,
      });

      if (verification.success) {
        setPaymentId(data.razorpay_payment_id);
        setTxHash(verification.data.blockchainReceipt?.txHash || '');
        setPaymentState('success');
      } else {
        throw new Error(verification.error?.message || 'Verification failed');
      }
    } catch (error: any) {
      console.warn('Native Razorpay Checkout failed or cancelled:', error.message);
      setErrorMessage(error.message || 'Payment Cancelled');
      setPaymentState('failed');
    }
  };

  const handlePay = async () => {
    setPaymentState('processing');
    setProcessingStep(0); // Initiating order

    try {
      // 1. Create order on backend
      const orderRes = await apiService.createPaymentOrder(amount, {
        goalId: goalId || '',
        category: goalId ? 'goal_contribution' : 'manual'
      });

      if (!orderRes.success) {
        throw new Error(orderRes.error?.message || 'Order creation failed');
      }

      const { orderId, keyId, isMock } = orderRes.data;

      // 2. If running natively and Razorpay SDK is available, use it
      if (!isMock && RazorpayCheckout) {
        handleNativeCheckout(orderId, keyId);
        return;
      }

      // 3. Fallback/Expo Go Simulation flow (still verifies with backend using isMock = true)
      setProcessingStep(1); // Connecting to Razorpay Sandbox

      setTimeout(() => {
        setProcessingStep(2); // Processing simulated payment

        setTimeout(async () => {
          setProcessingStep(3); // Recording to Polygon Blockchain

          try {
            const randomId = Math.random().toString(36).substring(2, 10).toUpperCase();
            const mockPayId = `pay_Gullak_${randomId}`;

            const verification = await apiService.verifyPayment({
              razorpayOrderId: orderId,
              razorpayPaymentId: mockPayId,
              razorpaySignature: '',
              amount,
              goalId,
              allocation,
              isMock: true, // triggers backend mock verification logic
            });

            if (verification.success) {
              setPaymentId(mockPayId);
              setTxHash(verification.data.blockchainReceipt?.txHash || '');
              setPaymentState('success');
            } else {
              throw new Error(verification.error?.message || 'Payment Verification failed');
            }
          } catch (err: any) {
            setErrorMessage(err.message || 'Failed to complete sandbox payment');
            setPaymentState('failed');
          }
        }, 1200);
      }, 1000);

    } catch (err: any) {
      setErrorMessage(err.message || 'Payment Initiation failed');
      setPaymentState('failed');
    }
  };

  const handleSuccessClose = () => {
    onSuccess(paymentId, txHash);
  };

  const renderCheckout = () => (
    <View style={styles.sheetContent}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.brandLogoRow}>
          <Text style={{ fontSize: 24 }}>🏺</Text>
          <View>
            <Text style={[styles.brandName, { color: colors.text }]}>Gullak Invest</Text>
            <Text style={[styles.merchantId, { color: colors.textSecondary }]}>MID: Gullak Micro-Save</Text>
          </View>
        </View>
        <View style={[styles.securedBadge, { backgroundColor: colors.success + '20' }]}>
          <Ionicons name="shield-checkmark" size={12} color={colors.success} />
          <Text style={[styles.securedText, { color: colors.success }]}>SECURE</Text>
        </View>
      </View>

      {/* Amount Area */}
      <View style={[styles.amountArea, { backgroundColor: colors.surfaceVariant }]}>
        <Text style={[styles.amountLabel, { color: colors.textSecondary }]}>Amount to Invest</Text>
        <Text style={[styles.amountValue, { color: colors.text }]}>₹{amount.toLocaleString('en-IN')}</Text>
      </View>

      {/* Payment Options */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>CHOOSE PAYMENT METHOD</Text>
        
        {/* UPI Option */}
        <TouchableOpacity
          style={[
            styles.methodItem,
            selectedMethod === 'upi' && [styles.methodItemSelected, { borderColor: colors.primary }],
            { borderColor: colors.border }
          ]}
          activeOpacity={0.7}
          onPress={() => setSelectedMethod('upi')}
        >
          <View style={[styles.methodIconWrapper, { backgroundColor: colors.primary + '15' }]}>
            <Ionicons name="phone-portrait-outline" size={20} color={colors.primary} />
          </View>
          <View style={styles.methodInfo}>
            <Text style={[styles.methodTitle, { color: colors.text }]}>UPI / Google Pay / PhonePe</Text>
            <Text style={[styles.methodDesc, { color: colors.textSecondary }]}>Pay instantly using any UPI app</Text>
          </View>
          <View style={[styles.radio, { borderColor: colors.border }, selectedMethod === 'upi' && [styles.radioSelected, { backgroundColor: colors.primary, borderColor: colors.primary }]]} />
        </TouchableOpacity>

        {/* Card Option */}
        <TouchableOpacity
          style={[
            styles.methodItem,
            selectedMethod === 'card' && [styles.methodItemSelected, { borderColor: colors.primary }],
            { borderColor: colors.border }
          ]}
          activeOpacity={0.7}
          onPress={() => setSelectedMethod('card')}
        >
          <View style={[styles.methodIconWrapper, { backgroundColor: '#FFD16620' }]}>
            <Ionicons name="card-outline" size={20} color="#FFD166" />
          </View>
          <View style={styles.methodInfo}>
            <Text style={[styles.methodTitle, { color: colors.text }]}>Credit or Debit Card</Text>
            <Text style={[styles.methodDesc, { color: colors.textSecondary }]}>Visa, MasterCard, RuPay, Maestro</Text>
          </View>
          <View style={[styles.radio, { borderColor: colors.border }, selectedMethod === 'card' && [styles.radioSelected, { backgroundColor: colors.primary, borderColor: colors.primary }]]} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[styles.payButton, { backgroundColor: colors.primary }]}
        activeOpacity={0.8}
        onPress={handlePay}
      >
        <Text style={styles.payButtonText}>Pay Now ₹{amount.toLocaleString('en-IN')}</Text>
        <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

  const renderProcessing = () => {
    let message = 'Initiating transaction...';
    if (processingStep === 1) message = 'Connecting to Razorpay Secure Gateway...';
    if (processingStep === 2) message = 'Processing payment transaction...';
    if (processingStep === 3) message = 'Anchoring transaction receipt to Polygon Ledger...';

    return (
      <View style={styles.processingContent}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.processingText, { color: colors.text }]}>{message}</Text>
        <Text style={[styles.processingSub, { color: colors.textSecondary }]}>Please do not close the app or click back</Text>
      </View>
    );
  };

  const renderSuccess = () => (
    <View style={styles.successContent}>
      <View style={[styles.successCircle, { backgroundColor: colors.success, shadowColor: colors.success }]}>
        <Ionicons name="checkmark" size={48} color="#FFFFFF" />
      </View>
      <Text style={[styles.successTitle, { color: colors.text }]}>Investment Successful!</Text>
      <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
        Your contribution of ₹{amount.toLocaleString('en-IN')} has been received and logged to the Polygon network.
      </Text>

      <View style={[styles.receiptCard, { backgroundColor: colors.surfaceVariant, borderColor: colors.border, borderWidth: 1 }]}>
        <View style={styles.receiptRow}>
          <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Payment ID</Text>
          <Text style={[styles.receiptValue, { color: colors.text, fontFamily: Typography.fontFamily.mono }]}>{paymentId}</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>Status</Text>
          <Text style={[styles.receiptValue, { color: colors.success, fontFamily: FontFamily.bodySemi }]}>Completed</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={[styles.receiptLabel, { color: colors.textSecondary }]}>On-chain Receipt</Text>
          <Text style={[styles.receiptValue, { color: colors.primary, fontFamily: Typography.fontFamily.mono }]} numberOfLines={1}>
            {txHash ? `${txHash.slice(0, 10)}...${txHash.slice(-6)}` : 'Logged'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[styles.successButton, { backgroundColor: colors.success }]}
        onPress={handleSuccessClose}
      >
        <Text style={styles.successButtonText}>Back to Hub</Text>
      </TouchableOpacity>
    </View>
  );

  const renderFailed = () => (
    <View style={styles.successContent}>
      <View style={[styles.successCircle, { backgroundColor: colors.error, shadowColor: colors.error }]}>
        <Ionicons name="close" size={48} color="#FFFFFF" />
      </View>
      <Text style={[styles.successTitle, { color: colors.text }]}>Payment Failed</Text>
      <Text style={[styles.successSubtitle, { color: colors.textSecondary, marginBottom: 20 }]}>
        {errorMessage || 'Something went wrong during payment processing. Please try again.'}
      </Text>
      <TouchableOpacity
        style={[styles.successButton, { backgroundColor: colors.primary }]}
        onPress={() => setPaymentState('checkout')}
      >
        <Text style={styles.successButtonText}>Retry Payment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ marginTop: 14 }}
        onPress={onClose}
      >
        <Text style={{ color: colors.textSecondary, fontFamily: FontFamily.bodySemi }}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="none"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} onPress={onClose} disabled={paymentState === 'processing'} />
        <Animated.View
          style={[
            styles.sheet,
            { backgroundColor: colors.surface },
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={[styles.handle, { backgroundColor: colors.border }]} />
          
          {paymentState === 'checkout' && renderCheckout()}
          {paymentState === 'processing' && renderProcessing()}
          {paymentState === 'success' && renderSuccess()}
          {paymentState === 'failed' && renderFailed()}
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
  dismissArea: {
    flex: 1,
  },
  sheet: {
    borderTopLeftRadius: BorderRadius.xl,
    borderTopRightRadius: BorderRadius.xl,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    width: '100%',
    maxHeight: '90%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetContent: {
    paddingHorizontal: Spacing.md,
  },
  brandHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  brandLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandName: {
    fontSize: 15,
    fontFamily: FontFamily.headingSemi,
  },
  merchantId: {
    fontSize: 11,
    fontFamily: FontFamily.body,
  },
  securedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  securedText: {
    fontSize: 10,
    fontFamily: FontFamily.bodySemi,
  },
  amountArea: {
    padding: 16,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    marginBottom: 20,
  },
  amountLabel: {
    fontSize: 12,
    fontFamily: FontFamily.body,
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 28,
    fontFamily: FontFamily.heading,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: FontFamily.bodySemi,
    marginBottom: 12,
  },
  methodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginBottom: 10,
  },
  methodItemSelected: {
    borderWidth: 1.5,
  },
  methodIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  methodInfo: {
    flex: 1,
    gap: 2,
  },
  methodTitle: {
    fontSize: 14,
    fontFamily: FontFamily.bodySemi,
  },
  methodDesc: {
    fontSize: 11,
    fontFamily: FontFamily.body,
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  radioSelected: {
    borderWidth: 0,
  },
  payButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontFamily: FontFamily.bodySemi,
  },
  processingContent: {
    paddingVertical: 48,
    alignItems: 'center',
    gap: 16,
  },
  processingText: {
    fontSize: 15,
    fontFamily: FontFamily.bodySemi,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
  processingSub: {
    fontSize: 12,
    fontFamily: FontFamily.body,
  },
  successContent: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: 12,
  },
  successCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 20,
    fontFamily: FontFamily.heading,
  },
  successSubtitle: {
    fontSize: 13,
    fontFamily: FontFamily.body,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 6,
  },
  receiptCard: {
    width: '100%',
    borderRadius: BorderRadius.md,
    padding: 16,
    marginVertical: 20,
    gap: 10,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 12,
    fontFamily: FontFamily.body,
  },
  receiptValue: {
    fontSize: 12,
    fontFamily: FontFamily.bodySemi,
  },
  successButton: {
    width: '100%',
    borderRadius: BorderRadius.md,
    paddingVertical: 14,
    alignItems: 'center',
  },
  successButtonText: {
    color: '#FFFFFF',
    fontFamily: FontFamily.bodySemi,
    fontSize: 15,
  },
});
