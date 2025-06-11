
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import type { Order, OrderItem } from '@/types';
import { ListOrdered, Search, Filter, Eye, ChevronDown, ShoppingCart, UserCircle2 } from 'lucide-react';
import Image from 'next/image'; // Import Image

// More comprehensive mock data for all orders
const getInitialMockOrders = (): Order[] => [
  { id: 'order001', userId: 'cust1', customerName: 'Chandima P.', items: [{productId: 'p1', productName: 'Batik Wall Hanging', quantity:1, price: 45, productImage: 'https://placehold.co/50x50.png'}], totalAmount: 45.00, orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending', shippingAddress: '123 Galle Rd, Colombo 3' },
  { id: 'order002', userId: 'cust2', customerName: 'Rohan S.', items: [{productId: 'p2', productName: 'Clay Vase Set', quantity:2, price: 30, productImage: 'https://placehold.co/50x50.png'}], totalAmount: 60.00, orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), status: 'Shipped', shippingAddress: '456 Kandy Rd, Kandy' },
  { id: 'order003', userId: 'cust3', customerName: 'Fathima Z.', items: [{productId: 'p3', productName: 'Wooden Elephant Small', quantity:1, price: 20, productImage: 'https://placehold.co/50x50.png'}], totalAmount: 20.00, orderDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), status: 'Delivered', shippingAddress: '789 Marine Drive, Wellawatte' },
  { id: 'order004', userId: 'cust4', customerName: 'David L.', items: [{productId: 'p4', productName: 'Spiced Tea Pack', quantity:3, price: 15, productImage: 'https://placehold.co/50x50.png'}], totalAmount: 45.00, orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending', shippingAddress: '10 Palm Grove, Jaffna' },
  { id: 'order005', userId: 'cust5', customerName: 'Sarah W.', items: [{productId: 'p5', productName: 'Handloom Table Runner', quantity:1, price: 35, productImage: 'https://placehold.co/50x50.png'}], totalAmount: 35.00, orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), status: 'Shipped', shippingAddress: '22 Flower Rd, Nuwara Eliya' },
  { id: 'order006', userId: 'cust6', customerName: 'Kumar R.', items: [{productId: 'p1', productName: 'Batik Wall Hanging', quantity:2, price: 45, productImage: 'https://placehold.co/50x50.png'}], totalAmount: 90.00, orderDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), status: 'Delivered', shippingAddress: '33 Hill Street, Badulla' },
  { id: 'order007', userId: 'cust1', customerName: 'Chandima P.', items: [{productId: 'p2', productName: 'Clay Vase Set', quantity:1, price: 30, productImage: 'https://placehold.co/50x50.png'}], totalAmount: 30.00, orderDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), status: 'Pending', shippingAddress: '123 Galle Rd, Colombo 3' },
  { id: 'order008', userId: 'cust2', customerName: 'Rohan S.', items: [{productId: 'p3', productName: 'Wooden Elephant Small', quantity:3, price: 20, productImage: 'https://placehold.co/50x50.png'}], totalAmount: 60.00, orderDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), status: 'Cancelled', shippingAddress: '456 Kandy Rd, Kandy' },
];

const orderStatuses: Order['status'][] = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function AllOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewOrderDialogOpen, setIsViewOrderDialogOpen] = useState(false);

  useEffect(() => {
    setOrders(getInitialMockOrders());
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewOrderDialogOpen(true);
  };

  const filteredOrders = orders.filter(order => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const matchesSearchTerm =
      order.id.toLowerCase().includes(lowerSearchTerm) ||
      (order.customerName && order.customerName.toLowerCase().includes(lowerSearchTerm)) ||
      order.items.some(item => item.productName.toLowerCase().includes(lowerSearchTerm));
    
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    
    return matchesSearchTerm && matchesStatus;
  });

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };


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
                value={searchTerm}
                onChange={(e) => {setSearchTerm(e.target.value); setCurrentPage(1);}}
                />
            </div>
            <Select value={statusFilter} onValueChange={(value) => {setStatusFilter(value); setCurrentPage(1);}}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {orderStatuses.map(status => (
                  <SelectItem key={status} value={status.toLowerCase()}>{status}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              {currentOrders.map(order => (
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
          {filteredOrders.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No orders found matching your criteria.
            </div>
          )}
        </CardContent>
        {filteredOrders.length > 0 && (
           <CardContent className="border-t pt-4 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
                Showing {Math.min(indexOfFirstOrder + 1, filteredOrders.length)} to {Math.min(indexOfLastOrder, filteredOrders.length)} of {filteredOrders.length} orders
            </span>
            <div className="space-x-2">
                <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</Button>
            </div>
        </CardContent>
        )}
      </Card>

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
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity} · Price: ${item.price.toFixed(2)}</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold text-primary">${(item.quantity * item.price).toFixed(2)}</p>
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
                  <p className="text-sm text-muted-foreground">{selectedOrder.shippingAddress}</p>
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

