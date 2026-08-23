import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Animated,
  Dimensions,
  Modal,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { FontFamily } from '@/constants/fonts';
import { useAuth } from '@/app/context/auth-context';
import { apiService } from '@/app/services/api';
import GlowCard from '@/components/ui/glow-card';
import GoalRing, { GoalRingLabel } from '@/components/ui/goal-ring';
import { GoalCardSkeleton, ListSkeleton } from '@/components/ui/skeleton-loader';

const { width } = Dimensions.get('window');

const GOAL_CATEGORIES = [
  { id: 'gadgets', label: 'Gadgets', emoji: '📱', color: '#7B61FF' },
  { id: 'travel', label: 'Travel', emoji: '✈️', color: '#FF6B9D' },
  { id: 'education', label: 'Education', emoji: '📚', color: '#00D4AA' },
  { id: 'emergency', label: 'Emergency', emoji: '🛡️', color: '#FF4D6D' },
  { id: 'vehicle', label: 'Vehicle', emoji: '🚗', color: '#4D9FFF' },
  { id: 'home', label: 'Home', emoji: '🏠', color: '#FFD166' },
  { id: 'custom', label: 'Custom', emoji: '🎯', color: '#9B85FF' },
];

interface Goal {
  id: string;
  title: string;
  emoji: string;
  color: string;
  current: number;
  target: number;
  category: string;
  targetDate?: string;
  status?: string;
}

export default function GoalsScreen() {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? 'dark'];
  const { user } = useAuth();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showContribute, setShowContribute] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Create form state
  const [formTitle, setFormTitle] = useState('');
  const [formAmount, setFormAmount] = useState('');
  const [formDate, setFormDate] = useState('');
  const [formCategory, setFormCategory] = useState(GOAL_CATEGORIES[0]);
  const [formSaving, setFormSaving] = useState(false);

  // Contribute form state
  const [contribAmount, setContribAmount] = useState('');
  const [contribSaving, setContribSaving] = useState(false);

  const loadGoals = useCallback(async () => {
    try {
      const data = await apiService.getGoals();
      setGoals(data || []);
    } catch (e) {
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { loadGoals(); }, [loadGoals]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadGoals();
    setRefreshing(false);
  }, [loadGoals]);

  const createGoal = async () => {
    if (!formTitle || !formAmount || !formDate) return;
    setFormSaving(true);
    try {
      await apiService.createGoal({
        title: formTitle,
        targetAmount: parseFloat(formAmount),
        targetDate: formDate,
        category: formCategory.id,
        emoji: formCategory.emoji,
        color: formCategory.color,
      });
      setShowCreate(false);
      setFormTitle(''); setFormAmount(''); setFormDate('');
      await loadGoals();
    } catch (e) {
      console.error('Failed to create goal:', e);
    } finally {
      setFormSaving(false);
    }
  };

  const contributeToGoal = async () => {
    if (!selectedGoal || !contribAmount) return;
    setContribSaving(true);
    try {
      await apiService.contributeGoal(selectedGoal.id, parseFloat(contribAmount));
      setShowContribute(false);
      setContribAmount('');
      setSelectedGoal(null);
      await loadGoals();
    } catch (e) {
      console.error('Failed to contribute:', e);
    } finally {
      setContribSaving(false);
    }
  };

  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.current, 0);
  const overallProgress = totalTarget > 0 ? totalSaved / totalTarget : 0;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        {/* Header */}
        <LinearGradient
          colors={['#0D1128', '#1A1040', '#0D1128']}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <Text style={styles.headerTitle}>My Goals</Text>
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: colors.primary }]}
              onPress={() => setShowCreate(true)}
            >
              <Ionicons name="add" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Summary ring */}
          {goals.length > 0 && (
            <View style={styles.summaryCard}>
              <GoalRing progress={overallProgress} size={88} strokeWidth={7} color="#9B85FF">
                <GoalRingLabel percentage={overallProgress * 100} color="#9B85FF" size={88} />
              </GoalRing>
              <View style={styles.summaryText}>
                <Text style={styles.summaryLabel}>Total Goals Progress</Text>
                <Text style={styles.summaryValue}>
                  ₹{totalSaved.toLocaleString('en-IN')} <Text style={styles.summaryOf}>of ₹{totalTarget.toLocaleString('en-IN')}</Text>
                </Text>
                <Text style={styles.summaryCount}>{goals.length} active goals</Text>
              </View>
            </View>
          )}
        </LinearGradient>

        {/* Goals list */}
        <View style={styles.listSection}>
          {isLoading ? (
            <ListSkeleton count={3} Skeleton={GoalCardSkeleton} />
          ) : goals.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={{ fontSize: 64 }}>🎯</Text>
              <Text style={[styles.emptyTitle, { color: colors.text }]}>No goals yet</Text>
              <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
                Set a savings goal and let Gullak help you reach it!
              </Text>
              <TouchableOpacity
                style={[styles.createBtn, { backgroundColor: colors.primary }]}
                onPress={() => setShowCreate(true)}
              >
                <Ionicons name="add-circle" size={18} color="#FFF" />
                <Text style={styles.createBtnText}>Create First Goal</Text>
              </TouchableOpacity>
            </View>
          ) : (
            goals.map((goal, index) => {
              const progress = goal.target > 0 ? goal.current / goal.target : 0;
              const daysLeft = goal.targetDate
                ? Math.max(0, Math.ceil((new Date(goal.targetDate).getTime() - Date.now()) / 86400000))
                : null;

              return (
                <GlowCard
                  key={goal.id}
                  glowColor={goal.color}
                  onMount
                  style={{ marginBottom: 12 }}
                >
                  <LinearGradient
                    colors={[colors.surface, colors.surfaceVariant]}
                    style={styles.goalCard}
                  >
                    <GoalRing progress={progress} size={72} strokeWidth={6} color={goal.color} style={styles.goalRing}>
                      <Text style={{ fontSize: 24 }}>{goal.emoji}</Text>
                    </GoalRing>

                    <View style={styles.goalInfo}>
                      <Text style={[styles.goalTitle, { color: colors.text }]} numberOfLines={1}>
                        {goal.title}
                      </Text>
                      <View style={styles.goalAmounts}>
                        <Text style={[styles.goalCurrent, { color: goal.color }]}>
                          ₹{goal.current.toLocaleString('en-IN')}
                        </Text>
                        <Text style={[styles.goalOf, { color: colors.textTertiary }]}>
                          / ₹{goal.target.toLocaleString('en-IN')}
                        </Text>
                      </View>
                      {daysLeft !== null && (
                        <Text style={[styles.goalDays, { color: daysLeft < 30 ? colors.error : colors.textTertiary }]}>
                          {daysLeft === 0 ? 'Goal date today!' : `${daysLeft} days left`}
                        </Text>
                      )}
                    </View>

                    <View style={styles.goalActions}>
                      <Text style={[styles.goalPct, { color: goal.color }]}>
                        {Math.round(progress * 100)}%
                      </Text>
                      <TouchableOpacity
                        style={[styles.contributeBtn, { backgroundColor: goal.color + '20', borderColor: goal.color + '40', borderWidth: 1 }]}
                        onPress={() => { setSelectedGoal(goal); setShowContribute(true); }}
                      >
                        <Ionicons name="add" size={16} color={goal.color} />
                        <Text style={[styles.contributeBtnText, { color: goal.color }]}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </GlowCard>
              );
            })
          )}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── CREATE GOAL MODAL ── */}
      <Modal visible={showCreate} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>Create New Goal</Text>

            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Goal Name</Text>
            <TextInput
              value={formTitle}
              onChangeText={setFormTitle}
              placeholder="e.g. New iPhone, Goa Trip..."
              placeholderTextColor={colors.textTertiary}
              style={[styles.textField, { color: colors.text, backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Target Amount (₹)</Text>
            <TextInput
              value={formAmount}
              onChangeText={setFormAmount}
              placeholder="e.g. 50000"
              keyboardType="numeric"
              placeholderTextColor={colors.textTertiary}
              style={[styles.textField, { color: colors.text, backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Target Date (YYYY-MM-DD)</Text>
            <TextInput
              value={formDate}
              onChangeText={setFormDate}
              placeholder="e.g. 2026-12-31"
              placeholderTextColor={colors.textTertiary}
              style={[styles.textField, { color: colors.text, backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
            />

            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {GOAL_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setFormCategory(cat)}
                  style={[
                    styles.catChip,
                    formCategory.id === cat.id
                      ? { backgroundColor: cat.color, borderColor: cat.color }
                      : { backgroundColor: colors.surfaceVariant, borderColor: colors.border },
                  ]}
                >
                  <Text style={{ fontSize: 18 }}>{cat.emoji}</Text>
                  <Text style={[styles.catLabel, { color: formCategory.id === cat.id ? '#FFF' : colors.textSecondary }]}>
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => setShowCreate(false)}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: colors.primary, opacity: formSaving ? 0.7 : 1 }]}
                onPress={createGoal}
                disabled={formSaving}
              >
                <Text style={styles.saveBtnText}>{formSaving ? 'Creating...' : 'Create Goal'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── CONTRIBUTE MODAL ── */}
      <Modal visible={showContribute} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalSheet, { backgroundColor: colors.surface }]}>
            <View style={styles.modalHandle} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Add to {selectedGoal?.emoji} {selectedGoal?.title}
            </Text>
            <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Amount (₹)</Text>
            <TextInput
              value={contribAmount}
              onChangeText={setContribAmount}
              placeholder="Enter amount to contribute"
              keyboardType="numeric"
              placeholderTextColor={colors.textTertiary}
              style={[styles.textField, { color: colors.text, backgroundColor: colors.surfaceVariant, borderColor: colors.border }]}
              autoFocus
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={[styles.cancelBtn, { backgroundColor: colors.surfaceVariant }]}
                onPress={() => { setShowContribute(false); setContribAmount(''); }}
              >
                <Text style={[styles.cancelBtnText, { color: colors.textSecondary }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: selectedGoal?.color || colors.primary, opacity: contribSaving ? 0.7 : 1 }]}
                onPress={contributeToGoal}
                disabled={contribSaving}
              >
                <Text style={styles.saveBtnText}>{contribSaving ? 'Saving...' : 'Contribute'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 44,
    paddingBottom: 28,
    paddingHorizontal: Spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 26,
    color: '#FFFFFF',
    fontFamily: FontFamily.heading,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: BorderRadius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(155,133,255,0.2)',
  },
  summaryText: { flex: 1 },
  summaryLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: FontFamily.body,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: FontFamily.heading,
    marginBottom: 4,
  },
  summaryOf: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.5)',
    fontFamily: FontFamily.body,
  },
  summaryCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    fontFamily: FontFamily.body,
  },
  listSection: {
    padding: Spacing.md,
    marginTop: Spacing.md,
  },
  goalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: BorderRadius.lg,
    gap: 12,
  },
  goalRing: { flexShrink: 0 },
  goalInfo: { flex: 1, gap: 2 },
  goalTitle: {
    fontSize: 15,
    fontFamily: FontFamily.bodySemi,
  },
  goalAmounts: { flexDirection: 'row', alignItems: 'baseline', gap: 2 },
  goalCurrent: { fontSize: 16, fontFamily: FontFamily.heading },
  goalOf: { fontSize: 12, fontFamily: FontFamily.body },
  goalDays: { fontSize: 11, fontFamily: FontFamily.body },
  goalActions: { alignItems: 'flex-end', gap: 8 },
  goalPct: { fontSize: 18, fontFamily: FontFamily.heading },
  contributeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  contributeBtnText: { fontSize: 13, fontFamily: FontFamily.bodySemi },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: { fontSize: 22, fontFamily: FontFamily.heading },
  emptySubtitle: { fontSize: 14, fontFamily: FontFamily.body, textAlign: 'center', lineHeight: 22 },
  createBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: BorderRadius.lg,
    marginTop: 8,
  },
  createBtnText: { fontSize: 15, color: '#FFF', fontFamily: FontFamily.bodySemi },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: FontFamily.heading,
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: FontFamily.bodyMedium,
    marginBottom: 8,
  },
  textField: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: FontFamily.body,
    marginBottom: 16,
  },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    marginRight: 8,
  },
  catLabel: { fontSize: 13, fontFamily: FontFamily.bodyMedium },
  modalBtns: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  cancelBtnText: { fontSize: 15, fontFamily: FontFamily.bodySemi },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  saveBtnText: { fontSize: 15, color: '#FFF', fontFamily: FontFamily.bodySemi },
});
