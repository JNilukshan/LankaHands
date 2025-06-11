
import ArtisanCard from '@/components/shared/ArtisanCard';
import ProductCard from '@/components/shared/ProductCard';
import { Button } from '@/components/ui/button';
import type { Artisan, Product } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Added for new section

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

      {/* The Essence of Sri Lankan Handicrafts Section */}
      <section>
        <h2 className="text-3xl font-headline font-semibold text-center mb-2 text-primary">
          The Essence of Sri Lankan Handicrafts
        </h2>
        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Journey through a vibrant tapestry of tradition, skill, and cultural expression woven into every Sri Lankan handicraft.
        </p>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-foreground/80 leading-relaxed">
              Sri Lanka, an island blessed with rich natural resources and a diverse cultural heritage, boasts an extraordinary legacy of craftsmanship. For centuries, skilled artisans have transformed simple materials into breathtaking works of art, reflecting the island's history, beliefs, and way of life. From the intricate wax-resist dyeing of Batik textiles to the meticulous carving of wood and stone, each craft tells a unique story.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              Discover the vibrant colours of handloom textiles, the earthy charm of traditional pottery, the symbolic power of ceremonial masks, and the delicate beauty of lacework and jewelry. LankaHands brings these timeless traditions to you, connecting you directly with the artisans who keep these invaluable skills alive.
            </p>
            <p className="text-foreground/80 leading-relaxed">
              By choosing a Sri Lankan handicraft, you're not just acquiring a beautiful object; you're supporting a community, preserving a culture, and owning a piece of a story that has been lovingly passed down through generations.
            </p>
          </div>
          <div className="grid grid-rows-2 gap-4">
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://placehold.co/600x338.png"
                alt="Assortment of Sri Lankan crafts"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="batik textiles"
              />
            </div>
            <div className="relative aspect-video rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://placehold.co/600x338.png"
                alt="Artisan working on a craft"
                fill
                style={{ objectFit: 'cover' }}
                data-ai-hint="wood carving"
              />
            </div>
          </div>
        </div>
         <div className="text-center mt-10">
          <Button variant="outline" className="text-primary border-primary hover:bg-primary/10" asChild>
            <Link href="/about">Learn More About Our Mission</Link>
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
