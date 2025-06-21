
"use client";

import { useState, useEffect, useTransition } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bell, ShoppingCart, MessageCircle, Star, AlertTriangle, Check, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import type { SellerNotification } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getNotificationsByArtisanId, updateNotification, markAllNotificationsAsRead, clearAllNotificationsForArtisan } from '@/services/notificationService';

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
  const { currentUser, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [notifications, setNotifications] = useState<SellerNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (authLoading) return;
    if (!currentUser || currentUser.role !== 'seller') {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    getNotificationsByArtisanId(currentUser.id)
      .then(data => {
        setNotifications(data.map(n => ({...n, timestamp: new Date(n.timestamp).toISOString() }))); // Ensure timestamps are consistent
      })
      .catch(err => console.error("Failed to fetch notifications:", err))
      .finally(() => setIsLoading(false));
  }, [currentUser, authLoading, router]);

  const handleToggleRead = (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const success = await updateNotification(id, { read: !currentStatus });
      if (success) {
        setNotifications(prev =>
          prev.map(notif =>
            notif.id === id ? { ...notif, read: !notif.read } : notif
          )
        );
      }
    });
  };

  const handleMarkAllAsRead = () => {
    if (!currentUser) return;
    startTransition(async () => {
      const success = await markAllNotificationsAsRead(currentUser.id);
      if (success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
      }
    });
  };
  
  const handleClearAll = () => {
    if (!currentUser) return;
    startTransition(async () => {
      const success = await clearAllNotificationsForArtisan(currentUser.id);
      if (success) {
        setNotifications([]);
      }
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (isLoading || authLoading) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading notifications...</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center">
          <Bell size={32} className="mr-3 text-accent" /> Notifications
        </h1>
        <div className="flex gap-2">
            <Button variant="outline" onClick={handleMarkAllAsRead} disabled={unreadCount === 0 || isPending}>
                {isPending && unreadCount > 0 ? <Loader2 size={16} className="mr-2 animate-spin"/> : <Check size={16} className="mr-2"/>}
                Mark All as Read
            </Button>
            <Button variant="destructive" onClick={handleClearAll} disabled={notifications.length === 0 || isPending}>
                {isPending && notifications.length > 0 ? <Loader2 size={16} className="mr-2 animate-spin"/> : <Trash2 size={16} className="mr-2"/>}
                Clear All
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
                      {new Date(notif.timestamp).toLocaleDateString()} at {new Date(notif.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 items-end shrink-0">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleToggleRead(notif.id, notif.read)}
                      className="text-xs"
                      disabled={isPending}
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
