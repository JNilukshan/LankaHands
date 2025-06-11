
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/shared/StarRating';
import type { Product, Artisan, Review } from '@/types';
import Link from 'next/link';
import { Heart, MessageSquare, PlusCircle, ShoppingCart, UserCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';


// Placeholder data - in a real app, this would be fetched based on [id]
const getProductDetails = async (id: string): Promise<Product | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const sampleArtisan: Artisan = {
    id: '1', name: 'Nimali Perera', bio: 'A passionate artisan from Kandy, specializing in vibrant Batik designs that tell stories of Sri Lankan culture and nature. Each piece is meticulously handcrafted with traditional techniques passed down through generations.', 
    profileImageUrl: 'https://placehold.co/100x100.png', 
    speciality: 'Batik Art',
    location: 'Kandy, Sri Lanka'
  };

  const sampleReviews: Review[] = [
    { id: 'r1', userId: 'u1', userName: 'Aisha K.', userAvatar: 'https://placehold.co/40x40.png', productId: id, rating: 5, comment: 'Absolutely stunning! The colors are so vibrant and the quality is exceptional. Arrived beautifully packaged.', createdAt: '2023-04-15T10:30:00Z' },
    { id: 'r2', userId: 'u2', userName: 'Ben S.', userAvatar: 'https://placehold.co/40x40.png', productId: id, rating: 4, comment: 'Great product, very well made. Delivery was a bit slow but worth the wait.', createdAt: '2023-04-18T14:00:00Z' },
    { id: 'r3', userId: 'u3', userName: 'Chloe T.', userAvatar: 'https://placehold.co/40x40.png', productId: id, rating: 5, comment: 'I love it! The artisan was very communicative and the piece is even more beautiful in person.', createdAt: '2023-04-20T09:15:00Z' },
  ];

  const products: Record<string, Product> = {
    '101': { 
      id: '101', name: 'Ocean Breeze Batik Saree', 
      description: 'Elegant silk saree with hand-painted Batik motifs depicting ocean waves.',
      longDescription: "This exquisite Ocean Breeze Batik Saree is crafted from the finest silk, featuring intricate hand-painted Batik motifs that evoke the serene beauty of Sri Lankan coastlines. The flowing design and vibrant blues and greens make it a perfect statement piece for any special occasion. Each saree is a unique work of art, reflecting hours of meticulous craftsmanship.",
      price: 120.00, category: 'Apparel', 
      images: [
        'https://placehold.co/600x800.png', // Main image
        'https://placehold.co/600x400.png', // Thumbnail 1
        'https://placehold.co/400x600.png', // Thumbnail 2
        'https://placehold.co/800x600.png'  // Thumbnail 3
      ], 
      artisanId: '1', artisan: sampleArtisan, reviews: sampleReviews,
      stock: 5, dimensions: "6 yards length", materials: ["Pure Silk", "Natural Dyes"]
    },
    // Add more products if needed for testing different IDs
  };
  return products[id] || null;
};


export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductDetails(params.id);

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Image Gallery */}
        <div>
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-xl mb-4">
            <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} data-ai-hint="product lifestyle" />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images.slice(1).map((img, index) => (
              <div key={index} className="relative aspect-square rounded overflow-hidden shadow-md">
                <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} fill style={{ objectFit: 'cover' }} data-ai-hint="product detail" />
              </div>
            ))}
            {product.images.length < 2 && <div className="aspect-square bg-muted rounded"></div>}
            {product.images.length < 3 && <div className="aspect-square bg-muted rounded"></div>}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl font-headline font-bold text-primary">{product.name}</h1>
          
          {product.artisan && (
            <Link href={`/artisans/${product.artisan.id}`} className="text-md text-accent hover:underline">
              By {product.artisan.name}
            </Link>
          )}

          <div className="flex items-center space-x-2">
            {averageRating > 0 && <StarRating rating={averageRating} size={24} />}
            <span className="text-sm text-muted-foreground">({product.reviews?.length || 0} reviews)</span>
          </div>

          <p className="text-3xl font-semibold text-primary">${product.price.toFixed(2)}</p>
          
          <p className="text-foreground/80 leading-relaxed">{product.longDescription || product.description}</p>

          {product.materials && product.materials.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Materials:</h3>
              <div className="flex flex-wrap gap-2">
                {product.materials.map(material => <Badge key={material} variant="secondary">{material}</Badge>)}
              </div>
            </div>
          )}
          {product.dimensions && (
             <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Dimensions:</h3>
              <p className="text-sm text-muted-foreground">{product.dimensions}</p>
            </div>
          )}
           {product.stock !== undefined && (
             <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Availability:</h3>
              <p className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button size="lg" className="bg-primary hover:bg-primary/90 flex-grow" disabled={!product.stock || product.stock === 0}>
              <ShoppingCart size={20} className="mr-2"/> Add to Cart
            </Button>
            <Button size="lg" variant="outline" className="text-primary border-primary hover:bg-primary/10 flex-grow">
              <Heart size={20} className="mr-2"/> Add to Wishlist
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Artisan Bio Section */}
      {product.artisan && (
        <section>
          <h2 className="text-2xl font-headline font-semibold mb-6 text-primary">Meet the Artisan</h2>
          <Card className="shadow-lg">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary">
                <AvatarImage src={typeof product.artisan.profileImageUrl === 'string' ? product.artisan.profileImageUrl : undefined} alt={product.artisan.name} data-ai-hint="artisan portrait" />
                <AvatarFallback>{product.artisan.name.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <CardTitle className="text-xl font-headline text-accent mb-1">{product.artisan.name}</CardTitle>
                {product.artisan.speciality && <CardDescription className="text-sm text-muted-foreground mb-2">{product.artisan.speciality} from {product.artisan.location}</CardDescription>}
                <p className="text-sm text-foreground/80 leading-relaxed mb-3">{product.artisan.bio}</p>
                <Button variant="link" className="p-0 h-auto text-primary" asChild>
                  <Link href={`/artisans/${product.artisan.id}`}>View Artisan Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}

      <Separator />

      {/* Community Reviews Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-headline font-semibold text-primary">Community Reviews</h2>
          <Button variant="default" className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <Link href={`/products/${product.id}/review`}>
              <PlusCircle size={18} className="mr-2"/> Write a Review
            </Link>
          </Button>
        </div>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map(review => (
              <Card key={review.id} className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={typeof review.userAvatar === 'string' ? review.userAvatar : undefined} alt={review.userName} data-ai-hint="person avatar"/>
                      <AvatarFallback>
                        {review.userName ? review.userName.substring(0,2).toUpperCase() : <UserCircle2/>}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground">{review.userName}</h4>
                        <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <StarRating rating={review.rating} size={18} className="mb-2" />
                      <p className="text-sm text-foreground/80 leading-relaxed">{review.comment}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-4">No reviews yet. Be the first to share your thoughts!</p>
        )}
      </section>
    </div>
  );
}
