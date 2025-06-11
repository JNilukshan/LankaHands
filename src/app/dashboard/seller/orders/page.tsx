
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Order, OrderItem } from '@/types';
import { ListOrdered, Search, Filter, Eye } from 'lucide-react';
import Link from 'next/link';

// More comprehensive mock data for all orders
const mockAllOrders: Order[] = [
  { id: 'order001', userId: 'cust1', customerName: 'Chandima P.', items: [{productId: 'p1', productName: 'Batik Wall Hanging', quantity:1, price: 45}], totalAmount: 45.00, orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending', shippingAddress: '123 Galle Rd, Colombo 3' },
  { id: 'order002', userId: 'cust2', customerName: 'Rohan S.', items: [{productId: 'p2', productName: 'Clay Vase Set', quantity:2, price: 30}], totalAmount: 60.00, orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Shipped', shippingAddress: '456 Kandy Rd, Kandy' },
  { id: 'order003', userId: 'cust3', customerName: 'Fathima Z.', items: [{productId: 'p3', productName: 'Wooden Elephant Small', quantity:1, price: 20}], totalAmount: 20.00, orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Delivered', shippingAddress: '789 Marine Drive, Wellawatte' },
  { id: 'order004', userId: 'cust4', customerName: 'David L.', items: [{productId: 'p4', productName: 'Spiced Tea Pack', quantity:3, price: 15}], totalAmount: 45.00, orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending', shippingAddress: '10 Palm Grove, Jaffna' },
  { id: 'order005', userId: 'cust5', customerName: 'Sarah W.', items: [{productId: 'p5', productName: 'Handloom Table Runner', quantity:1, price: 35}], totalAmount: 35.00, orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'Shipped', shippingAddress: '22 Flower Rd, Nuwara Eliya' },
  { id: 'order006', userId: 'cust6', customerName: 'Kumar R.', items: [{productId: 'p1', productName: 'Batik Wall Hanging', quantity:2, price: 45}], totalAmount: 90.00, orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'Delivered', shippingAddress: '33 Hill Street, Badulla' },
  { id: 'order007', userId: 'cust1', customerName: 'Chandima P.', items: [{productId: 'p2', productName: 'Clay Vase Set', quantity:1, price: 30}], totalAmount: 30.00, orderDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending', shippingAddress: '123 Galle Rd, Colombo 3' },
  { id: 'order008', userId: 'cust2', customerName: 'Rohan S.', items: [{productId: 'p3', productName: 'Wooden Elephant Small', quantity:3, price: 20}], totalAmount: 60.00, orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), status: 'Cancelled', shippingAddress: '456 Kandy Rd, Kandy' },
];


export default function AllOrdersPage() {
  // Placeholder for search and filter state
  // const [searchTerm, setSearchTerm] = useState('');
  // const [statusFilter, setStatusFilter] = useState('all');

  const orders = mockAllOrders; // Later, this would be filtered based on state

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center">
          <ListOrdered size={32} className="mr-3 text-accent" /> All Orders
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>Browse and manage all orders placed in your store.</CardDescription>
          <div className="pt-4 flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                type="search" 
                placeholder="Search by Order ID, Customer..." 
                className="pl-10 w-full"
                // onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="text-primary border-primary hover:bg-primary/10 w-full sm:w-auto">
                <Filter size={16} className="mr-2"/> Apply Filters
            </Button>
          </div>
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
              {orders.map(order => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">#{order.id.substring(0,8)}</TableCell>
                  <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                  <TableCell>{order.customerName || `Customer ${order.userId}`}</TableCell>
                  <TableCell className="text-right">${order.totalAmount.toFixed(2)}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={
                        order.status === 'Delivered' ? 'default' : 
                        order.status === 'Shipped' ? 'outline' : 
                        order.status === 'Cancelled' ? 'destructive' : 'secondary'
                      }
                      className={
                        order.status === 'Delivered' ? 'bg-green-500 text-white' : 
                        order.status === 'Shipped' ? 'border-blue-500 text-blue-500' : 
                        order.status === 'Pending' ? 'bg-yellow-400 text-yellow-900' :
                        order.status === 'Cancelled' ? 'bg-red-500 text-white' : ''
                      }
                    >
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                      <Eye className="h-4 w-4" />
                       <span className="sr-only">View Order</span>
                    </Button>
                    {/* Add more actions like Print Invoice, etc. later */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {orders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found.
            </div>
          )}
        </CardContent>
        {/* Basic Pagination Placeholder */}
        <CardContent className="border-t pt-4 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Showing 1 to {orders.length > 10 ? 10 : orders.length} of {orders.length} orders</span>
            <div className="space-x-2">
                <Button variant="outline" size="sm" disabled={true}>Previous</Button>
                <Button variant="outline" size="sm" disabled={orders.length <= 10}>Next</Button>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}

    