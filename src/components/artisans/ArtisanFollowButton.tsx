
"use client";

import { useState, useEffect, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { followArtisan, unfollowArtisan } from '@/services/followService';

interface ArtisanFollowButtonProps {
  artisanId: string;
  artisanName: string;
}

export default function ArtisanFollowButton({ artisanId, artisanName }: ArtisanFollowButtonProps) {
  const { currentUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isFollowing, setIsFollowing] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (currentUser && currentUser.followedArtisans) {
      setIsFollowing(currentUser.followedArtisans.includes(artisanId));
    } else {
      setIsFollowing(false);
    }
  }, [currentUser, artisanId]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast({
        title: "Login Required",
        description: "You need to be logged in to follow an artisan.",
        variant: "destructive",
      });
      router.push('/login');
      return;
    }

    startTransition(async () => {
      const currentFollowState = isFollowing;
      const action = currentFollowState ? unfollowArtisan : followArtisan;
      const result = await action(currentUser.id, artisanId);

      if (result.success) {
        setIsFollowing(!currentFollowState);
        toast({
          title: !currentFollowState ? "Followed!" : "Unfollowed",
          description: result.message,
        });
        // Note: We don't manually update AuthContext state here.
        // For a full implementation, you'd want to refresh the currentUser state
        // or have the server action return the updated user object.
        // For now, the visual state toggles immediately.
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    });
  };

  return (
    <Button 
      variant={isFollowing ? "outline" : "default"} 
      className={isFollowing ? "text-primary border-primary hover:bg-primary/10" : "bg-primary hover:bg-primary/90"}
      onClick={handleFollowToggle}
      disabled={isPending || !currentUser}
    >
      {isPending ? (
        <Loader2 size={18} className="mr-2 animate-spin" />
      ) : isFollowing ? (
        <UserCheck size={18} className="mr-2" />
      ) : (
        <UserPlus size={18} className="mr-2" />
      )}
      {isPending ? "Processing..." : isFollowing ? "Following" : "Follow Artisan"}
    </Button>
  );
}
