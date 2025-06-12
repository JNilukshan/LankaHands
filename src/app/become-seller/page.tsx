
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
import { useState, useEffect } from "react";
import { Loader2, Store, CheckCircle, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
  const { currentUser, upgradeToSeller, registerAsSeller, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplicationSuccessful, setIsApplicationSuccessful] = useState(false);

  const form = useForm<SellerApplicationValues>({
    resolver: zodResolver(sellerApplicationSchema),
    defaultValues: {
      fullName: currentUser?.name || "",
      email: currentUser?.email || "",
      phoneNumber: "",
      brandName: "",
      craftCategory: "",
      portfolioLink: "",
      motivation: "",
    },
  });

  useEffect(() => {
    if (currentUser) {
      form.reset({
        fullName: currentUser.name,
        email: currentUser.email,
        phoneNumber: "",
        brandName: "",
        craftCategory: "",
        portfolioLink: "",
        motivation: "",
      });
    }
  }, [currentUser, form]);

  const onSubmit = async (data: SellerApplicationValues) => {
    setIsSubmitting(true);
    let success = false;

    if (currentUser && currentUser.role === 'buyer') {
      success = await upgradeToSeller();
    } else if (!currentUser) {
      // If user is logged out, register them as a new seller
      success = await registerAsSeller({ name: data.fullName, email: data.email });
    } else if (currentUser && currentUser.role === 'seller') {
        toast({ title: "Already a Seller", description: "Your account is already registered as a seller.", variant: "default"});
        setIsSubmitting(false);
        router.push('/dashboard/seller');
        return;
    }


    setIsSubmitting(false);
    if (success) {
      toast({
        title: "Application Submitted!",
        description: "Welcome, seller! You're now set up to sell on LankaHands.",
      });
      setIsApplicationSuccessful(true);
      // Form reset is handled by the success view
    } else {
      toast({
        title: "Application Failed",
        description: "There was an issue processing your application. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isApplicationSuccessful) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
        <h1 className="text-3xl font-headline font-semibold text-primary mb-4">Application Approved!</h1>
        <p className="text-lg text-foreground/80 max-w-md mb-8">
          Congratulations! You are now a seller on LankaHands. Proceed to your dashboard to start listing products.
        </p>
        <Button onClick={() => router.push('/dashboard/seller')} className="bg-accent hover:bg-accent/90 text-accent-foreground">
          Go to Seller Dashboard
        </Button>
      </div>
    );
  }
  
   if (authLoading && !currentUser) { // Show loader if auth state is loading and no user yet
    return <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <p className="ml-2">Loading...</p></div>;
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
          <CardDescription>
            {currentUser && currentUser.role === 'buyer' 
              ? "Upgrade your buyer account to become a seller." 
              : "Tell us about yourself and your craft. We're excited to learn more!"}
          </CardDescription>
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
                        <Input placeholder="Your Full Name" {...field} disabled={!!currentUser} />
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
                        <Input type="email" placeholder="your.email@example.com" {...field} disabled={!!currentUser}/>
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
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting || authLoading}>
                {(isSubmitting || authLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentUser && currentUser.role === 'buyer' ? 'Upgrade to Seller Account' : 'Submit Application'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
