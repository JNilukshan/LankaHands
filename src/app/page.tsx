import ArtisanCard from '@/components/shared/ArtisanCard';
import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import type { Artisan, Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';

// Placeholder data
const featuredArtisans: Artisan[] = [
  { id: '1', name: 'Nimali Perera', bio: 'Specializing in traditional Batik art with a modern twist. Each piece tells a story of Sri Lankan heritage.', profileImageUrl: 'https://placehold.co/400x400.png', speciality: 'Batik Artist', location: 'Kandy, Sri Lanka', followers: 1200 },
  { id: '2', name: 'Ravi Fernando', bio: 'Crafting exquisite wooden sculptures inspired by nature and local folklore. Using sustainably sourced timber.', profileImageUrl: 'https://placehold.co/400x400.png', speciality: 'Wood Carver', location: 'Galle, Sri Lanka', followers: 850 },
  { id: '3', name: 'Sita Devi', bio: 'Weaving vibrant handloom textiles that blend intricate patterns with contemporary designs. Passionate about preserving ancient weaving techniques.', profileImageUrl: 'https://placehold.co/400x400.png', speciality: 'Handloom Weaver', location: 'Jaffna, Sri Lanka', followers: 980 },
];

const popularProducts: Product[] = [
  { id: '101', name: 'Ocean Breeze Batik Saree', description: 'Elegant silk saree with hand-painted Batik motifs depicting ocean waves.', price: 120.00, category: 'Apparel', images: ['https://placehold.co/600x400.png'], artisanId: '1', artisan: featuredArtisans[0] },
  { id: '102', name: 'Hand-Carved Elephant Statue', description: 'Detailed wooden elephant statue, a symbol of wisdom and strength.', price: 75.00, category: 'Decor', images: ['https://placehold.co/600x400.png'], artisanId: '2', artisan: featuredArtisans[1] },
  { id: '103', name: 'Sunset Hues Handloom Shawl', description: 'Soft and warm handloom shawl in rich sunset colors, perfect for cool evenings.', price: 55.00, category: 'Accessories', images: ['https://placehold.co/600x400.png'], artisanId: '3', artisan: featuredArtisans[2] },
  { id: '104', name: 'Lotus Bloom Batik Wall Hanging', description: 'A stunning wall art piece capturing the serene beauty of a lotus flower in Batik.', price: 90.00, category: 'Home Decor', images: ['https://placehold.co/600x400.png'], artisanId: '1', artisan: featuredArtisans[0] },
];

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-10rem)] min-h-[400px] flex items-center justify-center text-center rounded-lg overflow-hidden shadow-xl">
        <Image 
          src="https://placehold.co/1200x600.png" 
          alt="Sri Lankan crafts hero banner" 
          layout="fill" 
          objectFit="cover" 
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

      {/* Featured Artisans Section */}
      <section>
        <h2 className="text-3xl font-headline font-semibold text-center mb-2 text-primary">Featured Artisans</h2>
        <p className="text-center text-muted-foreground mb-8">Meet the skilled hands behind the crafts</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredArtisans.map(artisan => (
            <ArtisanCard key={artisan.id} artisan={artisan} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button variant="outline" className="text-primary border-primary hover:bg-primary/10" asChild>
            <Link href="/artisans">View All Artisans</Link>
          </Button>
        </div>
      </section>

      {/* Popular Products Section */}
      <section>
        <h2 className="text-3xl font-headline font-semibold text-center mb-2 text-primary">Popular Products</h2>
        <p className="text-center text-muted-foreground mb-8">Handpicked favorites from our collections</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {popularProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-8">
          <Button className="bg-primary hover:bg-primary/90" asChild>
            <Link href="/products">Explore More Products</Link>
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
