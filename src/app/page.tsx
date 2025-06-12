
import ArtisanCard from '@/components/shared/ArtisanCard'; // Will be replaced for the featured section
import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import type { Artisan, Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMockAllArtisans, getMockAllProducts } from '@/lib/mock-data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';


export default async function HomePage() {
  const allArtisans = await getMockAllArtisans();
  const sortedArtisans = [...allArtisans].sort((a, b) => (b.followers || 0) - (a.followers || 0));
  const featuredArtisans = sortedArtisans.slice(0, 3); // Get top 3
  const popularProducts = (await getMockAllProducts()).slice(0, 4);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-10rem)] min-h-[400px] flex items-center justify-center text-center rounded-lg overflow-hidden shadow-xl">
        <Image
          src="https://placehold.co/1200x600.png"
          alt="Sri Lankan crafts hero banner"
          fill
          style={{ objectFit: 'cover' }}
          className="absolute inset-0 z-0 opacity-50"
          data-ai-hint="crafts market"
          priority
        />
        <div className="relative z-10 p-8 bg-background/70 backdrop-blur-sm rounded-md max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-primary mb-4">
            Discover the Heart of Sri Lankan Artistry
          </h1>
          <p className="text-lg md:text-xl text-foreground/80 mb-8">
            Explore unique handcrafted goods from talented local artisans. Each piece tells a story.
          </p>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <Link href="/products">Shop All Collections</Link>
          </Button>
        </div>
      </section>

       {/* Featured Artisans Section - Redesigned */}
      <section>
        <h2 className="text-3xl font-headline font-semibold text-center mb-8 text-primary">
          Meet Our Talented Artisans
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredArtisans.map(artisan => (
            <Card key={artisan.id} className="flex flex-col items-center text-center p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <Avatar className="w-24 h-24 mb-4 border-2 border-primary">
                <AvatarImage src={artisan.profileImageUrl as string} alt={artisan.name} data-ai-hint="artisan portrait" />
                <AvatarFallback>{artisan.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-headline font-semibold text-primary mb-1">{artisan.name}</h3>
              {artisan.speciality && <p className="text-sm text-accent mb-3">{artisan.speciality}</p>}
              <Button variant="outline" className="mt-auto text-primary border-primary hover:bg-primary/10" asChild>
                <Link href={`/artisans/${artisan.id}`}>View Profile</Link>
              </Button>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Products Section */}
      <section>
        <h2 className="text-3xl font-headline font-semibold text-center mb-8 text-primary">
          Popular Handcrafted Treasures
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {popularProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Button variant="outline" className="text-primary border-primary hover:bg-primary/10" asChild>
            <Link href="/products">Explore All Products</Link>
          </Button>
        </div>
      </section>

      {/* Call to Action: Become a Seller */}
      <section className="bg-secondary/30 p-8 md:p-12 rounded-lg text-center">
        <h2 className="text-3xl font-headline font-semibold mb-4 text-primary">Share Your Craft with the World</h2>
        <p className="text-lg text-foreground/80 mb-6 max-w-xl mx-auto">
          Are you a Sri Lankan artisan? Join LankaHands to showcase your unique creations to a global audience.
        </p>
        <Button size="lg" variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
          <Link href="/become-seller">Become a Seller</Link>
        </Button>
      </section>
    </div>
  );
}
