
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/shared/ProductCard';
// StarRating import can be removed if averageRating is directly from artisan object
import type { Artisan, Product } from '@/types';
import Link from 'next/link';
import { Award, MapPin, MessageCircle, Users, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ArtisanFollowButton from '@/components/artisans/ArtisanFollowButton'; 
import { getArtisanById } from '@/services/artisanService'; // Updated
import { getProductsByArtisanId } from '@/services/productService'; // Updated, assumes this function exists
import { notFound } from 'next/navigation';

export default async function ArtisanProfilePage({ params }: { params: { id: string } }) {
  const artisan = await getArtisanById(params.id);

  if (!artisan) {
    notFound(); // Use Next.js notFound for 404
  }

  // Fetch products by this artisan
  const artisanProducts = await getProductsByArtisanId(artisan.id);
  
  // Use averageRating directly from artisan object if available, otherwise calculate or default
  const averageRating = artisan.averageRating || 0;


  return (
    <div className="space-y-12">
      {/* Artisan Header Section */}
      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-56 md:h-72 bg-gradient-to-r from-primary/20 to-accent/20">
          <Image 
            src={artisan.bannerImageUrl || "https://placehold.co/1200x400.png"} // Use bannerImageUrl or placeholder
            alt={`${artisan.name} banner`} 
            fill
            style={{ objectFit: 'cover' }} 
            className="opacity-70"
            data-ai-hint="craft workshop"
          />
        </div>
        <CardContent className="p-8 -mt-20 md:-mt-24 relative z-10">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6">
            <Avatar className="h-36 w-36 md:h-44 md:w-44 border-4 border-background shadow-lg bg-muted">
              <AvatarImage src={typeof artisan.profileImageUrl === 'string' ? artisan.profileImageUrl : undefined} alt={artisan.name} data-ai-hint="artisan portrait"/>
              <AvatarFallback className="text-4xl bg-primary text-primary-foreground">
                {artisan.name.substring(0,2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-headline font-bold text-primary">{artisan.name}</h1>
              <p className="text-lg text-accent font-semibold">{artisan.speciality}</p>
              <div className="flex items-center justify-center md:justify-start space-x-2 mt-1 text-sm text-muted-foreground">
                <MapPin size={16} className="text-primary" />
                <span>{artisan.location}</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-stretch mt-4 md:mt-0 w-full sm:w-auto">
                <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Link href={`/artisans/${artisan.id}/contact`}>
                    <MessageCircle size={18} className="mr-2" />
                    Contact Artisan
                  </Link>
                </Button>
                <ArtisanFollowButton artisanId={artisan.id} artisanName={artisan.name} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* About Artisan Section */}
        <Card className="md:col-span-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-headline text-primary">About {artisan.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{artisan.bio}</p>
          </CardContent>
        </Card>

        {/* Artisan Stats Section */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-headline text-primary">Artisan Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center">
              <Star size={20} className="mr-2 text-accent" />
              <span><strong>{averageRating.toFixed(1)}</strong> Average Rating</span>
            </div>
            <div className="flex items-center">
              <Users size={20} className="mr-2 text-accent" />
              <span><strong>{artisan.followers || 0}</strong> Followers</span>
            </div>
             <div className="flex items-center">
              <Award size={20} className="mr-2 text-accent" />
              <span><strong>{artisanProducts?.length || 0}</strong> Products Listed</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Products by Artisan Section */}
      <section>
        <h2 className="text-2xl font-headline font-semibold mb-6 text-primary">Creations by {artisan.name}</h2>
        {artisanProducts && artisanProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artisanProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">This artisan hasn&apos;t listed any products yet.</p>
        )}
      </section>
    </div>
  );
}
