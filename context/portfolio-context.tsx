import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from './auth-context';

interface Holding {
  name: string;
  type: 'index_fund' | 'gold' | 'bond';
  value: number;
  units: number;
  returns: number;
  returnsPercent: number;
  allocation: number;
}

interface PortfolioSummary {
  totalInvested: number;
  currentValue: number;
  totalReturns: number;
  returnPercentage: number;
  dayChange: number;
  dayChangePercent: number;
}

interface AssetAllocation {
  equity: number;
  gold: number;
  bonds: number;
  other: number;
}

interface Portfolio {
  summary: PortfolioSummary;
  holdings: Holding[];
  assetAllocation: AssetAllocation;
  lastUpdated: Date | null;
}

interface PortfolioContextType {
  portfolio: Portfolio | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  addInvestment: (amount: number, allocation: any) => void;
}

const defaultPortfolio: Portfolio = {
  summary: {
    totalInvested: 0,
    currentValue: 0,
    totalReturns: 0,
    returnPercentage: 0,
    dayChange: 0,
    dayChangePercent: 0,
  },
  holdings: [],
  assetAllocation: { equity: 0, gold: 0, bonds: 0, other: 0 },
  lastUpdated: null,
};

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export function PortfolioProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await apiService.getPortfolio();
      if (data) {
        setPortfolio({ ...data, lastUpdated: new Date() });
      } else {
        setPortfolio(defaultPortfolio);
      }
    } catch (e: any) {
      setError(e?.message || 'Failed to load portfolio');
      setPortfolio(defaultPortfolio);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      refresh();
      // Auto-refresh every 60 seconds
      const interval = setInterval(refresh, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, refresh]);

  const addInvestment = (amount: number, allocation: any) => {
    if (!portfolio) return;
    setPortfolio(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        summary: {
          ...prev.summary,
          totalInvested: prev.summary.totalInvested + amount,
          currentValue: prev.summary.currentValue + amount,
        },
        lastUpdated: new Date(),
      };
    });
  };

  return (
    <PortfolioContext.Provider value={{ portfolio, isLoading, error, refresh, addInvestment }}>
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used inside PortfolioProvider');
  return ctx;
}

export default PortfolioContext;
