
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bell, ShoppingCart, MessageCircle, Star, AlertTriangle, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

type NotificationType = 'new_order' | 'new_message' | 'new_review' | 'low_stock' | 'general';

interface SellerNotification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  link?: string; // Optional link to relevant page (e.g., order details)
  sender?: string; // e.g., customer name for messages/reviews
}

const initialMockNotifications: SellerNotification[] = [
  {
    id: 'notif1',
    type: 'new_order',
    title: 'New Order Received!',
    description: 'Order #ORD00125 for Batik Wall Hanging placed by Chandima P.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    read: false,
    link: '/dashboard/seller/orders/order00125', // Example link
  },
  {
    id: 'notif2',
    type: 'new_message',
    title: 'New Message from Rohan S.',
    description: 'Inquiry about custom dimensions for the Clay Vase Set...',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    read: false,
    sender: 'Rohan S.',
    link: '/dashboard/seller/messages/msg001', // Example link
  },
  {
    id: 'notif3',
    type: 'new_review',
    title: '5-Star Review for Wooden Elephant',
    description: 'Fathima Z. left a review: "Absolutely stunning craftsmanship!"',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    read: true,
    sender: 'Fathima Z.',
    link: '/dashboard/seller/reviews#rev003', // Example link
  },
  {
    id: 'notif4',
    type: 'low_stock',
    title: 'Low Stock Alert: Spiced Tea Pack',
    description: 'Only 3 units remaining for "Spiced Tea Pack". Consider restocking.',
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    read: false,
    link: '/dashboard/seller/products/prod004/edit', // Example link
  },
  {
    id: 'notif5',
    type: 'general',
    title: 'Platform Update Scheduled',
    description: 'Scheduled maintenance on Sunday at 2 AM. Expect brief downtime.',
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    read: true,
  },
];

const getNotificationIcon = (type: NotificationType, read: boolean) => {
  const color = read ? "text-muted-foreground" : "text-primary";
  switch (type) {
    case 'new_order': return <ShoppingCart size={24} className={color} />;
    case 'new_message': return <MessageCircle size={24} className={color} />;
    case 'new_review': return <Star size={24} className={color} />;
    case 'low_stock': return <AlertTriangle size={24} className={color} />;
    default: return <Bell size={24} className={color} />;
  }
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<SellerNotification[]>([]);

  useEffect(() => {
    // Simulate fetching notifications
    setNotifications(initialMockNotifications.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, []);

  const toggleReadStatus = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: !notif.read } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center">
          <Bell size={32} className="mr-3 text-accent" /> Notifications
        </h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
                <Check size={16} className="mr-2"/> Mark All as Read
            </Button>
            <Button variant="destructive" onClick={clearAllNotifications} disabled={notifications.length === 0}>
                <Trash2 size={16} className="mr-2"/> Clear All
            </Button>
        </div>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Recent Notifications</CardTitle>
          <CardDescription>
            You have {unreadCount} unread notification{unreadCount === 1 ? '' : 's'}.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {notifications.length > 0 ? (
            notifications.map(notif => (
              <Card 
                key={notif.id} 
                className={`transition-all duration-300 ease-in-out shadow-md hover:shadow-lg ${notif.read ? 'bg-card opacity-70' : 'bg-card'}`}
              >
                <CardContent className="p-4 flex items-start gap-4">
                  <div className="pt-1 shrink-0">
                    {getNotificationIcon(notif.type, notif.read)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-semibold ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>{notif.title}</h3>
                       {!notif.read && <Badge variant="default" className="text-xs bg-accent text-accent-foreground">New</Badge>}
                    </div>
                    {notif.sender && <p className="text-xs text-muted-foreground">From: {notif.sender}</p>}
                    <p className={`text-sm ${notif.read ? 'text-muted-foreground/80' : 'text-foreground/90'} mt-1`}>{notif.description}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {notif.timestamp.toLocaleDateString()} at {notif.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleReadStatus(notif.id)}
                      className="text-xs"
                    >
                      {notif.read ? 'Mark as Unread' : 'Mark as Read'}
                    </Button>
                    {notif.link && (
                      <Button variant="link" size="sm" asChild className="text-xs text-primary p-0 h-auto">
                        <Link href={notif.link}>View Details</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-10">
              <Bell size={48} className="mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">You have no notifications at the moment.</p>
            </div>
          )}
        </CardContent>
         {notifications.length > 0 && (
            <CardFooter className="border-t pt-4 flex justify-center">
                <p className="text-xs text-muted-foreground">End of notifications.</p>
            </CardFooter>
        )}
      </Card>
    </div>
  );
}


    