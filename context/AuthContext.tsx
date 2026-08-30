'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  points: number;
  orders: any[]; // Mock orders array
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('elara_current_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    // In a real app, this would be an API call.
    // Here we check against our mock "database" in localStorage.
    const usersStr = localStorage.getItem('elara_users_db');
    const users = usersStr ? JSON.parse(usersStr) : [];

    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('elara_current_user', JSON.stringify(userWithoutPassword));
      return { success: true };
    }

    return { success: false, message: 'Invalid email or password' };
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    const usersStr = localStorage.getItem('elara_users_db');
    const users = usersStr ? JSON.parse(usersStr) : [];

    // Check if user exists
    if (users.find((u: any) => u.email === email)) {
      return { success: false, message: 'User already exists with this email' };
    }

    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password, // Mock db stores password in plain text, do NOT do this in real app!
      points: 0,
      orders: [
        // Let's give them a mock order for demonstration
        {
          id: 'ORD-' + Math.floor(Math.random() * 1000000),
          date: new Date().toISOString().split('T')[0],
          status: 'Processing',
          total: 450.00,
          items: [{ name: 'Silver Classic Ring', quantity: 1, price: 450.00 }]
        }
      ]
    };

    users.push(newUser);
    localStorage.setItem('elara_users_db', JSON.stringify(users));

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('elara_current_user');
    router.push('/');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('elara_current_user', JSON.stringify(updatedUser));
    
    // Also update in DB array
    const usersStr = localStorage.getItem('elara_users_db');
    if (usersStr) {
      const users = JSON.parse(usersStr);
      const index = users.findIndex((u: any) => u.id === updatedUser.id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updatedUser };
        localStorage.setItem('elara_users_db', JSON.stringify(users));
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
