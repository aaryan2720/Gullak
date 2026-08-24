import { useState, useEffect, useCallback } from 'react';
import { apiService } from '@/services/api';

interface Transaction {
  _id: string;
  type: 'debit' | 'credit' | 'investment' | 'withdrawal';
  category: 'round_up' | 'manual' | 'auto_invest' | 'goal_contribution';
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'reversed';
  createdAt: string;
  metadata?: {
    merchantName?: string;
    description?: string;
    notes?: string;
  };
  destination?: {
    goalId?: {
      _id: string;
      title: string;
      emoji: string;
      color: string;
    };
  };
  blockchainReceipt?: {
    txHash?: string;
    blockNumber?: number;
    verified?: boolean;
  };
}

interface UseTransactionsProps {
  type?: string;
  category?: string;
  status?: string;
  limit?: number;
}

export function useTransactions(props: UseTransactionsProps = {}) {
  const { type, category, status, limit = 20 } = props;
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(
    async (pageNum: number, clearPrevious = false) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await apiService.getTransactions({
          page: pageNum,
          limit,
          type,
          category,
          status,
        });

        const newTxs = data.transactions || [];
        setTransactions((prev) => {
          if (clearPrevious || pageNum === 1) return newTxs;
          return [...prev, ...newTxs];
        });
        setHasMore(pageNum < (data.pagination?.pages || 1));
      } catch (err: any) {
        setError(err.message || 'Failed to fetch transactions');
      } finally {
        setIsLoading(false);
      }
    },
    [type, category, status, limit]
  );

  useEffect(() => {
    setPage(1);
    fetchTransactions(1, true);
  }, [type, category, status]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    setPage(1);
    await fetchTransactions(1, true);
    setIsRefreshing(false);
  }, [fetchTransactions]);

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchTransactions(nextPage, false);
  }, [page, hasMore, isLoading, fetchTransactions]);

  return {
    transactions,
    isLoading,
    isRefreshing,
    hasMore,
    error,
    refresh,
    loadMore,
  };
}

export default useTransactions;
