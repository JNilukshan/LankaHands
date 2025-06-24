
"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import StarRating from '@/components/shared/StarRating';
import type { Product, Artisan, Review } from '@/types'; // Keep Review for display
import Link from 'next/link';
import { Heart, MessageSquare, PlusCircle, ShoppingCart, UserCircle2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from "@/hooks/use-toast";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
// Mock data import (getMockProductById) is no longer needed here as product is passed as prop

interface ProductViewProps {
  product: Product | null; // Product can be null if not found
}

export default function ProductView({ product }: ProductViewProps) {
  const [isLoadingWishlist, setIsLoadingWishlist] = useState(false);
  const { addToCart } = useCart();
  const { currentUser, addToWishlist, removeFromWishlist, isProductInWishlist } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [mainImage, setMainImage] = useState<string | null>(null);

  useEffect(() => {
    if (product && product.images.length > 0) {
      setMainImage(product.images[0]);
    } else if (product === null) {
      setMainImage(null); // Handle case where product is not found
    } else {
      setMainImage('https://placehold.co/600x400.png'); // Default placeholder if product has no images
    }
  }, [product]);


  if (!product) {
    // This case should ideally be handled by the parent Server Component (e.g., showing a 404 page)
    // But as a fallback within the client component:
    return <div className="text-center py-10">Product not found.</div>;
  }

  const handleAddToCart = () => {
    addToCart(product, 1);
  };

  const handleWishlistToggle = async () => {
    if (!currentUser) {
      toast({ title: "Please Login", description: "You need to be logged in to manage your wishlist.", variant: "destructive" });
      router.push('/login');
      return;
    }

    setIsLoadingWishlist(true);
    if (isProductInWishlist(product.id)) {
      await removeFromWishlist(product.id);
    } else {
      await addToWishlist(product.id);
    }
    setIsLoadingWishlist(false);
  };

  const handleWriteReviewClick = () => {
    if (currentUser) {
      router.push(`/products/${product.id}/review`);
    } else {
      toast({
        title: "Login Required",
        description: "Please log in to write a review.",
        variant: "default",
      });
      router.push('/login');
    }
  };

  const averageRating = product.reviews && product.reviews.length > 0
    ? product.reviews.reduce((acc, review) => acc + review.rating, 0) / product.reviews.length
    : 0;

  const productIsInWishlist = currentUser ? isProductInWishlist(product.id) : false;

  return (
    <div className="space-y-12">
      <div className="grid md:grid-cols-2 gap-8 items-start">
        {/* Image Gallery */}
        <div>
          <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden shadow-xl mb-4">
            {mainImage ? (
                <Image src={mainImage} alt={product.name} fill style={{ objectFit: 'cover' }} data-ai-hint="product lifestyle" priority />
            ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                    <p className="text-muted-foreground">No image</p>
                </div>
            )}
          </div>
          <div className="grid grid-cols-3 gap-2">
            {product.images.map((img, index) => (
              <div
                key={index}
                className={cn(
                  "relative aspect-square rounded overflow-hidden shadow-md cursor-pointer transition-all duration-200",
                  mainImage === img ? "ring-2 ring-primary ring-offset-2" : "hover:opacity-80"
                )}
                onClick={() => setMainImage(img)}
              >
                <Image src={img} alt={`${product.name} thumbnail ${index + 1}`} fill style={{ objectFit: 'cover' }} data-ai-hint="product detail" />
              </div>
            ))}
            {product.images.length < 3 && Array.from({ length: Math.max(0, 3 - product.images.length) }).map((_, i) => (
                <div key={`placeholder-thumb-${i}`} className="aspect-square bg-muted/30 rounded"></div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <h1 className="text-4xl font-headline font-bold text-primary">{product.name}</h1>

          {product.artisanName && product.artisanId && (
            <Link href={`/artisans/${product.artisanId}`} className="text-md text-accent hover:underline">
              By {product.artisanName}
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
            <Button
              size="lg"
              variant="outline"
              className={cn(
                "border-primary flex-grow",
                productIsInWishlist ? "text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive" : "text-primary hover:bg-primary/10"
              )}
              onClick={handleWishlistToggle}
              disabled={isLoadingWishlist}
            >
              <Heart size={20} className="mr-2" fill={productIsInWishlist ? "currentColor" : "none"} />
              {isLoadingWishlist ? "Updating..." : (productIsInWishlist ? "Remove from Wishlist" : "Add to Wishlist")}
            </Button>
          </div>
        </div>
      </div>

      <Separator />

      {/* Artisan section temporarily removed as full artisan object might not be directly on product anymore */}
      {/* We can add a call to fetch artisan details separately if needed */}
      {product.artisanId && product.artisanName && (
         <section>
          <h2 className="text-2xl font-headline font-semibold mb-6 text-primary">About the Artisan</h2>
          <Card className="shadow-lg">
            <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
              <Avatar className="h-24 w-24 border-2 border-primary">
                {/* Placeholder for artisan image - fetch separately if needed */}
                <AvatarFallback>{product.artisanName.substring(0,2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center md:text-left">
                <CardTitle className="text-xl font-headline text-accent mb-1">{product.artisanName}</CardTitle>
                {/* More artisan details would require fetching the Artisan object */}
                <Button variant="link" className="p-0 h-auto text-primary" asChild>
                  <Link href={`/artisans/${product.artisanId}`}>View Artisan Profile</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}


      <Separator />

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-headline font-semibold text-primary">Community Reviews</h2>
          <Button
            variant="default"
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handleWriteReviewClick}
          >
            <PlusCircle size={18} className="mr-2"/> Write a Review
          </Button>
        </div>
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-6">
            {product.reviews.map(review => (
              <Card key={review.id} className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarImage src={review.userAvatar} alt={review.userName} data-ai-hint="person avatar"/>
                      <AvatarFallback className="bg-black text-white font-semibold">
                        {review.userName ? review.userName.substring(0,2).toUpperCase() : <UserCircle2/>}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold text-foreground">{review.userName}</h4>
                        <span className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <StarRating rating={review.rating} size={18} className="mb-2" />
                      {review.reviewTitle && <h5 className="font-medium text-md mb-1">{review.reviewTitle}</h5>}
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
