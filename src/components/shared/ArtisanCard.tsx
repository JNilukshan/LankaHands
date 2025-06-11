
import Image from 'next/image';
import Link from 'next/link';
import type { Artisan } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin } from 'lucide-react';

interface ArtisanCardProps {
  artisan: Artisan;
}

const ArtisanCard: React.FC<ArtisanCardProps> = ({ artisan }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          <Image
            src={artisan.profileImageUrl}
            alt={artisan.name}
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint="artisan portrait"
          />
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-1 text-primary">{artisan.name}</CardTitle>
        {artisan.speciality && <CardDescription className="text-sm text-accent mb-2">{artisan.speciality}</CardDescription>}
        <p className="text-sm text-foreground/80 line-clamp-3 mb-2">
          {artisan.bio}
        </p>
        {artisan.location && (
          <div className="flex items-center text-xs text-muted-foreground mb-1">
            <MapPin size={14} className="mr-1 text-primary" />
            {artisan.location}
          </div>
        )}
        {artisan.followers !== undefined && (
           <div className="flex items-center text-xs text-muted-foreground">
            <Users size={14} className="mr-1 text-primary" />
            {artisan.followers} followers
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full text-primary border-primary hover:bg-primary/10" asChild>
          <Link href={`/artisans/${artisan.id}`}>View Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ArtisanCard;
