
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import StarRating from '@/components/shared/StarRating';
import { MessageSquare, Filter, UserCircle2 } from 'lucide-react';
import type { Review, Product } from '@/types'; // Assuming Product might be needed for context
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Mock data for reviews
const mockReviews: (Review & { productName: string, productImageUrl?: string })[] = [
  { id: 'rev1', userId: 'userA', userName: 'Chandima P.', userAvatar: 'https://placehold.co/40x40.png', productId: 'prod1', rating: 5, comment: 'Absolutely beautiful saree! The quality is amazing and the colors are even more vibrant in person. Highly recommend this artisan.', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), productName: 'Ocean Breeze Batik Saree', productImageUrl: 'https://placehold.co/60x60.png' },
  { id: 'rev2', userId: 'userB', userName: 'Rohan S.', userAvatar: 'https://placehold.co/40x40.png', productId: 'prod2', rating: 4, comment: 'The elephant statue is very well-carved. There was a slight delay in shipping but the seller was communicative. Overall, happy with the purchase.', createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), productName: 'Hand-Carved Elephant Statue', productImageUrl: 'https://placehold.co/60x60.png' },
  { id: 'rev3', userId: 'userC', userName: 'Fathima Z.', productId: 'prod1', rating: 5, comment: 'I bought this for my mother and she loved it. The batik work is truly an art. Thank you Nimali Perera!', createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), productName: 'Ocean Breeze Batik Saree', productImageUrl: 'https://placehold.co/60x60.png' },
];


export default function ViewReviewsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center">
          <MessageSquare size={32} className="mr-3 text-accent" /> Customer Reviews
        </h1>
        {/* Add filter options later if needed */}
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>All Reviews</CardTitle>
          <CardDescription>See what customers are saying about your products.</CardDescription>
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Select defaultValue="all-products">
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Filter by Product" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-products">All Products</SelectItem>
                <SelectItem value="prod1">Ocean Breeze Batik Saree</SelectItem>
                <SelectItem value="prod2">Hand-Carved Elephant Statue</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all-ratings">
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-ratings">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="text-primary border-primary">
                <Filter size={16} className="mr-2"/> Apply Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {mockReviews.length > 0 ? (
            mockReviews.map(review => (
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
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="text-primary border-primary hover:bg-primary/5">Reply to Review</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <p className="text-muted-foreground text-center py-8">No reviews received yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
