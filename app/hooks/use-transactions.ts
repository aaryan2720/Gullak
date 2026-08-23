import { useCallback, useEffect, useState } from 'react';
import { apiService } from '@/app/services/api';

export interface Transaction {
  _id: string;
  type: 'debit' | 'credit' | 'investment' | 'withdrawal';
  category: 'round_up' | 'manual' | 'auto_invest' | 'goal_contribution';
  amount: number;
  currency: string;
  source: { type: string; transactionId?: string };
  destination: { type: string; goalId?: { _id: string; title: string; emoji: string } };
  status: 'pending' | 'processing' | 'completed' | 'failed';
  blockchainReceipt?: { txHash: string; blockNumber: number; verified: boolean };
  metadata?: { description?: string; merchantName?: string; notes?: string };
  createdAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

interface UseTransactionsOptions {
  type?: string;
  category?: string;
  status?: string;
  autoLoad?: boolean;
}

export function useTransactions(options: UseTransactionsOptions = {}) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 20, total: 0, pages: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(async (page: number, reset = false) => {
    if (page === 1) {
      reset ? setIsRefreshing(true) : setIsLoading(true);
    } else {
      setIsLoadingMore(true);
    }
    setError(null);

    try {
      const data = await apiService.getTransactions({
        page,
        limit: 20,
        type: options.type,
        category: options.category,
        status: options.status,
      });

      const txList: Transaction[] = data.transactions || [];
      const pg: Pagination = data.pagination || { page, limit: 20, total: 0, pages: 1 };

      if (page === 1 || reset) {
        setTransactions(txList);
      } else {
        setTransactions(prev => [...prev, ...txList]);
      }
      setPagination(pg);
    } catch (e: any) {
      setError(e?.message || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
      setIsRefreshing(false);
    }
  }, [options.type, options.category, options.status]);

  useEffect(() => {
    if (options.autoLoad !== false) {
      fetchPage(1);
    }
  }, [options.type, options.category, options.status]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchPage(1, true);
  }, [fetchPage]);

  const loadMore = useCallback(() => {
    if (isLoadingMore || pagination.page >= pagination.pages) return;
    fetchPage(pagination.page + 1);
  }, [isLoadingMore, pagination, fetchPage]);

  const hasMore = pagination.page < pagination.pages;

  return {
    transactions,
    pagination,
    isLoading,
    isLoadingMore,
    isRefreshing,
    error,
    refresh,
    loadMore,
    hasMore,
  };
}
