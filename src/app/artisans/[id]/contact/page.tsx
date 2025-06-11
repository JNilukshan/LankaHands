
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Send, ImageUp, UserCircle2 } from "lucide-react";
import type { Artisan } from "@/types";
import Link from "next/link";

// Simplified mock artisan data fetching for this page
const getArtisanName = async (id: string): Promise<Pick<Artisan, 'id' | 'name'> | null> => {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call
  const artisans: Record<string, Pick<Artisan, 'id' | 'name'>> = {
    '1': { id: '1', name: 'Nimali Perera' },
    '6': { id: '6', name: 'Sustainable Leather Co.' },
    // Add other artisan names as needed for testing
  };
  return artisans[id] || null;
};


const contactArtisanSchema = z.object({
  message: z.string().min(20, { message: "Message must be at least 20 characters." }).max(1000, { message: "Message must be 1000 characters or less."}),
  image: z.any().optional(), // For FileList, actual handling is more complex
});

type ContactArtisanFormValues = z.infer<typeof contactArtisanSchema>;

export default function ContactArtisanPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [artisan, setArtisan] = useState<Pick<Artisan, 'id' | 'name'> | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ContactArtisanFormValues>({
    resolver: zodResolver(contactArtisanSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    const fetchArtisan = async () => {
      const artisanData = await getArtisanName(params.id);
      if (artisanData) {
        setArtisan(artisanData);
      } else {
        toast({
            title: "Artisan Not Found",
            description: "Could not load artisan details.",
            variant: "destructive"
        })
      }
    };
    fetchArtisan();
  }, [params.id, toast]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      form.setValue("image", event.target.files); 
    } else {
      setImagePreview(null);
      form.setValue("image", undefined);
    }
  };

  const onSubmit = async (data: ContactArtisanFormValues) => {
    setIsLoading(true);
    console.log("Contact artisan form data:", { artisanId: params.id, ...data });
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${artisan?.name || 'the artisan'}. They will respond to you via your registered email.`,
    });
    setIsLoading(false);
    form.reset();
    setImagePreview(null);
    // router.push(`/artisans/${params.id}`); // Optional: redirect back to artisan profile
  };

  if (!artisan) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <p className="text-lg text-muted-foreground">Loading artisan details...</p>
        </div>
    );
  }

  return (
    <div className="py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <UserCircle2 size={28} className="mr-3 text-accent" /> Contact {artisan.name}
          </CardTitle>
          <CardDescription>Send a message to discuss product details, customizations, or ask any questions you have.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Message</FormLabel>
                    <FormControl>
                      <Textarea rows={8} placeholder={`Type your message to ${artisan.name}...`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="image"
                render={({ field }) => ( // field is not directly used for input type="file"
                  <FormItem>
                    <FormLabel className="flex items-center"><ImageUp size={18} className="mr-2"/>Attach an Image (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange}
                        className="file:text-primary file:font-medium"
                      />
                    </FormControl>
                    <FormDescription>Share images for reference, inspiration, or to show a specific detail.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {imagePreview && (
                <div className="mt-4">
                  <p className="text-sm font-medium mb-2">Image Preview:</p>
                  <Image src={imagePreview} alt="Selected image preview" width={200} height={200} className="rounded-md border object-contain max-h-48" />
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send size={16} className="mr-2"/>}
                  Send Message
                </Button>
                 <Button variant="outline" className="w-full sm:w-auto" asChild>
                   <Link href={`/artisans/${params.id}`}>Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
