
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { Order, OrderItem } from '@/types';
import { CalendarDays, MapPin, ShoppingBag, Tag, Package, Hash, DollarSign, ListOrdered, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

// Placeholder data - in a real app, this would be fetched based on params.orderId
const mockAllOrders: Order[] = [
  {
    id: 'order1',
    userId: 'user123',
    customerName: 'Chandana Silva',
    items: [
        { productId: '101', productName: 'Ocean Breeze Batik Saree', quantity: 1, price: 120.00, productImage: 'https://placehold.co/80x80.png' },
        { productId: '103', productName: 'Sunset Hues Handloom Shawl', quantity: 2, price: 55.00, productImage: 'https://placehold.co/80x80.png' },
    ],
    totalAmount: 230.00,
    orderDate: '2023-05-10T10:00:00Z',
    status: 'Delivered',
    shippingAddress: '123 Galle Road, Colombo 3, Sri Lanka'
  },
  {
    id: 'order2',
    userId: 'user123',
    customerName: 'Chandana Silva',
    items: [{ productId: '102', productName: 'Hand-Carved Elephant Statue', quantity: 1, price: 75.00, productImage: 'https://placehold.co/80x80.png' }],
    totalAmount: 75.00,
    orderDate: '2023-05-20T14:30:00Z',
    status: 'Shipped',
    shippingAddress: '123 Galle Road, Colombo 3, Sri Lanka'
  },
  {
    id: 'order3', // Example for Pending
    userId: 'user123',
    customerName: 'Chandana Silva',
    items: [{ productId: '104', productName: 'Lotus Bloom Batik Wall Hanging', quantity: 1, price: 90.00, productImage: 'https://placehold.co/80x80.png' }],
    totalAmount: 90.00,
    orderDate: '2023-05-25T11:00:00Z',
    status: 'Pending',
    shippingAddress: '123 Galle Road, Colombo 3, Sri Lanka'
  },
  {
    id: 'order4', // Example for Cancelled
    userId: 'user123',
    customerName: 'Chandana Silva',
    items: [{ productId: '105', productName: 'Terracotta Clay Vase Set', quantity: 1, price: 45.00, productImage: 'https://placehold.co/80x80.png' }],
    totalAmount: 45.00,
    orderDate: '2023-05-22T09:00:00Z',
    status: 'Cancelled',
    shippingAddress: '123 Galle Road, Colombo 3, Sri Lanka'
  },
];

const getOrderDetails = async (orderId: string): Promise<Order | null> => {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call
  const order = mockAllOrders.find(o => o.id === orderId);
  return order || null;
};

export default async function OrderDetailsPage({ params }: { params: { orderId: string } }) {
  const order = await getOrderDetails(params.orderId);

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
                    'default' // Fallback
                }
                className="mt-2 sm:mt-0 text-sm px-3 py-1"
            >
                {order.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-md text-foreground mb-2 flex items-center"><UserCircle2 size={18} className="mr-2 text-accent"/>Customer Information</h3>
                    <p className="text-sm text-muted-foreground"><strong>Name:</strong> {order.customerName || order.userId}</p>
                    {/* In a real app, more customer details might be available */}
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
                        <span>${order.totalAmount.toFixed(2)}</span> {/* Assuming totalAmount is subtotal for now */}
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping:</span>
                        <span>$0.00</span> {/* Placeholder */}
                    </div>
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax:</span>
                        <span>$0.00</span> {/* Placeholder */}
                    </div>
                    <Separator className="my-2"/>
                    <div className="flex justify-between font-bold text-lg text-primary">
                        <span>Order Total:</span>
                        <span>${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </CardContent>
        <CardFooter className="bg-muted/30 p-6 flex flex-col sm:flex-row justify-end gap-3">
            <Button variant="outline">Print Invoice</Button>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">Track Package</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
