"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Store, CheckCircle, TrendingUp } from "lucide-react";
import Image from "next/image";

const sellerApplicationSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  email: z.string().email({ message: "Valid email is required." }),
  phoneNumber: z.string().min(10, { message: "Valid phone number is required." }),
  brandName: z.string().min(2, { message: "Brand name is required." }),
  craftCategory: z.string().min(3, { message: "Please specify your craft category." }),
  portfolioLink: z.string().url({ message: "Please enter a valid URL (e.g., Instagram, website)." }).optional().or(z.literal('')),
  motivation: z.string().min(50, { message: "Please tell us more about your craft and why you want to join (min 50 characters)." }),
});

type SellerApplicationValues = z.infer<typeof sellerApplicationSchema>;

export default function BecomeSellerPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<SellerApplicationValues>({
    resolver: zodResolver(sellerApplicationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      brandName: "",
      craftCategory: "",
      portfolioLink: "",
      motivation: "",
    },
  });

  const onSubmit = async (data: SellerApplicationValues) => {
    setIsLoading(true);
    console.log("Seller application data:", data);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Application Submitted!",
      description: "Thank you for your interest. We will review your application and get back to you soon.",
    });
    setIsLoading(false);
    setIsSubmitted(true);
    form.reset();
  };

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-3xl font-headline font-semibold text-primary mb-4">Application Received!</h1>
        <p className="text-lg text-foreground/80 max-w-md mb-8">
          We&apos;re excited to review your application. Our team will reach out to you via email within 5-7 business days.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="outline" className="text-primary border-primary hover:bg-primary/10">
          Submit Another Application
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-12 py-8">
      <section className="text-center">
        <Store size={64} className="mx-auto mb-4 text-accent" />
        <h1 className="text-4xl font-headline font-bold text-primary mb-4">
          Join the LankaHands Artisan Community
        </h1>
        <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
          Showcase your unique Sri Lankan crafts to a global audience. We provide the platform, you bring the talent.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-card rounded-lg shadow-md">
          <TrendingUp size={40} className="mx-auto mb-3 text-primary" />
          <h3 className="text-xl font-semibold font-headline mb-2">Reach More Customers</h3>
          <p className="text-sm text-muted-foreground">Expand your market beyond local boundaries and connect with craft lovers worldwide.</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <Image src="https://placehold.co/100x100.png" alt="Support icon" width={40} height={40} className="mx-auto mb-3 rounded-full" data-ai-hint="community hands"/>
          <h3 className="text-xl font-semibold font-headline mb-2">Artisan Support</h3>
          <p className="text-sm text-muted-foreground">Get support with marketing, logistics, and growing your creative business.</p>
        </div>
        <div className="p-6 bg-card rounded-lg shadow-md">
          <Image src="https://placehold.co/100x100.png" alt="Fair trade icon" width={40} height={40} className="mx-auto mb-3 rounded-full" data-ai-hint="fair trade"/>
          <h3 className="text-xl font-semibold font-headline mb-2">Fair & Transparent</h3>
          <p className="text-sm text-muted-foreground">We believe in fair compensation for your artistry and transparent partnerships.</p>
        </div>
      </section>

      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary">Seller Application</CardTitle>
          <CardDescription>Tell us about yourself and your craft. We&apos;re excited to learn more!</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Full Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+94 XX XXX XXXX" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="brandName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name / Artisan Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Brand or Artisan Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="craftCategory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Main Craft Category</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Batik, Pottery, Wood Carving" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="portfolioLink"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Portfolio Link (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Link to your Instagram, Facebook page, or website" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>About Your Craft & Motivation</FormLabel>
                    <FormControl>
                      <Textarea rows={5} placeholder="Tell us about your craft, techniques, and why you'd like to sell on LankaHands." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Application
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
