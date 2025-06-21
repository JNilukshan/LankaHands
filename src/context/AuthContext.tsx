
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { AuthenticatedUser, User as FirestoreUserDocument } from '@/types';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebaseClientConfig'; // Import client Firebase services
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut, // Renamed to avoid conflict
  type User as FirebaseUser, // Firebase Auth User type
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  currentUser: AuthenticatedUser | null;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
  registerAsBuyer: (userData: Pick<AuthenticatedUser, 'name' | 'email'>, pass: string) => Promise<boolean>;
  upgradeToSeller: () => Promise<boolean>;
  registerAsSeller: (userData: Pick<AuthenticatedUser, 'name' | 'email'>, pass: string) => Promise<boolean>;
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isProductInWishlist: (productId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const updateAuthStateAndFirestore = useCallback(async (
    firebaseUser: FirebaseUser | null,
    additionalData?: Partial<FirestoreUserDocument>
  ): Promise<AuthenticatedUser | null> => {
    if (firebaseUser) {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      let userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        const newUserDocData: FirestoreUserDocument = {
          uid: firebaseUser.uid,
          email: additionalData?.email || firebaseUser.email || '',
          name: additionalData?.name || firebaseUser.displayName || 'New User',
          role: additionalData?.role || 'buyer',
          profileImageUrl: additionalData?.profileImageUrl || 'https://placehold.co/128x128.png',
          wishlist: additionalData?.wishlist || [],
          followedArtisans: additionalData?.followedArtisans || [],
          createdAt: Timestamp.now().toDate().toISOString(),
        };
        if (newUserDocData.role === 'seller') {
           newUserDocData.artisanProfileId = additionalData?.artisanProfileId || firebaseUser.uid;
        }
        await setDoc(userDocRef, newUserDocData);
        userDocSnap = await getDoc(userDocRef);
        console.log(`AuthContext: Created new Firestore user document for ${firebaseUser.uid}`);
      } 
      else if (additionalData && Object.keys(additionalData).length > 0) {
        await updateDoc(userDocRef, additionalData);
        userDocSnap = await getDoc(userDocRef);
        console.log(`AuthContext: Updated Firestore user document for ${firebaseUser.uid}`);
      }

      if (userDocSnap.exists()) {
        const firestoreData = userDocSnap.data() as FirestoreUserDocument;
        const authenticatedUser: AuthenticatedUser = {
          id: firebaseUser.uid,
          email: firebaseUser.email || firestoreData.email,
          name: firestoreData.name || firebaseUser.displayName || 'User',
          role: firestoreData.role || 'buyer',
          profileImageUrl: firestoreData.profileImageUrl || firebaseUser.photoURL,
          wishlist: firestoreData.wishlist || [],
          followedArtisans: firestoreData.followedArtisans || [],
          artisanProfileId: firestoreData.artisanProfileId,
        };
        setCurrentUser(authenticatedUser);
        return authenticatedUser;
      } else {
        console.error(`AuthContext: Firestore document still not found for user ${firebaseUser.uid} after attempting to create or update it.`);
        setCurrentUser(null);
        return null;
      }
    } else {
      setCurrentUser(null);
      return null;
    }
  }, []);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setIsLoading(true);
      await updateAuthStateAndFirestore(firebaseUser);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, [updateAuthStateAndFirestore]);


  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle the rest
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Login error:", error);
      toast({ title: "Login Failed", description: error.message || "Invalid credentials.", variant: "destructive" });
      setIsLoading(false);
      return false;
    }
  }, [toast]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
      router.push('/');
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({ title: "Logout Failed", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }, [router, toast]);

  const registerAsBuyer = useCallback(async (userData: Pick<AuthenticatedUser, 'name' | 'email'>, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, pass);
      await updateAuthStateAndFirestore(userCredential.user, {
        name: userData.name,
        email: userData.email,
        role: 'buyer',
      });
      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Buyer registration error:", error);
      toast({ title: "Registration Failed", description: error.message || "Could not create account.", variant: "destructive" });
      setIsLoading(false);
      return false;
    }
  }, [updateAuthStateAndFirestore, toast]);

  const registerAsSeller = useCallback(async (userData: Pick<AuthenticatedUser, 'name' | 'email'>, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, pass);
      await updateAuthStateAndFirestore(userCredential.user, {
        name: userData.name,
        email: userData.email,
        role: 'seller',
        artisanProfileId: userCredential.user.uid,
      });

      const artisanProfileRef = doc(db, 'artisanProfiles', userCredential.user.uid);
      await setDoc(artisanProfileRef, {
        name: userData.name,
        email: userData.email,
        bio: "Welcome to my artisan store! I'm excited to share my creations with you.",
        profileImageUrl: 'https://placehold.co/300x300.png',
        bannerImageUrl: 'https://placehold.co/1200x400.png',
        followers: 0,
        averageRating: 0,
        location: 'Sri Lanka',
        speciality: 'Handicraft Artisan',
        userId: userCredential.user.uid,
        createdAt: new Date().toISOString(),
        isVerified: false,
      });

      setIsLoading(false);
      return true;
    } catch (error: any) {
      console.error("Seller registration error:", error);
      toast({ title: "Seller Registration Failed", description: error.message || "Could not create seller account.", variant: "destructive" });
      setIsLoading(false);
      return false;
    }
  }, [updateAuthStateAndFirestore, toast]);

  const upgradeToSeller = useCallback(async (): Promise<boolean> => {
    if (currentUser && currentUser.role === 'buyer') {
      setIsLoading(true);
      try {
        const userDocRef = doc(db, 'users', currentUser.id);
        const artisanProfileId = currentUser.id;
        await updateDoc(userDocRef, { role: 'seller', artisanProfileId: artisanProfileId });
        
        const artisanProfileRef = doc(db, 'artisanProfiles', currentUser.id);
        const artisanDocSnap = await getDoc(artisanProfileRef);
        if (!artisanDocSnap.exists()) {
          await setDoc(artisanProfileRef, {
            name: currentUser.name,
            email: currentUser.email,
            bio: "Welcome to my artisan store! I'm excited to share my creations with you.",
            profileImageUrl: currentUser.profileImageUrl || 'https://placehold.co/300x300.png',
            bannerImageUrl: 'https://placehold.co/1200x400.png',
            followers: 0,
            averageRating: 0,
            location: 'Sri Lanka',
            speciality: 'Handicraft Artisan',
            userId: currentUser.id,
            createdAt: new Date().toISOString(),
            isVerified: false,
          });
        }

        const updatedUser = { ...currentUser, role: 'seller' as 'seller', artisanProfileId: artisanProfileId };
        setCurrentUser(updatedUser);
        toast({ title: "Account Upgraded", description: "You are now registered as a seller!" });
        setIsLoading(false);
        return true;
      } catch (error: any) {
        console.error("Upgrade to seller error:", error);
        toast({ title: "Upgrade Failed", description: error.message, variant: "destructive" });
        setIsLoading(false);
        return false;
      }
    }
    return false;
  }, [currentUser, toast]);

  const addToWishlist = useCallback(async (productId: string) => {
    if (currentUser && currentUser.role === 'buyer') {
      setIsLoading(true);
      try {
        const userDocRef = doc(db, 'users', currentUser.id);
        await updateDoc(userDocRef, {
          wishlist: arrayUnion(productId)
        });
        setCurrentUser(prev => prev ? ({ ...prev, wishlist: [...(prev.wishlist || []), productId] }) : null);
        toast({ title: "Added to Wishlist", description: "Item added to your wishlist." });
      } catch (error: any) {
        console.error("Add to wishlist error:", error);
        toast({ title: "Error", description: "Could not add to wishlist.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    } else if (!currentUser) {
        toast({ title: "Login Required", description: "Please login to add items to wishlist.", variant: "destructive"});
        router.push('/login');
    }
  }, [currentUser, toast, router]);

  const removeFromWishlist = useCallback(async (productId: string) => {
    if (currentUser && currentUser.role === 'buyer') {
      setIsLoading(true);
      try {
        const userDocRef = doc(db, 'users', currentUser.id);
        await updateDoc(userDocRef, {
          wishlist: arrayRemove(productId)
        });
        setCurrentUser(prev => prev ? ({ ...prev, wishlist: (prev.wishlist || []).filter(id => id !== productId) }) : null);
        toast({ title: "Removed from Wishlist", description: "Item removed from your wishlist." });
      } catch (error: any) {
        console.error("Remove from wishlist error:", error);
        toast({ title: "Error", description: "Could not remove from wishlist.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    }
  }, [currentUser, toast]);

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
