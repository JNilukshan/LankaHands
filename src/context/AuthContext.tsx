
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthenticatedUser } from '@/types';
import { mockCustomerChandana, mockArtisanNimali } from '@/lib/mock-data.ts';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  currentUser: AuthenticatedUser | null;
  login: (email: string, pass: string) => Promise<boolean>; // pass is unused for mock
  logout: () => void;
  registerAsBuyer: (userData: Pick<AuthenticatedUser, 'name' | 'email'>) => Promise<boolean>;
  upgradeToSeller: () => Promise<boolean>;
  registerAsSeller: (userData: Pick<AuthenticatedUser, 'name' | 'email'>) => Promise<boolean>;
  isLoading: boolean;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isProductInWishlist: (productId: string) => boolean;
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
        const parsedUser: AuthenticatedUser = JSON.parse(storedUser);
        // Ensure wishlist and followedArtisans are always arrays
        parsedUser.wishlist = parsedUser.wishlist || [];
        parsedUser.followedArtisans = parsedUser.followedArtisans || [];
        setCurrentUser(parsedUser);
      }
    } catch (error) {
      console.error("Failed to load auth state from localStorage", error);
    }
    setIsLoading(false);
  }, []);

  const updateAuthState = useCallback((user: AuthenticatedUser | null) => {
    if (user) {
      // Ensure wishlist and followedArtisans are arrays before saving
      const userToSave = {
        ...user,
        wishlist: user.wishlist || [],
        followedArtisans: user.followedArtisans || [],
      };
      setCurrentUser(userToSave);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userToSave));
    } else {
      setCurrentUser(null);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  const login = useCallback(async (email: string, _pass: string): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500)); 
    if (email.toLowerCase() === mockCustomerChandana.email.toLowerCase()) {
      const buyerUser: AuthenticatedUser = {
        id: mockCustomerChandana.id,
        name: mockCustomerChandana.name,
        email: mockCustomerChandana.email,
        role: 'buyer',
        profileImageUrl: mockCustomerChandana.profileImageUrl,
        followedArtisans: mockCustomerChandana.followedArtisans || [],
        wishlist: mockCustomerChandana.wishlist || [], // Initialize wishlist
      };
      updateAuthState(buyerUser);
      setIsLoading(false);
      return true;
    } else if (email.toLowerCase() === (mockArtisanNimali.email || '').toLowerCase()) { 
      const sellerUser: AuthenticatedUser = {
        id: mockArtisanNimali.id,
        name: mockArtisanNimali.name,
        email: mockArtisanNimali.email || 'nimali.seller@example.com', 
        role: 'seller',
        profileImageUrl: mockArtisanNimali.profileImageUrl,
        wishlist: [], // Sellers might not have a buyer-wishlist in this model
        followedArtisans: [], // Sellers might not follow other artisans
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
      id: `buyer-${Date.now()}`, 
      name: userData.name,
      email: userData.email,
      role: 'buyer',
      profileImageUrl: 'https://placehold.co/128x128.png', 
      followedArtisans: [],
      wishlist: [], // New buyers start with an empty wishlist
    };
    updateAuthState(newBuyer);
    setIsLoading(false);
    return true;
  }, [updateAuthState]);
  
  const registerAsSeller = useCallback(async (userData: Pick<AuthenticatedUser, 'name' | 'email'>): Promise<boolean> => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const sellerUser: AuthenticatedUser = {
        id: mockArtisanNimali.id, // This should ideally be a new ID
        name: userData.name || mockArtisanNimali.name, 
        email: userData.email, 
        role: 'seller',
        profileImageUrl: mockArtisanNimali.profileImageUrl,
        wishlist: [],
        followedArtisans: [],
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
      updateAuthState(updatedUser);
      setIsLoading(false);
      return true;
    }
    return false;
  }, [currentUser, updateAuthState]);

  const addToWishlist = useCallback((productId: string) => {
    if (currentUser && currentUser.role === 'buyer') {
      const newWishlist = [...(currentUser.wishlist || []), productId];
      updateAuthState({ ...currentUser, wishlist: newWishlist });
    }
  }, [currentUser, updateAuthState]);

  const removeFromWishlist = useCallback((productId: string) => {
    if (currentUser && currentUser.role === 'buyer') {
      const newWishlist = (currentUser.wishlist || []).filter(id => id !== productId);
      updateAuthState({ ...currentUser, wishlist: newWishlist });
    }
  }, [currentUser, updateAuthState]);

  const isProductInWishlist = useCallback((productId: string): boolean => {
    return !!(currentUser && currentUser.role === 'buyer' && currentUser.wishlist?.includes(productId));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ 
        currentUser, 
        login, 
        logout, 
        registerAsBuyer, 
        upgradeToSeller, 
        registerAsSeller, 
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isProductInWishlist
    }}>
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
