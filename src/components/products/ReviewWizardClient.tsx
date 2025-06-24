
"use client";

import { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import StarRating from '@/components/shared/StarRating';
import { Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { submitReview, type SubmitReviewData } from '@/services/reviewService';


const reviewSchema = z.object({
  overallRating: z.number().min(1, { message: "Please provide a star rating."}).max(5),
  reviewTitle: z.string().max(100, { message: "Review title cannot exceed 100 characters." }).optional(),
  comment: z.string().min(10, { message: "Review must be at least 10 characters." }),
});

type ReviewFormValues = z.infer<typeof reviewSchema>;

interface ReviewWizardClientProps {
  productName: string;
  productId: string;
}

const ReviewWizardClient: React.FC<ReviewWizardClientProps> = ({ productName, productId }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const router = useRouter();

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      overallRating: 0,
      reviewTitle: "",
      comment: "",
    },
  });

  const onSubmit = async (data: ReviewFormValues) => {
    if (!currentUser) {
        toast({ title: "Login Required", description: "You must be logged in to submit a review.", variant: "destructive" });
        router.push('/login');
        return;
    }

    setIsSubmitting(true);
    
    const reviewData: SubmitReviewData = {
        productId: productId,
        userId: currentUser.id,
        userName: currentUser.name,
        userAvatar: currentUser.profileImageUrl,
        rating: data.overallRating,
        reviewTitle: data.reviewTitle || '',
        comment: data.comment,
    };
    
    const result = await submitReview(reviewData);

    setIsSubmitting(false);

    if (result.success) {
        toast({
            title: "Review Submitted!",
            description: result.message,
        });
        router.push(`/products/${productId}`);
    } else {
        toast({
            title: "Error",
            description: result.message,
            variant: "destructive",
        });
    }
  };


  return (
    <Card className="max-w-2xl mx-auto shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">Write a Review for {productName}</CardTitle>
        <CardDescription>
          Tell us about your experience. Your feedback helps other shoppers and supports our artisans.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="overallRating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-semibold">Overall Rating*</FormLabel>
                  <FormControl>
                    <StarRating rating={field.value} onRatingChange={field.onChange} interactive size={28} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="reviewTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-semibold">Review Title (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Beautiful Craftsmanship!" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md font-semibold">Your Detailed Review*</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={5} 
                      placeholder="Share your thoughts about the product..." 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-primary/90">
              {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Submit Review
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};

export default ReviewWizardClient;
