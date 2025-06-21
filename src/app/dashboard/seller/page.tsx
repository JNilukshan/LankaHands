
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Star, Users, MessageSquare, ShoppingBag, Settings, BarChart3, ListOrdered, Eye, ChevronDown, Bell, UserCircle2, Loader2 } from "lucide-react";
import type { SellerStats, Order } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { getSellerStats } from '@/services/sellerService';
import { getOrdersByArtisanId } from '@/services/orderService';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

const orderStatuses: Order['status'][] = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function SellerDashboardPage() {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<SellerStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const unreadNotificationsCount = 5; // Example count, can be dynamic later

  useEffect(() => {
    if (isAuthLoading) return;
    if (!currentUser || currentUser.role !== 'seller') {
      router.push('/login'); // Or a 'not authorized' page
      return;
    }

    const fetchData = async () => {
      setIsLoadingData(true);
      const sellerStats = await getSellerStats(currentUser.id);
      setStats(sellerStats);
      const allOrders = await getOrdersByArtisanId(currentUser.id);
      setRecentOrders(allOrders.slice(0, 5)); // Get top 5 recent orders
      setIsLoadingData(false);
    };
    fetchData();
  }, [currentUser, isAuthLoading, router]);


  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setRecentOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    // In a real app, this would also trigger a backend update
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOrderDialogOpen(true);
  };
  
  if (isAuthLoading || isLoadingData || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
        <p className="text-lg text-muted-foreground">Loading seller dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary">Seller Dashboard</h1>
        <div className="flex items-center gap-2">
            <Link href={`/artisans/${currentUser.id}`} passHref> 
              <Button variant="outline">
                <UserCircle2 size={20} className="mr-2 text-primary" />
                View Public Profile
              </Button>
            </Link>
            <Link href="/dashboard/seller/notifications" passHref>
                <Button variant="outline" className="relative">
                    <Bell size={20} className="mr-2 text-primary" />
                    Notifications
                    {unreadNotificationsCount > 0 && (
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-xs">
                        {unreadNotificationsCount}
                    </Badge>
                    )}
                </Button>
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={DollarSign} title="Total Sales" value={`$${stats?.totalSales.toLocaleString() || '0'}`} description="All-time sales" />
        <StatCard icon={Star} title="Average Rating" value={stats?.averageRating.toFixed(1) || '0.0'} description={`Based on ${stats?.totalReviews || 0} reviews`} />
        <StatCard icon={Users} title="Followers" value={stats?.followers.toString() || '0'} description="People following your store" />
        <StatCard icon={ShoppingBag} title="Listed Products" value={stats?.productsCount.toString() || '0'} description="Active items in your store" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-xl font-headline text-primary">Recent Orders ({stats?.pendingOrders || 0} pending)</CardTitle>
            <Button variant="link" className="text-sm text-primary p-0 h-auto" asChild><Link href="/dashboard/seller/orders">View All Orders</Link></Button>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.substring(0,8)}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>{order.customerName || `Customer ${order.userId}`}</TableCell>
                    <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-center">
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex items-center gap-1 text-xs h-8 min-w-[100px] justify-center">
                            <Badge 
                                variant={
                                order.status === 'Delivered' ? 'default' : 
                                order.status === 'Shipped' ? 'outline' : 
                                order.status === 'Cancelled' ? 'destructive' : 'secondary'
                                }
                                className={
                                `pointer-events-none text-xs ${ order.status === 'Delivered' ? 'bg-green-500 hover:bg-green-500 text-white' : 
                                order.status === 'Shipped' ? 'border-blue-500 text-blue-500 hover:bg-blue-500/10' : 
                                order.status === 'Pending' ? 'bg-yellow-400 hover:bg-yellow-400 text-yellow-900' :
                                order.status === 'Cancelled' ? 'bg-red-500 hover:bg-red-500 text-white' : '' }`
                                }
                            >
                                {order.status}
                            </Badge>
                            <ChevronDown className="h-3 w-3 opacity-70" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            {orderStatuses.map(statusOption => (
                            <DropdownMenuItem 
                                key={statusOption} 
                                onClick={() => handleStatusChange(order.id, statusOption)}
                                disabled={order.status === statusOption}
                            >
                                {statusOption}
                            </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                    <TableCell className="text-right">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10" onClick={() => handleViewOrder(order)}>
                            <Eye className="h-4 w-4" />
                            <span className="sr-only">View Order</span>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {recentOrders.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                No recent orders.
                </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="text-xl font-headline text-primary">Quick Links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <QuickLinkItem href="/dashboard/seller/products" icon={ListOrdered} label="Manage Products" />
                <QuickLinkItem href="/dashboard/seller/reviews" icon={MessageSquare} label="View Reviews" />
                <QuickLinkItem href="/dashboard/seller/analytics" icon={BarChart3} label="Sales Analytics" />
                <QuickLinkItem href="/dashboard/seller/settings" icon={Settings} label="Store Settings" />
            </CardContent>
        </Card>
      </div>

      {selectedOrder && (
        <Dialog open={isViewOrderDialogOpen} onOpenChange={setIsViewOrderDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-headline text-primary">Order Details: #{selectedOrder.id.substring(0,8)}</DialogTitle>
              <DialogDescription>
                Placed on: {new Date(selectedOrder.orderDate).toLocaleDateString()} by {selectedOrder.customerName || `Customer ${selectedOrder.userId}`}
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-foreground">Items Ordered:</h4>
                <ul className="space-y-3 max-h-60 overflow-y-auto">
                  {selectedOrder.items.map(item => (
                    <li key={item.productId} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                      <div className="flex items-center gap-3">
                        <Image 
                          src={typeof item.productImage === 'string' ? item.productImage : "https://placehold.co/60x60.png"} 
                          alt={item.productName} 
                          width={50} height={50} 
                          className="rounded-md object-cover border"
                          data-ai-hint="product thumbnail"
                        />
                        <div>
                          <p className="font-medium text-sm text-foreground">{item.productName}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} · Price: ${item.priceAtPurchase.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-primary">${(item.quantity * item.priceAtPurchase).toFixed(2)}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between font-semibold text-md text-primary">
                  <span>Total Amount:</span>
                  <span>${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
              {selectedOrder.shippingAddress && (
                <div className="border-t pt-3">
                  <h4 className="font-semibold text-sm text-foreground mb-1">Shipping Address:</h4>
                  <p className="text-sm text-muted-foreground">{typeof selectedOrder.shippingAddress === 'string' ? selectedOrder.shippingAddress : 'Address details missing'}</p>
                </div>
              )}
              <div className="border-t pt-3">
                <h4 className="font-semibold text-sm text-foreground mb-1">Order Status:</h4>
                <Badge 
                    variant={
                        selectedOrder.status === 'Delivered' ? 'default' : 
                        selectedOrder.status === 'Shipped' ? 'outline' : 
                        selectedOrder.status === 'Cancelled' ? 'destructive' : 'secondary'
                    }
                    className={
                        `${ selectedOrder.status === 'Delivered' ? 'bg-green-500 text-white' : 
                        selectedOrder.status === 'Shipped' ? 'border-blue-500 text-blue-500' : 
                        selectedOrder.status === 'Pending' ? 'bg-yellow-400 text-yellow-900' :
                        selectedOrder.status === 'Cancelled' ? 'bg-red-500 text-white' : '' }`
                    }
                >
                    {selectedOrder.status}
                </Badge>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">Close</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  title: string;
  value: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, description }) => (
  <Card className="shadow-md hover:shadow-lg transition-shadow">
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <Icon className="h-5 w-5 text-accent" />
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold text-primary">{value}</div>
      <p className="text-xs text-muted-foreground pt-1">{description}</p>
    </CardContent>
  </Card>
);

interface QuickLinkItemProps {
    href: string;
    icon: React.ElementType;
    label: string;
}
const QuickLinkItem: React.FC<QuickLinkItemProps> = ({ href, icon: Icon, label }) => (
    <Button variant="ghost" className="w-full justify-start text-md text-foreground/80 hover:text-primary hover:bg-primary/5" asChild>
        <Link href={href}>
            <Icon size={20} className="mr-3 text-accent" /> {label}
        </Link>
    </Button>
);
