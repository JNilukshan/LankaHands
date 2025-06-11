
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Star, Users, MessageSquare, ShoppingBag, Bell, Settings, BarChart3, ListOrdered, Package } from "lucide-react";
import type { SellerStats, Product, Order } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

// Placeholder data
const mockSellerStats: SellerStats = {
  totalSales: 12560.75,
  averageRating: 4.8,
  followers: 320,
  totalReviews: 150,
  productsCount: 25,
  pendingOrders: 3,
};

const mockRecentOrders: Order[] = [
  { id: 'order001', userId: 'cust1', items: [{productId: 'p1', productName: 'Batik Wall Hanging', quantity:1, price: 45}], totalAmount: 45.00, orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending' },
  { id: 'order002', userId: 'cust2', items: [{productId: 'p2', productName: 'Clay Vase Set', quantity:2, price: 30}], totalAmount: 60.00, orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Shipped' },
  { id: 'order003', userId: 'cust3', items: [{productId: 'p3', productName: 'Wooden Elephant Small', quantity:1, price: 20}], totalAmount: 20.00, orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Delivered' },
];

export default function SellerDashboardPage() {
  const stats = mockSellerStats;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary">Seller Dashboard</h1>
        <div className="flex gap-2">
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/10">
                <Bell size={18} className="mr-2" /> Notifications <Badge className="ml-2 bg-destructive text-destructive-foreground">2</Badge>
            </Button>
            <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
                <Link href="/dashboard/seller/products/new"><Package size={18} className="mr-2" /> Add New Product</Link>
            </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={DollarSign} title="Total Sales" value={`$${stats.totalSales.toLocaleString()}`} description="All-time sales" />
        <StatCard icon={Star} title="Average Rating" value={stats.averageRating.toFixed(1)} description={`Based on ${stats.totalReviews} reviews`} />
        <StatCard icon={Users} title="Followers" value={stats.followers.toString()} description="People following your store" />
        <StatCard icon={ShoppingBag} title="Listed Products" value={stats.productsCount.toString()} description="Active items in your store" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="flex flex-row justify-between items-center">
            <CardTitle className="text-xl font-headline text-primary">Recent Orders ({stats.pendingOrders} pending)</CardTitle>
            <Button variant="link" className="text-sm text-primary p-0 h-auto" asChild><Link href="/dashboard/seller/orders">View All Orders</Link></Button>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRecentOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">#{order.id.substring(0,6)}</TableCell>
                    <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                        <Badge variant={order.status === 'Delivered' ? 'default' : order.status === 'Shipped' ? 'outline' : 'secondary'} 
                               className={order.status === 'Delivered' ? 'bg-green-500 text-white' : order.status === 'Shipped' ? 'border-blue-500 text-blue-500' : order.status === 'Pending' ? 'bg-yellow-400 text-yellow-900' : ''}>
                            {order.status}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">View</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Quick Actions / Links */}
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

