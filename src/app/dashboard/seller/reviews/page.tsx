
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/shared/StarRating';
import { MessageSquare, UserCircle2 } from 'lucide-react';
import type { Review } from '@/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Define a more specific type for reviews in this component
type ReviewWithProductInfo = Review & { productName: string, productImageUrl?: string };

// Mock data for reviews
const initialMockReviews: ReviewWithProductInfo[] = [
  { id: 'rev1', userId: 'userA', userName: 'Chandima P.', userAvatar: 'https://placehold.co/40x40.png', productId: 'prod1', rating: 5, comment: 'Absolutely beautiful saree! The quality is amazing and the colors are even more vibrant in person. Highly recommend this artisan.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), productName: 'Ocean Breeze Batik Saree', productImageUrl: 'https://placehold.co/60x60.png' },
  { id: 'rev2', userId: 'userB', userName: 'Rohan S.', userAvatar: 'https://placehold.co/40x40.png', productId: 'prod2', rating: 4, comment: 'The elephant statue is very well-carved. There was a slight delay in shipping but the seller was communicative. Overall, happy with the purchase.', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), productName: 'Hand-Carved Elephant Statue', productImageUrl: 'https://placehold.co/60x60.png' },
  { id: 'rev3', userId: 'userC', userName: 'Fathima Z.', productId: 'prod1', rating: 5, comment: 'I bought this for my mother and she loved it. The batik work is truly an art. Thank you Nimali Perera!', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), productName: 'Ocean Breeze Batik Saree', productImageUrl: 'https://placehold.co/60x60.png' },
  { id: 'rev4', userId: 'userD', userName: 'David L.', productId: 'prod3', rating: 3, comment: 'Nice terracotta vases, but one had a small chip. Seller offered a partial refund.', createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), productName: 'Terracotta Clay Vase Set', productImageUrl: 'https://placehold.co/60x60.png' },
  { id: 'rev5', userId: 'userE', userName: 'Priya M.', userAvatar: 'https://placehold.co/40x40.png', productId: 'prod2', rating: 5, comment: 'Excellent craftsmanship on the elephant statue. It\'s a centerpiece in my living room now!', createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(), productName: 'Hand-Carved Elephant Statue', productImageUrl: 'https://placehold.co/60x60.png' },
];

// Create a unique list of products for the filter dropdown
const productFilterOptions = [
  { value: 'all-products', label: 'All Products' },
  ...Array.from(new Set(initialMockReviews.map(review => review.productId)))
    .map(productId => {
      const review = initialMockReviews.find(r => r.productId === productId);
      return { value: productId, label: review ? review.productName : productId };
    })
];

const ratingFilterOptions = [
  { value: 'all-ratings', label: 'All Ratings' },
  { value: '5', label: '5 Stars' },
  { value: '4', label: '4 Stars' },
  { value: '3', label: '3 Stars' },
  { value: '2', label: '2 Stars' },
  { value: '1', label: '1 Star' },
];

export default function ViewReviewsPage() {
  const [allReviews, setAllReviews] = useState<ReviewWithProductInfo[]>([]);
  const [displayedReviews, setDisplayedReviews] = useState<ReviewWithProductInfo[]>([]);
  const [productFilter, setProductFilter] = useState<string>('all-products');
  const [ratingFilter, setRatingFilter] = useState<string>('all-ratings');

  useEffect(() => {
    // Simulate fetching reviews
    setAllReviews(initialMockReviews);
  }, []);

  useEffect(() => {
    let newFilteredReviews = [...allReviews];

    if (productFilter !== 'all-products') {
      newFilteredReviews = newFilteredReviews.filter(review => review.productId === productFilter);
    }

    if (ratingFilter !== 'all-ratings') {
      const numericRating = parseInt(ratingFilter, 10);
      newFilteredReviews = newFilteredReviews.filter(review => review.rating === numericRating);
    }

    setDisplayedReviews(newFilteredReviews);
  }, [productFilter, ratingFilter, allReviews]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center">
          <MessageSquare size={32} className="mr-3 text-accent" /> Customer Reviews
        </h1>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>See what customers are saying about your products.</CardDescription>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Select value={productFilter} onValueChange={setProductFilter}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by Product" />
              </SelectTrigger>
              <SelectContent>
                {productFilterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Rating" />
              </SelectTrigger>
              <SelectContent>
                {ratingFilterOptions.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {/* "Apply Filters" button removed as filters apply live */}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {displayedReviews.length > 0 ? (
            displayedReviews.map(review => (
              <Card key={review.id} className="shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={review.userAvatar} alt={review.userName} data-ai-hint="person avatar" />
                      <AvatarFallback className="bg-muted text-muted-foreground">
                         {review.userName ? review.userName.substring(0,2).toUpperCase() : <UserCircle2 />}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                        <h4 className="font-semibold text-foreground">{review.userName}</h4>
                        <span className="text-xs text-muted-foreground mt-1 sm:mt-0">{new Date(review.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="mb-2">
                        <StarRating rating={review.rating} size={18} />
                      </div>
                      <p className="text-sm text-foreground/90 leading-relaxed mb-3">
                        <span className="font-semibold">Review for: </span> 
                        <span className="text-primary hover:underline cursor-pointer">{review.productName}</span>
                      </p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{review.comment}</p>
                      {/* "Reply to Review" button removed */}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No reviews match your current filters.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
