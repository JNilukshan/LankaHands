
"use client"; 

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Order } from '@/types';
import { CalendarDays, MapPin, ShoppingBag, Package, DollarSign, ListOrdered, UserCircle2, ShieldCheck, Truck, Ban } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
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
import { getMockOrdersByCustomerId } from '@/lib/mock-data'; // Import from new mock data source

const getOrderDetails = async (orderId: string, customerId: string): Promise<Order | null> => {
  const orders = await getMockOrdersByCustomerId(customerId);
  const order = orders.find(o => o.id === orderId);
  return order || null;
};

export default function OrderDetailsPage({ params }: { params: { orderId: string } }) {
  // For this prototype, we'll assume the logged-in user is 'chandana-c1'
  const customerId = 'chandana-c1'; 
  const resolvedParams = React.use(params);
  const orderId = resolvedParams.orderId; // Corrected from resolvedParams.id
  
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      const orderDetails = await getOrderDetails(orderId, customerId);
      setOrder(orderDetails);
      setLoading(false);
    };
    fetchOrder();
  }, [orderId, customerId]);

  const handlePrint = () => {
    window.print();
  };

  const handleConfirmCancellation = async () => {
    if (!order) return;
    
    console.log(`Cancelling order ${order.id}`);
    await new Promise(resolve => setTimeout(resolve, 1000)); 

    setOrder(prevOrder => prevOrder ? { ...prevOrder, status: 'Cancelled' } : null);
    // Note: This mock data change won't persist beyond this page load.
    // In a real app, you'd update the backend and likely refetch or update global state.
    toast({
      title: "Order Cancelled",
      description: `Order #${order.id.substring(0,8)} has been successfully cancelled.`,
      variant: "default"
    });
    setIsCancelDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
        <div className="py-12 text-center">
            <h1 className="text-2xl font-semibold text-destructive mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">Sorry, we couldn&apos;t find details for this order.</p>
            <Button asChild variant="outline">
                <Link href="/profile">Back to Profile</Link>
            </Button>
        </div>
    );
  }
  
  const artisanShipping = order.artisan?.shippingSettings;
  const artisanPolicies = order.artisan?.storePolicies;
  const isCancellable = order.status === 'Pending' && (artisanPolicies?.cancellationPolicy ? true : false);


  return (
    <div className="py-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-headline font-bold text-primary flex items-center">
                <ShoppingBag size={32} className="mr-3 text-accent" /> Order Details
            </h1>
            <Button variant="outline" asChild>
                <Link href="/profile">
                    <ListOrdered size={16} className="mr-2"/> Back to All Orders
                </Link>
            </Button>
        </div>

      <Card className="shadow-xl">
        <CardHeader className="bg-muted/30">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
                <CardTitle className="text-2xl font-headline text-primary">Order #{order.id.substring(0,8)}</CardTitle>
                <CardDescription className="flex items-center text-sm">
                    <CalendarDays size={14} className="mr-2 text-muted-foreground" />
                    Placed on: {new Date(order.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </CardDescription>
            </div>
            <Badge
                variant={
                    order.status === 'Delivered' ? 'default' :
                    order.status === 'Shipped' ? 'secondary' : 
                    order.status === 'Pending' ? 'secondary' : 
                    order.status === 'Cancelled' ? 'destructive' :
                    'default'
                }
                 className={`text-sm px-3 py-1 ${
                    order.status === 'Delivered' ? 'bg-green-500 hover:bg-green-500 text-primary-foreground' :
                    order.status === 'Shipped' ? 'bg-blue-500 hover:bg-blue-500 text-primary-foreground' : 
                    order.status === 'Pending' ? 'bg-yellow-400 hover:bg-yellow-400 text-secondary-foreground' : 
                    order.status === 'Cancelled' ? 'bg-red-500 hover:bg-red-500 text-destructive-foreground' :
                    ''
                }`}
            >
                {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            {order.artisan && (
                 <div className="mb-4 p-4 border border-primary/20 rounded-lg bg-primary/5">
                    <h3 className="font-semibold text-md text-primary mb-1">Fulfilled by:</h3>
                    <Link href={`/artisans/${order.artisan.id}`} className="text-accent hover:underline font-medium">{order.artisan.name}</Link>
                    {order.artisan.speciality && <p className="text-xs text-muted-foreground">{order.artisan.speciality}</p>}
                </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-md text-foreground mb-2 flex items-center"><UserCircle2 size={18} className="mr-2 text-accent"/>Customer Information</h3>
                    <p className="text-sm text-muted-foreground"><strong>Name:</strong> {order.customerName || order.userId}</p>
                </div>
                <div>
                    <h3 className="font-semibold text-md text-foreground mb-2 flex items-center"><MapPin size={18} className="mr-2 text-accent"/>Shipping Address</h3>
                    <p className="text-sm text-muted-foreground">{order.shippingAddress || "Not specified"}</p>
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="font-semibold text-md text-foreground mb-3 flex items-center"><Package size={18} className="mr-2 text-accent"/>Items in this Order</h3>
                <ul className="space-y-4">
                    {order.items.map(item => (
                    <li key={item.productId} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-background border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4 mb-3 sm:mb-0">
                            <Image
                                src={typeof item.productImage === 'string' ? item.productImage : "https://placehold.co/80x80.png"}
                                alt={item.productName}
                                width={70} height={70}
                                className="rounded-md object-cover border"
                                data-ai-hint="product thumbnail"
                            />
                            <div>
                                <Link href={`/products/${item.productId}`} className="font-medium text-primary hover:underline text-md">{item.productName}</Link>
                                <p className="text-xs text-muted-foreground">Product ID: {item.productId}</p>
                                <p className="text-sm text-muted-foreground mt-1">Qty: {item.quantity} &times; ${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                        <p className="text-md font-semibold text-primary sm:ml-auto">${(item.quantity * item.price).toFixed(2)}</p>
                    </li>
                    ))}
                </ul>
            </div>

            <Separator />

            <div>
                <h3 className="font-semibold text-md text-foreground mb-2 flex items-center"><DollarSign size={18} className="mr-2 text-accent"/>Order Summary</h3>
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal:</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping (Artisan):</span>
                        <span>${artisanShipping?.localRate?.toFixed(2) || 'Free'}</span> 
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax (Estimated):</span>
                        <span>${(order.totalAmount * 0.08).toFixed(2)}</span> 
                    </div>
                    <Separator className="my-2"/>
                    <div className="flex justify-between font-bold text-lg text-primary">
                        <span>Order Total:</span>
                        <span>${(order.totalAmount + (artisanShipping?.localRate || 0) + (order.totalAmount * 0.08)).toFixed(2)}</span>
                    </div>
                </div>
            </div>

            <Separator />
            
            <div>
                <h3 className="font-semibold text-md text-foreground mb-3 flex items-center"><Truck size={18} className="mr-2 text-accent"/>Artisan&apos;s Shipping Information</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                    {artisanShipping ? (
                        <>
                            {artisanShipping.processingTime && <p><strong>Typical Order Processing Time:</strong> {artisanShipping.processingTime}</p>}
                            <div>
                                <h4 className="font-medium text-foreground mb-1">Shipping Rates & Times:</h4>
                                <ul className="list-disc list-inside pl-4 space-y-1">
                                    {artisanShipping.localRate !== undefined && artisanShipping.localDeliveryTime && 
                                        <li>Local (Sri Lanka): ${artisanShipping.localRate.toFixed(2)} ({artisanShipping.localDeliveryTime})</li>}
                                    {artisanShipping.internationalRate !== undefined && artisanShipping.internationalDeliveryTime && 
                                        <li>International: ${artisanShipping.internationalRate.toFixed(2)} ({artisanShipping.internationalDeliveryTime})</li>}
                                    {artisanShipping.freeShippingLocalThreshold && 
                                        <li>Free local shipping on orders over ${artisanShipping.freeShippingLocalThreshold.toFixed(2)}.</li>}
                                    {artisanShipping.freeShippingInternationalThreshold && 
                                        <li>Free international shipping on orders over ${artisanShipping.freeShippingInternationalThreshold.toFixed(2)}.</li>}
                                </ul>
                                {(artisanShipping.localRate === undefined && artisanShipping.internationalRate === undefined && !artisanShipping.processingTime) && <p>Shipping details provided by artisan upon request or at checkout.</p>}
                            </div>
                        </>
                    ) : (
                        <p>Shipping policies are set by the artisan. Contact them for details if not specified here.</p>
                    )}
                </div>
            </div>

            <Separator />

            <div>
                <h3 className="font-semibold text-md text-foreground mb-3 flex items-center"><ShieldCheck size={18} className="mr-2 text-accent"/>Artisan&apos;s Store Policies</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                    {artisanPolicies ? (
                        <>
                            {artisanPolicies.returnPolicy && <div><h4 className="font-medium text-foreground mb-1">Return & Refund Policy:</h4><p>{artisanPolicies.returnPolicy}</p></div>}
                            {artisanPolicies.exchangePolicy && <div><h4 className="font-medium text-foreground mb-1">Exchange Policy:</h4><p>{artisanPolicies.exchangePolicy}</p></div>}
                            {artisanPolicies.cancellationPolicy && <div><h4 className="font-medium text-foreground mb-1">Order Cancellation Policy:</h4><p>{artisanPolicies.cancellationPolicy}</p></div>}
                            {(!artisanPolicies.returnPolicy && !artisanPolicies.exchangePolicy && !artisanPolicies.cancellationPolicy) && <p>Store policies not specified by artisan.</p>}
                        </>
                    ) : (
                         <p>Store policies are set by the artisan. Please check their profile or contact them for details.</p>
                    )}
                </div>
            </div>

        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline" onClick={handlePrint}>Print Invoice</Button>
            <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={!isCancellable}>
                  <Ban size={16} className="mr-2" /> Cancel Order
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Order Cancellation</AlertDialogTitle>
                  <AlertDialogDescription>
                    {artisanPolicies?.cancellationPolicy ? 
                     `Artisan's policy: "${artisanPolicies.cancellationPolicy}" ` : ''}
                    Are you sure you want to request cancellation for this order? This action cannot be undone if approved by the artisan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Keep Order</AlertDialogCancel>
                  <AlertDialogAction onClick={handleConfirmCancellation} className="bg-destructive hover:bg-destructive/90">
                    Request Cancellation
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
