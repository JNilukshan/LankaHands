
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bell, ShoppingCart, MessageCircle, Star, AlertTriangle, Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { SellerNotification as SellerNotificationTypeFromTypes } from '@/types'; // Renamed to avoid conflict

// Use the existing SellerNotification type from types.ts
type SellerNotification = SellerNotificationTypeFromTypes & { artisanId?: string };


const LOCAL_STORAGE_NOTIFICATIONS_KEY = 'lankaHandsSellerNotifications';

// Default notifications if localStorage is empty or for fallback
const defaultMockNotifications: SellerNotification[] = [
  {
    id: 'default_notif1',
    type: 'new_order',
    title: 'New Order Received!',
    description: 'Order #ORD00125 for Batik Wall Hanging placed by Chandima P.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    link: '/dashboard/seller/orders/order00125',
  },
  {
    id: 'default_notif3',
    type: 'new_review',
    title: '5-Star Review for Wooden Elephant',
    description: 'Fathima Z. left a review: "Absolutely stunning craftsmanship!"',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    sender: 'Fathima Z.',
    link: '/dashboard/seller/reviews#rev003',
  },
];

const getNotificationIcon = (type: SellerNotification['type'], read: boolean) => {
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
    try {
      const storedNotificationsString = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
      if (storedNotificationsString) {
        const parsedNotifications: SellerNotification[] = JSON.parse(storedNotificationsString);
        // Ensure timestamps are Date objects
        const notificationsWithDateObjects = parsedNotifications.map(n => ({
          ...n,
          timestamp: new Date(n.timestamp), // Convert ISO string back to Date
        }));
        setNotifications(notificationsWithDateObjects.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
      } else {
        // Fallback to default if localStorage is empty
         setNotifications(defaultMockNotifications.map(n => ({...n, timestamp: new Date(n.timestamp)})));
      }
    } catch (e) {
      console.error("Failed to load notifications from localStorage", e);
      setNotifications(defaultMockNotifications.map(n => ({...n, timestamp: new Date(n.timestamp)})));
    }
  }, []);

  const saveNotificationsToLocalStorage = (updatedNotifications: SellerNotification[]) => {
    try {
        // Convert Date objects to ISO strings before saving
        const notificationsToStore = updatedNotifications.map(n => ({
            ...n,
            timestamp: n.timestamp.toISOString(),
        }));
      localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(notificationsToStore));
    } catch (e) {
      console.error("Failed to save notifications to localStorage", e);
    }
  };

  const toggleReadStatus = (id: string) => {
    const updated = notifications.map(notif =>
      notif.id === id ? { ...notif, read: !notif.read } : notif
    );
    setNotifications(updated);
    saveNotificationsToLocalStorage(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updated);
    saveNotificationsToLocalStorage(updated);
  };
  
  const clearAllNotifications = () => {
    setNotifications([]);
    saveNotificationsToLocalStorage([]);
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
              <p className="text-muted-foreground">You have no new notifications at the moment.</p>
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
