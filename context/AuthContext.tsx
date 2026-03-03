'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Scenario } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (name: string) => void;
  logout: () => void;
  completeScenario: (score: number, scenarioId: string) => void;
  activeScenario: Scenario | null;
  setActiveScenario: (scenario: Scenario | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_STORAGE_KEY = 'conflictcoach_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [activeScenario, setActiveScenario] = useState<Scenario | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse user from localStorage:', error);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save user to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && user) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    }
  }, [user, isLoaded]);

  const login = (name: string) => {
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      completedScenarios: [],
      totalScore: 0,
    };
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setActiveScenario(null);
  };

  const completeScenario = (score: number, scenarioId: string) => {
    if (!user) return;

    const updatedUser: User = {
      ...user,
      completedScenarios: user.completedScenarios.includes(scenarioId)
        ? user.completedScenarios
        : [...user.completedScenarios, scenarioId],
      totalScore: user.totalScore + score,
    };

    setUser(updatedUser);
  };

  if (!isLoaded) {
    return null; // Or a loading spinner
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        completeScenario,
        activeScenario,
        setActiveScenario,
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
