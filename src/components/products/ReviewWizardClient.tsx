
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
import { reviewWizard, type ReviewWizardInput } from '@/ai/flows/review-wizard';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { submitReview, type SubmitReviewData } from '@/services/reviewService';


const reviewWizardSchema = z.object({
  overallRating: z.number().min(1, { message: "Please provide a star rating."}).max(5),
  reviewTitle: z.string().min(3, { message: "Review title must be at least 3 characters."}).max(100, { message: "Review title must be 100 characters or less."}).optional().or(z.literal('')),
  productQuality: z.string().optional(),
  deliverySpeed: z.string().optional(),
  artisanEngagement: z.string().optional(),
  finalReview: z.string().min(20, { message: "The final review must be at least 20 characters." }),
});

type ReviewWizardFormValues = z.infer<typeof reviewWizardSchema>;

interface ReviewWizardClientProps {
  productName: string;
  productId: string;
}

const ReviewWizardClient: React.FC<ReviewWizardClientProps> = ({ productName, productId }) => {
  const [suggestedReview, setSuggestedReview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { currentUser } = useAuth();
  const router = useRouter();

  const form = useForm<ReviewWizardFormValues>({
    resolver: zodResolver(reviewWizardSchema),
    defaultValues: {
      overallRating: 0,
      reviewTitle: "",
      productQuality: "",
      deliverySpeed: "",
      artisanEngagement: "",
      finalReview: "",
    },
  });

  const handleGenerateSuggestion = async () => {
    const values = form.getValues();
    const productQualityForAI = values.productQuality || "";
    const deliverySpeedForAI = values.deliverySpeed || "";
    const artisanEngagementForAI = values.artisanEngagement || "";
    
    if (!productQualityForAI || !deliverySpeedForAI || !artisanEngagementForAI) {
      toast({
        title: "Missing Information for AI Wizard",
        description: "Please fill in details about quality, delivery, and engagement before generating a suggestion.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setSuggestedReview(null);
    try {
      const wizardInput: ReviewWizardInput = {
        productQuality: productQualityForAI,
        deliverySpeed: deliverySpeedForAI,
        artisanEngagement: artisanEngagementForAI,
      };
      const result = await reviewWizard(wizardInput);
      setSuggestedReview(result.reviewSuggestion);
      form.setValue("finalReview", result.reviewSuggestion, { shouldValidate: true });
    } catch (error) {
      console.error("Error generating review suggestion:", error);
      toast({
        title: "Error",
        description: "Failed to generate review suggestion. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmit = async (data: ReviewWizardFormValues) => {
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
        comment: data.finalReview,
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
          Use our AI wizard to help craft your review!
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
                    <Input placeholder="e.g., Beautiful Craftsmanship!" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-semibold font-headline mb-2 text-foreground">AI Review Assistant (Optional)</h3>
              <p className="text-sm text-muted-foreground mb-4">To use the AI assistant, please provide details below and click "Generate".</p>
            </div>

            <FormField
              control={form.control}
              name="productQuality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Quality (for AI)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the materials, craftsmanship, and overall quality..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliverySpeed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Delivery Speed & Packaging (for AI)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="How was the delivery time? Was the item packaged well?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="artisanEngagement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Artisan Engagement (if any, for AI)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Did you interact with the artisan? How was the communication?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="button" onClick={handleGenerateSuggestion} disabled={isLoading} className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground">
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
              Generate Review Suggestion
            </Button>

            <FormField
              control={form.control}
              name="finalReview"
              render={({ field }) => (
                <FormItem className="mt-6 pt-4 border-t">
                  <FormLabel className="text-md font-semibold">Your Detailed Review*</FormLabel>
                  <FormControl>
                    <Textarea 
                      rows={suggestedReview ? 8 : 5} 
                      placeholder={suggestedReview ? "Your generated review will appear here. Feel free to edit it." : "Share your thoughts about the product..."} 
                      {...field} 
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting || isLoading} className="w-full bg-primary hover:bg-primary/90">
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
