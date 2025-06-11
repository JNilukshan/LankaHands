
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { User, Order, Product, OrderItem } from '@/types';
import { Edit3, History, Heart, LogOut, UserCircle2, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import ProductCard from '@/components/shared/ProductCard';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

// Placeholder data
const mockUser: User = {
  id: 'user123',
  name: 'Chandana Silva',
  email: 'chandana.silva@example.com',
  profileImageUrl: 'https://placehold.co/128x128.png',
  isSeller: false,
};

const mockOrderItems: OrderItem[] = [
    { productId: '101', productName: 'Ocean Breeze Batik Saree', quantity: 1, price: 120.00, productImage: 'https://placehold.co/80x80.png' },
    { productId: '103', productName: 'Sunset Hues Handloom Shawl', quantity: 2, price: 55.00, productImage: 'https://placehold.co/80x80.png' },
];

const mockOrders: Order[] = [
  { id: 'order1', userId: 'user123', items: mockOrderItems, totalAmount: 230.00, orderDate: '2023-05-10T10:00:00Z', status: 'Delivered', shippingAddress: '123 Galle Road, Colombo 3, Sri Lanka' },
  { id: 'order2', userId: 'user123', items: [{ productId: '102', productName: 'Hand-Carved Elephant Statue', quantity: 1, price: 75.00, productImage: 'https://placehold.co/80x80.png' }], totalAmount: 75.00, orderDate: '2023-05-20T14:30:00Z', status: 'Shipped', shippingAddress: '123 Galle Road, Colombo 3, Sri Lanka' },
];

const mockSavedProducts: Product[] = [
  { id: '104', name: 'Lotus Bloom Batik Wall Hanging', description: 'Stunning Batik wall art.', price: 90.00, category: 'Home Decor', images: ['https://placehold.co/600x400.png'], artisanId: '1' },
  { id: '106', name: 'Silver Filigree Earrings', description: 'Intricate silver filigree earrings.', price: 150.00, category: 'Jewelry', images: ['https://placehold.co/600x400.png'], artisanId: '5' },
];

export default function ProfilePage() {
  const user = mockUser; // In a real app, this would come from auth state
  const { toast } = useToast();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  const handleLogout = () => {
    // Simulate logout
    setIsLogoutDialogOpen(false);
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
    // In a real app, you'd redirect or update auth state here
    // e.g., router.push('/login');
  };

  return (
    <div className="space-y-10">
      <Card className="shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
              <AvatarImage src={typeof user.profileImageUrl === 'string' ? user.profileImageUrl : undefined} alt={user.name} data-ai-hint="person avatar"/>
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {user.name ? user.name.substring(0,2).toUpperCase() : <UserCircle2 />}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <CardTitle className="text-3xl md:text-4xl font-headline text-primary">{user.name}</CardTitle>
              <CardDescription className="text-md text-muted-foreground">{user.email}</CardDescription>
            </div>
            <div className="md:ml-auto flex flex-col sm:flex-row gap-2 mt-4 md:mt-0">
                <Button variant="outline" className="text-primary border-primary hover:bg-primary/10" asChild>
                    <Link href="/profile/edit">
                        <Edit3 size={16} className="mr-2"/> Edit Profile
                    </Link>
                </Button>
                <AlertDialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="bg-destructive/90 hover:bg-destructive">
                        <LogOut size={16} className="mr-2"/> Logout
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will be returned to the login page.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleLogout} className="bg-destructive hover:bg-destructive/90">Logout</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Order History Section */}
      <section>
        <h2 className="text-2xl font-headline font-semibold mb-6 text-primary flex items-center">
          <History size={28} className="mr-3 text-accent" /> Order History
        </h2>
        {mockOrders.length > 0 ? (
          <div className="space-y-6">
            {mockOrders.map(order => (
              <Card key={order.id} className="shadow-md">
                <CardHeader className="flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-lg font-semibold">Order #{order.id.substring(0,8)}</CardTitle>
                    <CardDescription>Date: {new Date(order.orderDate).toLocaleDateString()} | Total: ${order.totalAmount.toFixed(2)}</CardDescription>
                  </div>
                  <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Shipped' ? 'outline' : 'secondary'} 
                         className={order.status === 'Delivered' ? 'bg-green-500 text-white' : order.status === 'Shipped' ? 'border-blue-500 text-blue-500' : ''}>
                    {order.status}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {order.items.map(item => (
                      <li key={item.productId} className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                        <div className="flex items-center gap-3">
                          <Image 
                            src={typeof item.productImage === 'string' ? item.productImage : "https://placehold.co/80x80.png"} 
                            alt={item.productName} 
                            width={60} height={60} 
                            className="rounded-md object-cover" 
                            data-ai-hint="product thumbnail"
                          />
                          <div>
                            <p className="font-medium text-foreground">{item.productName}</p>
                            <p className="text-sm text-muted-foreground">Qty: {item.quantity} · Price: ${item.price.toFixed(2)}</p>
                          </div>
                        </div>
                        <Button variant="link" size="sm" className="text-primary p-0 h-auto" asChild>
                           <Link href={`/products/${item.productId}`}>View Product</Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                   <div className="mt-3 pt-3 border-t">
                        <p className="text-sm text-muted-foreground"><strong>Shipping Address:</strong> {order.shippingAddress}</p>
                    </div>
                </CardContent>
                <CardContent className="border-t pt-4 flex justify-end">
                    <Button variant="outline" className="text-primary border-primary hover:bg-primary/10" asChild>
                        <Link href={`/profile/orders/${order.id}`}>View Order Details</Link>
                    </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">You haven&apos;t placed any orders yet.</p>
        )}
      </section>

      <Separator />

      {/* Saved Items Section */}
      <section>
        <h2 className="text-2xl font-headline font-semibold mb-6 text-primary flex items-center">
          <Heart size={28} className="mr-3 text-accent" /> Saved Items (Wishlist)
        </h2>
        {mockSavedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockSavedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-8 bg-muted/30">
            <CardContent>
              <ShoppingBag size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
              <Button variant="default" className="bg-primary hover:bg-primary/90" asChild>
                  <Link href="/products">Discover Products</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
}
