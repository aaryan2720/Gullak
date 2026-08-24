import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors, BorderRadius, Spacing } from '@/constants/theme';
import { FontFamily } from '@/constants/fonts';
import { apiService } from '@/services/api';
import TransactionCard from '@/components/ui/transaction-card';
import { TransactionSkeleton, ListSkeleton } from '@/components/ui/skeleton-loader';

const FILTER_TYPES = [
  { id: 'all', label: 'All' },
  { id: 'investment', label: 'Investments' },
  { id: 'round_up', label: 'Round-Ups' },
  { id: 'goal_contribution', label: 'Goals' },
];

export default function TransactionsScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const colors = Colors[colorScheme ?? 'dark'];
  const router = useRouter();

  const [transactions, setTransactions] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchTransactions = useCallback(async (pageNum = 1, filter = 'all', reset = false) => {
    if (pageNum === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    const params: any = { page: pageNum, limit: 20 };
    if (filter === 'round_up') { params.category = 'round_up'; }
    else if (filter === 'goal_contribution') { params.category = 'goal_contribution'; }
    else if (filter !== 'all') { params.type = filter; }

    try {
      const data = await apiService.getTransactions(params);
      const txs = data.transactions || [];
      if (reset || pageNum === 1) {
        setTransactions(txs);
      } else {
        setTransactions(prev => [...prev, ...txs]);
      }
      setHasMore(pageNum < (data.pagination?.pages || 1));
    } catch (e) {
      setTransactions([]);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    fetchTransactions(1, activeFilter, true);
  }, [activeFilter]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    setPage(1);
    await fetchTransactions(1, activeFilter, true);
    setRefreshing(false);
  }, [activeFilter]);

  const loadMore = useCallback(() => {
    if (!hasMore || isLoadingMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTransactions(nextPage, activeFilter);
  }, [hasMore, isLoadingMore, page, activeFilter]);

  const filtered = search.trim()
    ? transactions.filter(tx =>
        tx.metadata?.merchantName?.toLowerCase().includes(search.toLowerCase()) ||
        tx.metadata?.description?.toLowerCase().includes(search.toLowerCase()) ||
        tx.destination?.goalId?.title?.toLowerCase().includes(search.toLowerCase())
      )
    : transactions;

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="light-content" backgroundColor={isDark ? colors.background : '#0A0E27'} />

      {/* Header */}
      <LinearGradient
        colors={isDark ? ['#0D1128', '#111627'] : ['#0A0E27', '#111627']}
        style={styles.header}
      >
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
        <View style={{ width: 40 }} />
      </LinearGradient>

      {/* Search */}
      <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Ionicons name="search" size={18} color={colors.textTertiary} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search transactions..."
          placeholderTextColor={colors.textTertiary}
          style={[styles.searchInput, { color: colors.text }]}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={18} color={colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTER_TYPES.map(f => (
          <TouchableOpacity
            key={f.id}
            style={[
              styles.filterChip,
              activeFilter === f.id
                ? { backgroundColor: colors.primary }
                : { backgroundColor: colors.surfaceVariant, borderColor: colors.border, borderWidth: 1 },
            ]}
            onPress={() => setActiveFilter(f.id)}
          >
            <Text style={[styles.filterText, { color: activeFilter === f.id ? '#FFF' : colors.textSecondary }]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      {isLoading ? (
        <ListSkeleton count={8} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <TransactionCard
              id={item._id}
              type={item.type}
              category={item.category}
              amount={item.amount}
              description={item.metadata?.description}
              merchantName={item.metadata?.merchantName}
              goalTitle={item.destination?.goalId?.title}
              status={item.status}
              blockchainVerified={item.blockchainReceipt?.verified}
              txHash={item.blockchainReceipt?.txHash}
              createdAt={item.createdAt}
            />
          )}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}
          ListFooterComponent={isLoadingMore ? <ListSkeleton count={2} /> : null}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={{ fontSize: 48 }}>📭</Text>
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>No transactions found</Text>
            </View>
          }
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 56 : 44,
    paddingBottom: 16,
    paddingHorizontal: Spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    color: '#FFFFFF',
    fontFamily: FontFamily.heading,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    margin: Spacing.md,
    borderRadius: BorderRadius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: FontFamily.body,
    padding: 0,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: Spacing.md,
    paddingBottom: 12,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
  },
  filterText: {
    fontSize: 13,
    fontFamily: FontFamily.bodyMedium,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: FontFamily.bodySemi,
  },
});
