
"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/types';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, CheckCircle, Package } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, getCartTotal, getCartItemCount } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity < 0) return; // Prevent negative quantities directly
    updateQuantity(productId, newQuantity);
  };

  const handleCheckout = () => {
    // Simulate checkout process
    toast({
      title: "Checkout Initiated (Mock)",
      description: "This is a prototype. No actual order will be placed.",
    });
    // clearCart(); // Optionally clear cart on mock checkout
  };

  const cartTotal = getCartTotal();
  const itemCount = getCartItemCount();
  const shippingCost = itemCount > 0 ? 5.00 : 0; // Mock shipping
  const taxRate = 0.08; // Mock tax rate 8%
  const taxAmount = cartTotal * taxRate;
  const grandTotal = cartTotal + shippingCost + taxAmount;

  if (itemCount === 0) {
    return (
      <div className="py-12 text-center space-y-6">
        <ShoppingCart size={64} className="mx-auto text-muted-foreground" />
        <h1 className="text-3xl font-headline font-bold text-primary">Your Cart is Empty</h1>
        <p className="text-lg text-foreground/80">Looks like you haven't added anything to your cart yet.</p>
        <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Link href="/products">
            <Package className="mr-2" /> Start Shopping
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="py-8 space-y-8">
      <h1 className="text-4xl font-headline font-bold text-primary flex items-center">
        <ShoppingCart size={36} className="mr-4 text-accent" /> Your Shopping Cart ({itemCount} item{itemCount === 1 ? '' : 's'})
      </h1>

      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <Card key={item.id} className="shadow-md overflow-hidden">
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-md overflow-hidden shrink-0 border">
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} data-ai-hint="product in cart" />
                </div>
                <div className="flex-grow space-y-1">
                  <Link href={`/products/${item.id}`} className="text-lg font-semibold text-primary hover:underline">
                    {item.name}
                  </Link>
                  {item.artisanName && (
                    <p className="text-xs text-muted-foreground">
                      By <Link href={`/artisans/${item.artisanId}`} className="hover:underline text-accent">{item.artisanName}</Link>
                    </p>
                  )}
                  <p className="text-sm text-foreground">Unit Price: ${item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={16} />
                      <span className="sr-only">Decrease quantity</span>
                    </Button>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value, 10))}
                      onBlur={(e) => { // Handle blur in case user types 0 or invalid
                        const val = parseInt(e.target.value, 10);
                        if (isNaN(val) || val <= 0) handleQuantityChange(item.id, 1);
                        else if (item.stock && val > item.stock) handleQuantityChange(item.id, item.stock);
                      }}
                      className="h-8 w-14 text-center px-1"
                      min="1"
                      max={item.stock || 99} // Max 99 if no stock info
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      disabled={item.stock !== undefined && item.quantity >= item.stock}
                    >
                      <Plus size={16} />
                      <span className="sr-only">Increase quantity</span>
                    </Button>
                  </div>
                   {item.stock !== undefined && item.quantity >= item.stock && (
                    <p className="text-xs text-destructive mt-1">Max stock reached</p>
                  )}
                </div>
                <div className="text-right space-y-2 sm:ml-auto mt-3 sm:mt-0">
                  <p className="text-lg font-semibold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 text-xs"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 size={14} className="mr-1" /> Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-20"> {/* Sticky for summary on scroll */}
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({itemCount} items):</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Shipping:</span>
                <span className="font-medium">${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Estimated Tax (8%):</span>
                <span className="font-medium">${taxAmount.toFixed(2)}</span>
              </div>
              <Separator className="my-3" />
              <div className="flex justify-between text-lg font-bold text-primary">
                <span>Estimated Total:</span>
                <span>${grandTotal.toFixed(2)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3 pt-4">
              <Button 
                size="lg" 
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleCheckout}
              >
                <CheckCircle size={20} className="mr-2" /> Proceed to Checkout
              </Button>
              <Button variant="link" className="text-sm text-destructive p-0 h-auto" onClick={clearCart}>
                Clear Cart
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}

