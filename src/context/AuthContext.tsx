
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthenticatedUser } from '@/types';
import { mockCustomerChandana, mockArtisanNimali } from '@/lib/mock-data';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: AuthenticatedUser | null;
  login: (email: string, pass: string) => Promise<boolean>; // pass is unused for mock
  logout: () => void;
  registerAsBuyer: (userData: Pick<AuthenticatedUser, 'name' | 'email'>) => Promise<boolean>;
  upgradeToSeller: () => Promise<boolean>;
  registerAsSeller: (userData: Pick<AuthenticatedUser, 'name' | 'email'>) => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'lankaHandsAuthState';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to load auth state from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const updateAuthState = useCallback((user: AuthenticatedUser | null) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (email: string, _pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    if (email.toLowerCase() === mockCustomerChandana.email.toLowerCase()) {
      const buyerUser: AuthenticatedUser = {
        id: mockCustomerChandana.id,
        name: mockCustomerChandana.name,
        email: mockCustomerChandana.email,
        role: 'buyer',
        profileImageUrl: mockCustomerChandana.profileImageUrl,
      };
      updateAuthState(buyerUser);
      setIsLoading(false);
      return true;
    } else if (email.toLowerCase() === (mockArtisanNimali.email || '').toLowerCase()) { // Assuming Nimali has an email for login
      const sellerUser: AuthenticatedUser = {
        id: mockArtisanNimali.id,
        name: mockArtisanNimali.name,
        email: mockArtisanNimali.email || 'nimali.seller@example.com', // Fallback email
        role: 'seller',
        profileImageUrl: mockArtisanNimali.profileImageUrl,
      };
      updateAuthState(sellerUser);
      setIsLoading(false);
      return true;
    }
    setIsLoading(false);
    return false;
  }, [updateAuthState]);

  const logout = useCallback(() => {
    updateAuthState(null);
    router.push('/');
  }, [updateAuthState, router]);

  const registerAsBuyer = useCallback(async (userData: Pick<AuthenticatedUser, 'name' | 'email'>): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newBuyer: AuthenticatedUser = {
      id: `buyer-${Date.now()}`, // Simple unique ID for prototype
      name: userData.name,
      email: userData.email,
      role: 'buyer',
      profileImageUrl: 'https://placehold.co/128x128.png', // Default avatar
    };
    updateAuthState(newBuyer);
    setIsLoading(false);
    return true;
  }, [updateAuthState]);
  
  const registerAsSeller = useCallback(async (userData: Pick<AuthenticatedUser, 'name' | 'email'>): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    // For prototype simplicity, registering as a seller logs them in as Nimali
    const sellerUser: AuthenticatedUser = {
        id: mockArtisanNimali.id,
        name: userData.name || mockArtisanNimali.name, // Use form name if provided
        email: userData.email, // Use form email
        role: 'seller',
        profileImageUrl: mockArtisanNimali.profileImageUrl,
    };
    updateAuthState(sellerUser);
    setIsLoading(false);
    return true;
  }, [updateAuthState]);


  const upgradeToSeller = useCallback(async (): Promise<boolean> => {
    if (currentUser && currentUser.role === 'buyer') {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      const updatedUser: AuthenticatedUser = { ...currentUser, role: 'seller' };
      // In a real app, you might assign a new seller ID or link to an existing artisan profile.
      // For this prototype, we'll keep their ID but change role.
      // Or, for simplicity, log them in as Nimali for "Become Seller" if they were Chandana
      // Let's make it upgrade the current user's role:
      updateAuthState(updatedUser);
      setIsLoading(false);
      return true;
    }
    return false;
  }, [currentUser, updateAuthState]);

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, registerAsBuyer, upgradeToSeller, registerAsSeller, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
