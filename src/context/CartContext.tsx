
"use client";

import type { Product, CartItem } from '@/types';
import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemCount: () => number;
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'lankaHandsCart';

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false); // For potential cart drawer/modal
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage", error);
      // Optionally clear corrupted storage
      // localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const saveCartToLocalStorage = useCallback((items: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart to localStorage", error);
      setTimeout(() => {
        toast({
          title: "Storage Error",
          description: "Could not save your cart. Please try again.",
          variant: "destructive",
        });
      }, 0);
    }
  }, [toast]);

  const addToCart = useCallback((product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      let newItems;
      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        // Check against stock if available
        if (product.stock !== undefined && newQuantity > product.stock) {
          setTimeout(() => {
            toast({
              title: "Stock Limit Reached",
              description: `Cannot add more than ${product.stock} units of ${product.name}.`,
              variant: "destructive",
            });
          }, 0);
          return prevItems; // Return previous items without change
        }
        newItems = prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      } else {
        // Check stock for new item
        if (product.stock !== undefined && quantity > product.stock) {
           setTimeout(() => {
            toast({
              title: "Not Enough Stock",
              description: `Only ${product.stock} units of ${product.name} available.`,
              variant: "destructive",
            });
          }, 0);
          return prevItems; // Return previous items without change
        }
        newItems = [
          ...prevItems,
          {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.images[0], // Assuming first image is main
            quantity,
            artisanId: product.artisanId,
            artisanName: product.artisan?.name,
            stock: product.stock,
          },
        ];
      }
      saveCartToLocalStorage(newItems);
      setTimeout(() => {
        toast({
          title: "Item Added to Cart",
          description: `${product.name} (x${quantity}) has been added to your cart.`,
        });
      }, 0);
      return newItems;
    });
  }, [saveCartToLocalStorage, toast]);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => {
      const itemToRemove = prevItems.find(item => item.id === productId);
      const newItems = prevItems.filter(item => item.id !== productId);
      saveCartToLocalStorage(newItems);
      if (itemToRemove) {
        setTimeout(() => {
          toast({
            title: "Item Removed",
            description: `${itemToRemove.name} has been removed from your cart.`,
          });
        }, 0);
      }
      return newItems;
    });
  }, [saveCartToLocalStorage, toast]);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        const itemToRemove = prevItems.find(item => item.id === productId);
        const newItems = prevItems.filter(item => item.id !== productId);
        saveCartToLocalStorage(newItems);
         if (itemToRemove) {
           setTimeout(() => {
            toast({
              title: "Item Removed",
              description: `${itemToRemove.name} has been removed as quantity is zero.`,
            });
          }, 0);
         }
        return newItems;
      }
      const newItems = prevItems.map(item => {
        if (item.id === productId) {
          // Check against stock if available
          if (item.stock !== undefined && quantity > item.stock) {
            setTimeout(() => {
              toast({
                title: "Stock Limit Reached",
                description: `Cannot set quantity for ${item.name} beyond ${item.stock} units.`,
                variant: "destructive",
              });
            }, 0);
            return { ...item, quantity: item.stock }; // Set to max stock
          }
          return { ...item, quantity };
        }
        return item;
      });
      saveCartToLocalStorage(newItems);
      return newItems;
    });
  }, [saveCartToLocalStorage, toast]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    saveCartToLocalStorage([]);
    setTimeout(() => {
      toast({
        title: "Cart Cleared",
        description: "All items have been removed from your cart.",
      });
    }, 0);
  }, [saveCartToLocalStorage, toast]);

  const getCartTotal = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);

  const getCartItemCount = useCallback(() => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
