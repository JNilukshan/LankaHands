
"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, UserCheck, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ArtisanFollowButtonProps {
  artisanId: string;
  initialIsFollowing?: boolean;
  artisanName: string;
}

export default function ArtisanFollowButton({ artisanId, initialIsFollowing = false, artisanName }: ArtisanFollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsFollowing(initialIsFollowing);
  }, [initialIsFollowing]);

  const handleFollowToggle = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    const newFollowState = !isFollowing;
    setIsFollowing(newFollowState);
    setIsLoading(false);

    toast({
      title: newFollowState ? "Followed!" : "Unfollowed",
      description: newFollowState ? `You are now following ${artisanName}.` : `You have unfollowed ${artisanName}.`,
    });
    // In a real app, you would call your backend API here
    // console.log(`User ${newFollowState ? 'followed' : 'unfollowed'} artisan ${artisanId}`);
  };

  return (
    <Button 
      variant={isFollowing ? "outline" : "default"} 
      className={isFollowing ? "text-primary border-primary hover:bg-primary/10" : "bg-primary hover:bg-primary/90"}
      onClick={handleFollowToggle}
      disabled={isLoading}
    >
      {isLoading ? (
        <Loader2 size={18} className="mr-2 animate-spin" />
      ) : isFollowing ? (
        <UserCheck size={18} className="mr-2" />
      ) : (
        <UserPlus size={18} className="mr-2" />
      )}
      {isLoading ? "Processing..." : isFollowing ? "Following" : "Follow Artisan"}
    </Button>
  );
}
