'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as api from '../lib/api';

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email?: string | null;
  phoneNumber?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (data: api.RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Kiểm tra token và user từ localStorage khi component mount
    const token = api.getAccessToken();
    const savedUser = api.getUser();
    
    if (token && savedUser) {
      setUser(savedUser);
    }
    
    setLoading(false);
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const response = await api.login({ username, password });
      api.setTokens(response.access, response.refresh);
      api.setUser(response.user);
      setUser(response.user);
      router.push('/');
    } catch (error: any) {
      throw error;
    }
  };

  const register = async (data: api.RegisterData) => {
    try {
      const response = await api.register(data);
      api.setTokens(response.access, response.refresh);
      api.setUser(response.user);
      setUser(response.user);
      router.push('/');
    } catch (error: any) {
      throw error;
    }
  };

  const logout = () => {
    api.removeTokens();
    api.removeUser();
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
