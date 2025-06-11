
"use client"; // Required for hooks like useCart

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
import { useCart } from '@/context/CartContext'; // Import useCart
import React, { useState, useEffect } from 'react'; // For client-side data fetching simulation

// Placeholder data - in a real app, this would be fetched based on [id]
const getProductDetails = async (id: string): Promise<Product | null> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const sampleArtisans: Record<string, Artisan> = {
    '1': { 
      id: '1', name: 'Nimali Perera', 
      bio: 'A passionate artisan from Kandy, specializing in vibrant Batik designs that tell stories of Sri Lankan culture and nature. Each piece is meticulously handcrafted with traditional techniques passed down through generations.', 
      profileImageUrl: 'https://placehold.co/100x100.png', 
      speciality: 'Batik Art',
      location: 'Kandy, Sri Lanka'
    },
    '2': {
      id: '2', name: 'Ravi Fernando',
      bio: 'Crafting exquisite wooden sculptures inspired by nature and local folklore. Using sustainably sourced timber.',
      profileImageUrl: 'https://placehold.co/100x100.png',
      speciality: 'Wood Carver',
      location: 'Galle, Sri Lanka'
    },
    '3': {
      id: '3', name: 'Sita Devi',
      bio: 'Weaving vibrant handloom textiles that blend intricate patterns with contemporary designs. Passionate about preserving ancient weaving techniques.',
      profileImageUrl: 'https://placehold.co/100x100.png',
      speciality: 'Handloom Weaver',
      location: 'Jaffna, Sri Lanka'
    },
    '4': {
      id: '4', name: 'Kamal Pottery',
      bio: 'Creating earthy and functional terracotta pottery, blending traditional forms with modern utility.',
      profileImageUrl: 'https://placehold.co/100x100.png',
      speciality: 'Pottery',
      location: 'Matale, Sri Lanka'
    },
    '5': {
      id: '5', name: 'Anusha Silvercraft',
      bio: 'Designing and crafting intricate silver filigree jewelry, inspired by ancient Kandyan designs.',
      profileImageUrl: 'https://placehold.co/100x100.png',
      speciality: 'Silver Jewelry',
      location: 'Colombo, Sri Lanka'
    },
    '6': {
        id: '6', name: 'Sustainable Leather Co.',
        bio: 'Makers of fine, hand-stitched leather goods using ethically sourced materials and recycled paper.',
        profileImageUrl: 'https://placehold.co/100x100.png',
        speciality: 'Leather Craft',
        location: 'Negombo, Sri Lanka'
    }
  };

  const sampleReviews: Record<string, Review[]> = {
    '101': [
      { id: 'r1', userId: 'u1', userName: 'Aisha K.', userAvatar: 'https://placehold.co/40x40.png', productId: '101', rating: 5, comment: 'Absolutely stunning! The colors are so vibrant and the quality is exceptional. Arrived beautifully packaged.', createdAt: '2023-04-15T10:30:00Z' },
      { id: 'r2', userId: 'u2', userName: 'Ben S.', userAvatar: 'https://placehold.co/40x40.png', productId: '101', rating: 4, comment: 'Great product, very well made. Delivery was a bit slow but worth the wait.', createdAt: '2023-04-18T14:00:00Z' },
    ],
    '106': [
        { id: 'r3', userId: 'u3', userName: 'Chloe T.', userAvatar: 'https://placehold.co/40x40.png', productId: '106', rating: 5, comment: 'I love it! The artisan was very communicative and the piece is even more beautiful in person.', createdAt: '2023-04-20T09:15:00Z' },
    ]
  };

  const productsData: Record<string, Product> = {
    '101': { 
      id: '101', name: 'Ocean Breeze Batik Saree', 
      description: 'Elegant silk saree with hand-painted Batik motifs depicting ocean waves.',
      longDescription: "This exquisite Ocean Breeze Batik Saree is crafted from the finest silk, featuring intricate hand-painted Batik motifs that evoke the serene beauty of Sri Lankan coastlines. The flowing design and vibrant blues and greens make it a perfect statement piece for any special occasion. Each saree is a unique work of art, reflecting hours of meticulous craftsmanship.",
      price: 120.00, category: 'Apparel', 
      images: [
        'https://placehold.co/600x800.png', 
        'https://placehold.co/600x400.png', 
        'https://placehold.co/400x600.png', 
        'https://placehold.co/800x600.png'  
      ], 
      artisanId: '1', artisan: sampleArtisans['1'], reviews: sampleReviews['101'],
      stock: 5, dimensions: "6 yards length", materials: ["Pure Silk", "Natural Dyes"]
    },
    '102': {
      id: '102', name: 'Hand-Carved Elephant Statue',
      description: 'Detailed wooden elephant statue, a symbol of wisdom and strength.',
      longDescription: "Crafted from sustainably sourced mahogany, this hand-carved elephant statue showcases the incredible skill of Sri Lankan wood carvers. The intricate details capture the majesty and gentle nature of this revered animal. A perfect addition to any home or office, bringing a touch of Sri Lankan artistry and symbolism.",
      price: 75.00, category: 'Decor',
      images: [
        'https://placehold.co/600x500.png',
        'https://placehold.co/400x300.png',
        'https://placehold.co/500x400.png',
      ],
      artisanId: '2', artisan: sampleArtisans['2'],
      stock: 10, dimensions: "Approx. 8 inches tall", materials: ["Mahogany Wood", "Natural Polish"]
    },
    '103': {
      id: '103', name: 'Sunset Hues Handloom Shawl',
      description: 'Soft and warm handloom shawl in rich sunset colors, perfect for cool evenings.',
      longDescription: "Wrap yourself in the warmth and beauty of this handloom shawl. Woven with care by skilled artisans, it features a stunning gradient of sunset hues – from deep oranges and reds to soft purples. Made from high-quality cotton, it's both soft to the touch and durable. Ideal as a stylish accessory or a cozy companion.",
      price: 55.00, category: 'Accessories',
      images: [
        'https://placehold.co/700x500.png',
        'https://placehold.co/500x350.png',
      ],
      artisanId: '3', artisan: sampleArtisans['3'],
      stock: 0, dimensions: "Approx. 70 x 200 cm", materials: ["Cotton", "Eco-friendly Dyes"]
    },
    '104': {
      id: '104', name: 'Lotus Bloom Batik Wall Hanging',
      description: 'A stunning wall art piece capturing the serene beauty of a lotus flower in Batik.',
      longDescription: "Transform your space with this exquisite Batik wall hanging. Featuring a beautifully detailed lotus bloom, a symbol of purity and enlightenment, this piece is created using traditional Batik techniques on high-quality cotton fabric. The vibrant colors and intricate wax-resist patterns make it a captivating focal point for any room.",
      price: 90.00, category: 'Home Decor',
      images: [
        'https://placehold.co/600x600.png',
        'https://placehold.co/400x400.png',
        'https://placehold.co/300x300.png',
      ],
      artisanId: '1', artisan: sampleArtisans['1'],
      stock: 7, dimensions: "Approx. 60 x 60 cm", materials: ["Cotton Fabric", "Wax", "Natural Dyes"]
    },
    '105': {
      id: '105', name: 'Terracotta Clay Vase Set',
      description: 'Set of 3 handcrafted terracotta vases, perfect for minimalist decor.',
      longDescription: "This set of three terracotta clay vases brings a touch of earthy elegance to your home. Handcrafted by skilled potters, each vase has a unique, slightly rustic charm. Their minimalist design makes them versatile for various decor styles, whether displaying dried flowers or standing alone as sculptural pieces.",
      price: 45.00, category: 'Pottery',
      images: [
        'https://placehold.co/500x700.png',
        'https://placehold.co/400x600.png',
      ],
      artisanId: '4', artisan: sampleArtisans['4'],
      stock: 12, dimensions: "Varying heights: 15cm, 20cm, 25cm", materials: ["Terracotta Clay"]
    },
    '106': {
      id: '106', name: 'Silver Filigree Earrings',
      description: 'Intricate silver filigree earrings, showcasing delicate craftsmanship.',
      longDescription: "Adorn yourself with these stunning silver filigree earrings. Meticulously handcrafted, they feature delicate, lace-like patterns created from fine silver wires. Inspired by traditional Kandyan jewelry, these earrings are lightweight and elegant, perfect for adding a touch of sophistication to any outfit.",
      price: 150.00, category: 'Jewelry',
      images: [
        'https://placehold.co/400x400.png',
        'https://placehold.co/300x300.png',
      ],
      artisanId: '5', artisan: sampleArtisans['5'], reviews: sampleReviews['106'],
      stock: 3, dimensions: "Approx. 2 inches length", materials: ["Sterling Silver"]
    },
    '107': {
      id: '107', name: 'Leather Bound Journal',
      description: 'Hand-stitched leather journal with recycled paper, perfect for notes and sketches.',
      longDescription: "Capture your thoughts, dreams, and sketches in this beautifully crafted leather-bound journal. The cover is made from ethically sourced leather and hand-stitched for durability. Inside, you'll find smooth, recycled paper, making it an eco-conscious choice for writers and artists alike.",
      price: 35.00, category: 'Accessories',
      images: [
        'https://placehold.co/500x500.png',
      ],
      artisanId: '6', artisan: sampleArtisans['6'],
      stock: 20, dimensions: "A5 size (148 x 210 mm)", materials: ["Genuine Leather", "Recycled Paper"]
    },
    '108': {
        id: '108', name: 'Painted Wooden Mask',
        description: 'Traditional Sri Lankan wooden mask, hand-painted with vibrant colors.',
        longDescription: "This traditional Sri Lankan Raksha mask is hand-carved from light Kaduru wood and meticulously hand-painted. Used in cultural dances and rituals, these masks are believed to ward off evil spirits. This piece, depicting the 'Naga Raksha' (Cobra Demon), is a vibrant example of Sri Lankan folk art and makes a striking decorative item.",
        price: 60.00, category: 'Decor',
        images: [
            'https://placehold.co/500x700.png',
            'https://placehold.co/400x600.png',
        ],
        artisanId: '2', artisan: sampleArtisans['2'],
        stock: 0, dimensions: "Approx. 10 inches height", materials: ["Kaduru Wood", "Acrylic Paints"]
    }
  };
  return productsData[id] || null;
};


export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const productId = resolvedParams.id;
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      const fetchedProduct = await getProductDetails(productId);
      setProduct(fetchedProduct);
      setIsLoading(false);
    };
    fetchProduct();
  }, [productId]);

  if (isLoading) {
    // Basic loading state, can be replaced with skeletons
    return <div className="text-center py-10">Loading product details...</div>;
  }

  if (!product) {
    return <div className="text-center py-10">Product not found.</div>;
  }

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1); // Add 1 unit by default
    }
  };

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Image Gallery */}
        <div>
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-xl mb-4">
            <Image src={product.images[0]} alt={product.name} fill style={{ objectFit: 'cover' }} data-ai-hint="product lifestyle" priority />
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images.slice(1, 4).map((img, index) => ( // Show up to 3 thumbnails
              <div key={index} className="relative aspect-square rounded overflow-hidden shadow-md">
                <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} fill style={{ objectFit: 'cover' }} data-ai-hint="product detail" />
              </div>
            ))}
            {/* Add placeholders if fewer than 3 thumbnails to maintain grid structure */}
            {Array.from({ length: Math.max(0, 3 - product.images.slice(1,4).length) }).map((_, i) => (
                <div key={`placeholder-${i}`} className="aspect-square bg-muted/30 rounded"></div>
            ))}
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
              <p className={`text-sm font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 flex-grow" 
              onClick={handleAddToCart}
              disabled={!product.stock || product.stock === 0}
            >
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

