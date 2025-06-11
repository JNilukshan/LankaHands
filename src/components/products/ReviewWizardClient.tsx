"use client";

import { useState, type FormEvent } from 'react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import StarRating from '@/components/shared/StarRating';
import { reviewWizard, type ReviewWizardInput } from '@/ai/flows/review-wizard'; // Assuming this path
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";


const reviewWizardSchema = z.object({
  productQuality: z.string().min(10, { message: "Please describe the product quality in at least 10 characters." }),
  deliverySpeed: z.string().min(10, { message: "Please describe the delivery speed in at least 10 characters." }),
  artisanEngagement: z.string().min(10, { message: "Please describe your engagement with the artisan in at least 10 characters." }),
  overallRating: z.number().min(1).max(5, { message: "Please provide a star rating."}),
  reviewTitle: z.string().min(3, { message: "Review title must be at least 3 characters."}).max(100, { message: "Review title must be 100 characters or less."}),
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

  const form = useForm<ReviewWizardFormValues>({
    resolver: zodResolver(reviewWizardSchema),
    defaultValues: {
      productQuality: "",
      deliverySpeed: "",
      artisanEngagement: "",
      overallRating: 0,
      reviewTitle: "",
    },
  });

  const handleGenerateSuggestion = async () => {
    const values = form.getValues();
    const inputValid = await form.trigger(["productQuality", "deliverySpeed", "artisanEngagement"]);

    if (!inputValid) {
      toast({
        title: "Missing Information",
        description: "Please fill in details about quality, delivery, and engagement before generating a suggestion.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setSuggestedReview(null);
    try {
      const wizardInput: ReviewWizardInput = {
        productQuality: values.productQuality,
        deliverySpeed: values.deliverySpeed,
        artisanEngagement: values.artisanEngagement,
      };
      const result = await reviewWizard(wizardInput);
      setSuggestedReview(result.reviewSuggestion);
      form.setValue("finalReview", result.reviewSuggestion, { shouldValidate: true }); // Set value for finalReview field
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
  
  // Add finalReview to the schema for the second part of the form
  const finalReviewSchema = reviewWizardSchema.extend({
    finalReview: z.string().min(20, { message: "Review must be at least 20 characters." }),
  });
  type FinalReviewFormValues = z.infer<typeof finalReviewSchema>;


  const onSubmit = async (data: FinalReviewFormValues) => {
    setIsSubmitting(true);
    console.log("Submitting review:", { productId, ...data });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Review Submitted!",
      description: `Thank you for your review of ${productName}.`,
    });
    form.reset();
    setSuggestedReview(null);
    setIsSubmitting(false);
    // Potentially redirect user or update UI
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
                  <FormLabel className="text-md font-semibold">Overall Rating</FormLabel>
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
                  <FormLabel className="text-md font-semibold">Review Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Beautiful Craftsmanship!" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <h3 className="text-lg font-semibold font-headline mb-2 text-foreground">AI Review Assistant</h3>
              <p className="text-sm text-muted-foreground mb-4">Provide some details and let our AI help you write a thoughtful review.</p>
            </div>

            <FormField
              control={form.control}
              name="productQuality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Quality</FormLabel>
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
                  <FormLabel>Delivery Speed & Packaging</FormLabel>
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
                  <FormLabel>Artisan Engagement (if any)</FormLabel>
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

            {suggestedReview && (
              <FormField
                control={form.control}
                name="finalReview"
                render={({ field }) => (
                  <FormItem className="mt-6 pt-4 border-t">
                    <FormLabel className="text-md font-semibold">Your Review (edit as needed)</FormLabel>
                    <FormControl>
                      <Textarea rows={8} placeholder="Your generated review will appear here. Feel free to edit it." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            {!suggestedReview && (
                 <FormField
                    control={form.control}
                    name="finalReview" // Use a different name or ensure it's conditionally rendered based on suggestedReview
                    render={({ field }) => (
                    <FormItem className="mt-6 pt-4 border-t">
                        <FormLabel className="text-md font-semibold">Or Write Your Own Review</FormLabel>
                        <FormControl>
                        <Textarea rows={5} placeholder="Share your thoughts about the product..." {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={isSubmitting || isLoading || form.getValues("overallRating") === 0} className="w-full bg-primary hover:bg-primary/90">
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
