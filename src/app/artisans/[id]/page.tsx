
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/shared/ProductCard';
import StarRating from '@/components/shared/StarRating';
import type { Artisan, Product, Review } from '@/types';
import Link from 'next/link';
import { Award, MapPin, MessageCircle, UserPlus, Users, Star } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ArtisanFollowButton from '@/components/artisans/ArtisanFollowButton'; // Import the new component

// Placeholder data - in a real app, this would be fetched based on [id]
const getArtisanDetails = async (id: string): Promise<Artisan | null> => {
  await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API call

  const sampleProductsForNimali: Product[] = [
    { id: 'p1', name: 'Sunrise Batik Kaftan', description: 'Flowy kaftan with sunrise motifs.', price: 85.00, category: 'Apparel', images: ['https://placehold.co/600x400.png'], artisanId: '1', reviews: [{id:'r1', userId:'u1', userName:'Aisha',productId:'p1', rating:5,comment:'Lovely!', createdAt: new Date().toISOString()}]},
    { id: 'p2', name: 'Tropical Leaf Batik Cushion Cover', description: 'Vibrant cushion cover.', price: 30.00, category: 'Home Decor', images: ['https://placehold.co/600x400.png'], artisanId: '1', reviews: [{id:'r2', userId:'u2', userName:'Ben',productId:'p2', rating:4,comment:'Nice design.', createdAt: new Date().toISOString()}]},
    { id: 'p3', name: 'Floral Batik Scarf', description: 'Lightweight silk scarf with floral batik.', price: 45.00, category: 'Accessories', images: ['https://placehold.co/600x400.png'], artisanId: '1'},
  ];
  
  const sampleProductsForLeatherCo: Product[] = [
    { id: 'p107', name: 'Leather Bound Journal', description: 'Hand-stitched leather journal with recycled paper.', price: 35.00, category: 'Accessories', images: ['https://placehold.co/600x400.png'], artisanId: '6' },
    { id: 'p109', name: 'Minimalist Leather Wallet', description: 'Slim leather wallet, hand-stitched.', price: 50.00, category: 'Accessories', images: ['https://placehold.co/600x400.png'], artisanId: '6' },
  ];


  const artisans: Record<string, Artisan> = {
    '1': { 
      id: '1', name: 'Nimali Perera', 
      bio: 'Nimali Perera is a celebrated Batik artist from the historic city of Kandy. With over 20 years of experience, Nimali draws inspiration from Sri Lanka\'s lush landscapes and rich cultural tapestry. Her work is characterized by intricate details, vibrant color palettes, and a fusion of traditional motifs with contemporary aesthetics.', 
      profileImageUrl: 'https://placehold.co/600x400.png', 
      speciality: 'Master Batik Artist',
      location: 'Kandy, Sri Lanka',
      followers: 1250,
      averageRating: 4.9,
      products: sampleProductsForNimali,
    },
    '6': {
        id: '6', name: 'Sustainable Leather Co.',
        bio: 'Makers of fine, hand-stitched leather goods using ethically sourced materials and recycled paper. We believe in minimalist design and maximum durability, creating timeless pieces that age beautifully. Our workshop in Negombo focuses on empowering local craftspeople and promoting sustainable practices within the leather industry.',
        profileImageUrl: 'https://placehold.co/600x400.png',
        speciality: 'Leather Craft & Accessories',
        location: 'Negombo, Sri Lanka',
        followers: 450,
        averageRating: 4.7,
        products: sampleProductsForLeatherCo,
    }
    // Add more artisans if needed for testing different IDs
  };
  return artisans[id] || null;
};

export default async function ArtisanProfilePage({ params }: { params: { id: string } }) {
  const artisan = await getArtisanDetails(params.id);

  if (!artisan) {
    return <div className="text-center py-10">Artisan not found.</div>;
  }
  
  const averageRating = artisan.products?.reduce((acc, product) => {
      const productRating = product.reviews && product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0;
      return acc + productRating;
    }, 0) / (artisan.products?.filter(p => p.reviews && p.reviews.length > 0).length || 1) || artisan.averageRating || 0;


  return (
    <div className="space-y-12">
      {/* Artisan Header Section */}
      <Card className="overflow-hidden shadow-xl">
        <div className="relative h-56 md:h-72 bg-gradient-to-r from-primary/20 to-accent/20">
          <Image 
            src={"https://placehold.co/1200x400.png"} // Generic banner for artisan
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
            <div className="flex flex-col sm:flex-row gap-3 items-center mt-4 md:mt-0">
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
              <span><strong>{artisan.products?.length || 0}</strong> Products Listed</span>
            </div>
            {/* Add more stats if available, e.g., years of experience */}
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Products by Artisan Section */}
      <section>
        <h2 className="text-2xl font-headline font-semibold mb-6 text-primary">Creations by {artisan.name}</h2>
        {artisan.products && artisan.products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {artisan.products.map(product => (
              <ProductCard key={product.id} product={{...product, artisan: {id: artisan.id, name: artisan.name, profileImageUrl: artisan.profileImageUrl, bio: artisan.bio } }} />
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">This artisan hasn&apos;t listed any products yet.</p>
        )}
      </section>
    </div>
  );
}
