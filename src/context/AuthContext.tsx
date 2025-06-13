
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
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, serverTimestamp, Timestamp } from 'firebase/firestore';
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

// No longer using AUTH_STORAGE_KEY directly for currentUser, as onAuthStateChanged is the source of truth
// However, it might be useful for persisting non-sensitive UI preferences if needed later.

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

      if (!userDocSnap.exists() && additionalData) {
        // New user registration, create Firestore document
        const newUserDocData: FirestoreUserDocument = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || additionalData.email || '',
          name: additionalData.name || firebaseUser.displayName || 'New User',
          role: additionalData.role || 'buyer',
          profileImageUrl: additionalData.profileImageUrl || firebaseUser.photoURL || 'https://placehold.co/128x128.png',
          wishlist: additionalData.wishlist || [],
          followedArtisans: additionalData.followedArtisans || [],
          createdAt: Timestamp.now().toDate().toISOString(), // Firestore serverTimestamp might be better if called from backend
          // artisanProfileId: additionalData.role === 'seller' ? (additionalData.artisanProfileId || firebaseUser.uid) : undefined,
        };
        if (additionalData.role === 'seller') {
          // For sellers, artisanProfileId could be their UID or a new unique ID
          // For simplicity now, if they register as seller, we can use their UID.
           newUserDocData.artisanProfileId = additionalData.artisanProfileId || firebaseUser.uid;
        }


        await setDoc(userDocRef, newUserDocData);
        userDocSnap = await getDoc(userDocRef); // Re-fetch to get the created doc
      } else if (userDocSnap.exists() && additionalData && Object.keys(additionalData).length > 0) {
        // Existing user, but additional data needs to be merged (e.g. display name update after social sign in)
        // This case might be rare with email/password but good for social auth later
        await updateDoc(userDocRef, additionalData);
        userDocSnap = await getDoc(userDocRef); // Re-fetch
      }

      if (userDocSnap.exists()) {
        const firestoreData = userDocSnap.data() as FirestoreUserDocument;
        const authenticatedUser: AuthenticatedUser = {
          id: firebaseUser.uid, // Use Firebase UID as the primary ID
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
        // This case should be rare if registration creates the doc. Could be an error or social sign-in without profile yet.
        console.warn(`Firestore document not found for user ${firebaseUser.uid} after attempt to ensure it exists.`);
        setCurrentUser(null); // Or a minimal user object from FirebaseUser if preferred
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
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [updateAuthStateAndFirestore]);


  const login = useCallback(async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      // onAuthStateChanged will handle setting currentUser and fetching Firestore data
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
      // onAuthStateChanged will set currentUser to null
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
      // Pass additionalData to create Firestore profile through onAuthStateChanged logic
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
      // Pass additionalData to create Firestore profile
      await updateAuthStateAndFirestore(userCredential.user, {
        name: userData.name,
        email: userData.email,
        role: 'seller',
        artisanProfileId: userCredential.user.uid, // Simple: use UID as artisan ID initially
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
        // For simplicity, directly assign UID as artisanProfileId upon upgrade if not already seller.
        // A more robust flow might involve creating a separate artisanProfiles entry and linking it.
        const artisanProfileId = currentUser.id;
        await updateDoc(userDocRef, { role: 'seller', artisanProfileId: artisanProfileId });

        // Optimistically update or re-fetch
        const updatedUser = { ...currentUser, role: 'seller' as 'seller', artisanProfileId: artisanProfileId };
        setCurrentUser(updatedUser); // Optimistic update

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
