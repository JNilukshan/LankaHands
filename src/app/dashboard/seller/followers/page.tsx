
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Users, Loader2, UserCircle2 } from 'lucide-react';
import type { User } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getFollowersByArtisanId } from '@/services/userService';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

type Follower = Pick<User, 'uid' | 'name' | 'profileImageUrl'>;

export default function FollowersPage() {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isAuthLoading) return;
    if (!currentUser || currentUser.role !== 'seller') {
      router.push('/login');
      return;
    }

    const fetchFollowers = async () => {
      setIsLoading(true);
      const followerData = await getFollowersByArtisanId(currentUser.id);
      setFollowers(followerData);
      setIsLoading(false);
    };

    fetchFollowers();
  }, [currentUser, isAuthLoading, router]);

  if (isAuthLoading || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
        <p className="text-lg text-muted-foreground">Loading your followers...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center">
          <Users size={32} className="mr-3 text-accent" /> Your Followers ({followers.length})
        </h1>
        <Button variant="outline" asChild>
          <Link href="/dashboard/seller">Back to Dashboard</Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Follower List</CardTitle>
          <CardDescription>Here are the users who follow your artisan profile.</CardDescription>
        </CardHeader>
        <CardContent>
          {followers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {followers.map(follower => (
                <Card key={follower.uid} className="text-center p-4 shadow-md hover:shadow-lg transition-shadow">
                  <Avatar className="w-20 h-20 mx-auto mb-3 border-2 border-primary/20">
                    <AvatarImage src={follower.profileImageUrl} alt={follower.name} data-ai-hint="person avatar" />
                    <AvatarFallback className="bg-muted text-muted-foreground text-xl">
                      {follower.name ? follower.name.substring(0, 2).toUpperCase() : <UserCircle2 />}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-foreground truncate">{follower.name}</p>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-muted-foreground">
              <Users size={48} className="mx-auto mb-4" />
              <p>You don't have any followers yet.</p>
              <p className="text-sm">Keep creating amazing products to attract a following!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
