import Button from '@/components/ui/button';
import Card from '@/components/ui/card';
import ProgressBar from '@/components/ui/progress-bar';
import RazorpayCheckout from '@/components/ui/razorpay-checkout';
import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Goal {
  id: number;
  emoji: string;
  title: string;
  current: number;
  target: number;
  progress: number;
  color: string;
}

import { LinearGradient } from 'expo-linear-gradient';

export default function GoalsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'light'];

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: 1,
      emoji: '📱',
      title: 'New iPhone',
      current: 15000,
      target: 30000,
      progress: 50,
      color: colors.goals.gadgets,
    },
    {
      id: 2,
      emoji: '✈️',
      title: 'Trip to Goa',
      current: 8000,
      target: 20000,
      progress: 40,
      color: colors.goals.travel,
    },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🎯');
  const [selectedColor, setSelectedColor] = useState(colors.primary);
  const [contributeModalVisible, setContributeModalVisible] = useState(false);
  const [contributeAmount, setContributeAmount] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState<number | null>(null);
  
  // Checkout states
  const [checkoutVisible, setCheckoutVisible] = useState(false);
  const [tempAmount, setTempAmount] = useState(0);

  const emojiOptions = ['🎯', '📱', '💻', '✈️', '🏠', '🚗', '🎓', '💍', '🏖️', '🎮', '📷', '🎸'];
  const colorOptions = [
    { color: colors.goals.gadgets, name: 'Gadgets' },
    { color: colors.goals.travel, name: 'Travel' },
    { color: colors.goals.education, name: 'Education' },
    { color: colors.goals.emergency, name: 'Emergency' },
    { color: colors.primary, name: 'Primary' },
    { color: '#FF6584', name: 'Pink' },
  ];

  const handleAddGoal = () => {
    if (!newGoalTitle.trim() || !newGoalTarget.trim()) {
      return;
    }

    const targetAmount = parseInt(newGoalTarget.replace(/,/g, ''));
    if (isNaN(targetAmount) || targetAmount <= 0) {
      return;
    }

    const newGoal: Goal = {
      id: Date.now(),
      emoji: selectedEmoji,
      title: newGoalTitle,
      current: 0,
      target: targetAmount,
      progress: 0,
      color: selectedColor,
    };

    setGoals([...goals, newGoal]);
    
    // Reset form
    setNewGoalTitle('');
    setNewGoalTarget('');
    setSelectedEmoji('🎯');
    setSelectedColor(colors.primary);
    setModalVisible(false);
  };

  const handleContribute = () => {
    if (!contributeAmount.trim() || selectedGoalId === null) {
      return;
    }

    const amount = parseInt(contributeAmount.replace(/,/g, ''));
    if (isNaN(amount) || amount <= 0) {
      return;
    }

    // Set temp amount and open checkout
    setTempAmount(amount);
    setContributeModalVisible(false);
    
    setTimeout(() => {
      setCheckoutVisible(true);
    }, 150);
  };

  const handlePaymentSuccess = (paymentId: string, txHash: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === selectedGoalId) {
          const newCurrent = goal.current + tempAmount;
          const newProgress = Math.min((newCurrent / goal.target) * 100, 100);
          return { ...goal, current: newCurrent, progress: Math.round(newProgress) };
        }
        return goal;
      })
    );

    setCheckoutVisible(false);
    setContributeAmount('');
    setSelectedGoalId(null);
    setTempAmount(0);

    Alert.alert(
      'Goal Updated! 🎯',
      `Successfully contributed ₹${tempAmount.toLocaleString()} to your goal.\n\nRazorpay ID: ${paymentId}\nPolygon Tx Hash: ${txHash.slice(0, 10)}...${txHash.slice(-6)}`,
      [{ text: 'Woohoo!' }]
    );
  };

  return (
    <LinearGradient
      colors={['#FAFAFA', '#F5F5FF', '#FFF5FA']}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>My Goals</Text>
          <Button
            title="New Goal"
            variant="primary"
            size="sm"
            icon={<Ionicons name="add" size={18} color={colors.textInverse} />}
            onPress={() => setModalVisible(true)}
          />
        </View>

        {/* Stats Summary */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Active Goals
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>{goals.length}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Total Saved
              </Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                ₹{goals.reduce((sum, goal) => sum + goal.current, 0).toLocaleString()}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
                Completed
              </Text>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {goals.filter(g => g.progress >= 100).length}
              </Text>
            </View>
          </View>
        </Card>

        {/* Goals List */}
        <View style={styles.section}>
          {goals.map((goal) => (
            <Card key={goal.id} style={styles.goalCard} onPress={() => {}}>
              <View style={styles.goalHeader}>
                <View style={styles.goalIcon}>
                  <Text style={styles.emoji}>{goal.emoji}</Text>
                </View>
                <View style={styles.flex}>
                  <Text style={[styles.goalTitle, { color: colors.text }]}>{goal.title}</Text>
                  <View style={styles.amountRow}>
                    <Text style={[styles.currentAmount, { color: goal.color }]}>
                      ₹{goal.current.toLocaleString()}
                    </Text>
                    <Text style={[styles.targetAmount, { color: colors.textSecondary }]}>
                      {' '}
                      / ₹{goal.target.toLocaleString()}
                    </Text>
                  </View>
                </View>
              </View>

              <ProgressBar progress={goal.progress} color={goal.color} style={styles.progress} />

              <View style={styles.goalFooter}>
                <View>
                  <Text style={[styles.footerLabel, { color: colors.textSecondary }]}>
                    Progress
                  </Text>
                  <Text style={[styles.footerValue, { color: colors.text }]}>
                    {goal.progress}%
                  </Text>
                </View>
                <Button
                  title="Contribute"
                  variant="primary"
                  size="sm"
                  onPress={() => {
                    setSelectedGoalId(goal.id);
                    setContributeModalVisible(true);
                  }}
                  icon={<Ionicons name="add-circle-outline" size={16} color={colors.textInverse} />}
                />
              </View>
            </Card>
          ))}
        </View>

        {/* Empty State for New Users */}
        {goals.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyEmoji]}>🎯</Text>
            <Text style={[styles.emptyTitle, { color: colors.text }]}>No goals yet</Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Create your first goal and start saving!
            </Text>
            <Button title="Create Goal" variant="primary" onPress={() => {}} style={styles.emptyButton} />
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Add Goal Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Goal</Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Emoji Selection */}
            <View style={styles.formSection}>
              <Text style={[styles.label, { color: colors.text }]}>Choose an Icon</Text>
              <View style={styles.emojiGrid}>
                {emojiOptions.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    style={[
                      styles.emojiOption,
                      selectedEmoji === emoji && styles.emojiSelected,
                      { backgroundColor: selectedEmoji === emoji ? colors.primary + '20' : colors.background },
                    ]}
                    onPress={() => setSelectedEmoji(emoji)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.emojiText}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Goal Title */}
            <View style={styles.formSection}>
              <Text style={[styles.label, { color: colors.text }]}>Goal Name</Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
                    color: colors.text,
                  },
                ]}
                placeholder="e.g., New Laptop, Dream Vacation"
                placeholderTextColor={colors.textSecondary}
                value={newGoalTitle}
                onChangeText={setNewGoalTitle}
              />
            </View>

            {/* Target Amount */}
            <View style={styles.formSection}>
              <Text style={[styles.label, { color: colors.text }]}>Target Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={[styles.currencySymbol, { color: colors.text }]}>₹</Text>
                <TextInput
                  style={[
                    styles.amountInput,
                    {
                      backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
                      color: colors.text,
                    },
                  ]}
                  placeholder="0"
                  placeholderTextColor={colors.textSecondary}
                  value={newGoalTarget}
                  onChangeText={(text) => {
                    // Allow only numbers and format
                    const numericValue = text.replace(/[^0-9]/g, '');
                    if (numericValue) {
                      setNewGoalTarget(parseInt(numericValue).toLocaleString());
                    } else {
                      setNewGoalTarget('');
                    }
                  }}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Color Selection */}
            <View style={styles.formSection}>
              <Text style={[styles.label, { color: colors.text }]}>Choose a Color</Text>
              <View style={styles.colorGrid}>
                {colorOptions.map((option) => (
                  <TouchableOpacity
                    key={option.name}
                    style={[
                      styles.colorOption,
                      selectedColor === option.color && styles.colorSelected,
                    ]}
                    onPress={() => setSelectedColor(option.color)}
                    activeOpacity={0.7}
                  >
                    <View
                      style={[
                        styles.colorCircle,
                        { backgroundColor: option.color },
                      ]}
                    >
                      {selectedColor === option.color && (
                        <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                      )}
                    </View>
                    <Text style={[styles.colorName, { color: colors.textSecondary }]}>
                      {option.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Preview */}
            <View style={styles.formSection}>
              <Text style={[styles.label, { color: colors.text }]}>Preview</Text>
              <Card style={styles.previewCard}>
                <View style={styles.previewHeader}>
                  <View
                    style={[
                      styles.previewIcon,
                      { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5' },
                    ]}
                  >
                    <Text style={styles.previewEmoji}>{selectedEmoji}</Text>
                  </View>
                  <View style={styles.flex}>
                    <Text style={[styles.previewTitle, { color: colors.text }]}>
                      {newGoalTitle || 'Your Goal Name'}
                    </Text>
                    <Text style={[styles.previewAmount, { color: selectedColor }]}>
                      ₹0 / ₹{newGoalTarget || '0'}
                    </Text>
                  </View>
                </View>
              </Card>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleAddGoal}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Create Goal</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Contribute Modal */}
      <Modal
        visible={contributeModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setContributeModalVisible(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Add Contribution</Text>
            <TouchableOpacity
              onPress={() => setContributeModalVisible(false)}
              style={styles.closeButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={28} color={colors.text} />
            </TouchableOpacity>
          </View>

          <View style={[styles.modalContent, { paddingTop: Spacing.xl }]}>
            {selectedGoalId && (
              <>
                {/* Selected Goal Info */}
                <Card style={styles.selectedGoalCard}>
                  {(() => {
                    const goal = goals.find((g) => g.id === selectedGoalId);
                    if (!goal) return null;
                    return (
                      <View style={styles.selectedGoalContent}>
                        <View style={styles.selectedGoalIcon}>
                          <Text style={styles.selectedGoalEmoji}>{goal.emoji}</Text>
                        </View>
                        <View style={styles.flex}>
                          <Text style={[styles.selectedGoalTitle, { color: colors.text }]}>
                            {goal.title}
                          </Text>
                          <Text style={[styles.selectedGoalAmount, { color: goal.color }]}>
                            ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                          </Text>
                        </View>
                      </View>
                    );
                  })()}
                </Card>

                {/* Contribution Amount Input */}
                <View style={styles.formSection}>
                  <Text style={[styles.label, { color: colors.text }]}>
                    How much would you like to add?
                  </Text>
                  <View style={styles.amountInputContainer}>
                    <Text style={[styles.currencySymbol, { color: colors.text }]}>₹</Text>
                    <TextInput
                      style={[
                        styles.amountInput,
                        {
                          backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5',
                          color: colors.text,
                        },
                      ]}
                      placeholder="0"
                      placeholderTextColor={colors.textSecondary}
                      value={contributeAmount}
                      onChangeText={(text) => {
                        const numericValue = text.replace(/[^0-9]/g, '');
                        if (numericValue) {
                          setContributeAmount(parseInt(numericValue).toLocaleString());
                        } else {
                          setContributeAmount('');
                        }
                      }}
                      keyboardType="numeric"
                      autoFocus
                    />
                  </View>
                </View>

                {/* Quick Amount Options */}
                <View style={styles.formSection}>
                  <Text style={[styles.label, { color: colors.text }]}>Quick Add</Text>
                  <View style={styles.quickAmountGrid}>
                    {[500, 1000, 2000, 5000].map((amount) => (
                      <TouchableOpacity
                        key={amount}
                        style={[
                          styles.quickAmountButton,
                          { backgroundColor: colorScheme === 'dark' ? '#2A2A2A' : '#F5F5F5' },
                        ]}
                        onPress={() => setContributeAmount(amount.toLocaleString())}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.quickAmountText, { color: colors.text }]}>
                          ₹{amount.toLocaleString()}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.modalActions}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              onPress={handleContribute}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Add to Goal</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* Razorpay Checkout sheet */}
      <RazorpayCheckout
        visible={checkoutVisible}
        amount={tempAmount}
        onSuccess={handlePaymentSuccess}
        onClose={() => setCheckoutVisible(false)}
      />
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  title: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: Typography.fontWeight.bold,
  },
  statsCard: {
    marginHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#E0E0E0',
  },
  statLabel: {
    fontSize: Typography.fontSize.xs,
    marginBottom: Spacing.xs,
  },
  statValue: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  section: {
    paddingHorizontal: Spacing.lg,
  },
  goalCard: {
    marginBottom: Spacing.md,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  goalHeader: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  goalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  emoji: {
    fontSize: 32,
  },
  flex: {
    flex: 1,
  },
  goalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: Typography.fontWeight.semibold,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: Spacing.xs,
  },
  currentAmount: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
  },
  targetAmount: {
    fontSize: Typography.fontSize.base,
  },
  progress: {
    marginBottom: Spacing.md,
  },
  goalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: Typography.fontSize.xs,
  },
  footerValue: {
    fontSize: Typography.fontSize.base,
    fontWeight: Typography.fontWeight.semibold,
    marginTop: Spacing.xs / 2,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing['3xl'],
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: Typography.fontWeight.bold,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.base,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    minWidth: 200,
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  formSection: {
    marginTop: Spacing.lg,
  },
  label: {
    fontSize: Typography.fontSize.base,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  // Emoji Selection
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  emojiOption: {
    width: 60,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emojiSelected: {
    borderColor: '#6C63FF',
  },
  emojiText: {
    fontSize: 32,
  },
  // Input Fields
  input: {
    fontSize: Typography.fontSize.base,
    padding: Spacing.md,
    borderRadius: 12,
    fontWeight: '500',
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  currencySymbol: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '700',
  },
  amountInput: {
    flex: 1,
    fontSize: Typography.fontSize.xl,
    padding: Spacing.md,
    borderRadius: 12,
    fontWeight: '700',
  },
  // Color Selection
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
  },
  colorOption: {
    alignItems: 'center',
    width: 80,
  },
  colorSelected: {
    opacity: 1,
  },
  colorCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  colorName: {
    fontSize: Typography.fontSize.xs,
    textAlign: 'center',
  },
  // Preview
  previewCard: {
    padding: 0,
  },
  previewHeader: {
    flexDirection: 'row',
    padding: Spacing.md,
  },
  previewIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  previewEmoji: {
    fontSize: 32,
  },
  previewTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: 4,
  },
  previewAmount: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
  },
  // Modal Actions
  modalActions: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.md,
    borderRadius: 12,
  },
  actionButtonText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  // Contribute Modal
  selectedGoalCard: {
    padding: 0,
  },
  selectedGoalContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  selectedGoalIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  selectedGoalEmoji: {
    fontSize: 32,
  },
  selectedGoalTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '600',
    marginBottom: 4,
  },
  selectedGoalAmount: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  quickAmountButton: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
  },
});
