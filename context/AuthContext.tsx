import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { currentUser } from '@/mock/data';
import type { MockUser } from '@/models';

interface AuthContextValue {
  user: MockUser | null;
  isLoading: boolean;
  signIn: (username: string, password: string, remember: boolean) => Promise<boolean>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const SESSION_KEY = 'eagle-flame-admin-session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(SESSION_KEY)
      .then((stored) => {
        if (stored === 'active') setUser(currentUser);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isLoading,
    signIn: async (username, password, remember) => {
      const valid = (username.trim().toLowerCase() === 'admin' || username.trim().toLowerCase() === 'admin@eagleflame.co.zm') && password === 'admin123';
      if (!valid) return false;
      setUser(currentUser);
      if (remember) await AsyncStorage.setItem(SESSION_KEY, 'active');
      return true;
    },
    signOut: async () => {
      setUser(null);
      await AsyncStorage.removeItem(SESSION_KEY);
    },
  }), [isLoading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}