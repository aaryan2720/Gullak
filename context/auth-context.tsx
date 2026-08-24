import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { safeStorage } from '../app/services/storage';
import { apiService } from '../app/services/api';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  kycStatus: 'pending' | 'submitted' | 'verified' | 'rejected';
  riskProfile: 'conservative' | 'moderate' | 'aggressive';
  referralCode?: string;
  level: number;
  xp: number;
  streak: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, phone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = '@gullak_auth_token';
const USER_KEY = '@gullak_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load persisted session on app start
  useEffect(() => {
    loadPersistedSession();
  }, []);

  const loadPersistedSession = async () => {
    try {
      const [savedToken, savedUser] = await Promise.all([
        safeStorage.getItem(TOKEN_KEY),
        safeStorage.getItem(USER_KEY),
      ]);
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        apiService.setToken(savedToken);
      }
    } catch (e) {
      console.error('Failed to load persisted session:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (identifier: string, password: string) => {
    const res = await apiService.login(identifier, password);
    if (res.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      await Promise.all([
        safeStorage.setItem(TOKEN_KEY, newToken),
        safeStorage.setItem(USER_KEY, JSON.stringify(newUser)),
      ]);
      return { success: true };
    }
    return { success: false, error: res.error?.message || 'Login failed' };
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    const res = await apiService.register(name, email, phone, password);
    if (res.success) {
      const { token: newToken, user: newUser } = res.data;
      setToken(newToken);
      setUser(newUser);
      await Promise.all([
        safeStorage.setItem(TOKEN_KEY, newToken),
        safeStorage.setItem(USER_KEY, JSON.stringify(newUser)),
      ]);
      return { success: true };
    }
    return { success: false, error: res.error?.message || 'Registration failed' };
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    apiService.setToken(null);
    await Promise.all([
      safeStorage.removeItem(TOKEN_KEY),
      safeStorage.removeItem(USER_KEY),
    ]);
  };

  const refreshUser = async () => {
    const res = await apiService.getMe();
    if (res.success) {
      setUser(res.data);
      await safeStorage.setItem(USER_KEY, JSON.stringify(res.data));
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isLoading,
      isAuthenticated: !!token && !!user,
      login,
      register,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
export default AuthContext;
