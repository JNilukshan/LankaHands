
"use client";

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MessageCircle } from 'lucide-react';

interface ArtisanContactButtonProps {
  artisanId: string;
}

export default function ArtisanContactButton({ artisanId }: ArtisanContactButtonProps) {
  const { currentUser } = useAuth();

  // If the current user is the artisan being viewed, don't show the contact button.
  if (currentUser && currentUser.id === artisanId) {
    return null;
  }

  return (
    <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
      <Link href={`/artisans/${artisanId}/contact`}>
        <MessageCircle size={18} className="mr-2" />
        Contact Artisan
      </Link>
    </Button>
  );
}
