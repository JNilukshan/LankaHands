
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, type ChangeEvent, useRef } from "react";
import React from "react";
import { Loader2, Send, ImageUp, ChevronLeft, UserCircle2 } from "lucide-react";
import type { Artisan, SellerNotification } from "@/types";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMockArtisanById } from "@/lib/mock-data"; // Import from new mock data source

const contactArtisanSchema = z.object({
  customerName: z.string().min(2, { message: "Your name must be at least 2 characters."}),
  messageText: z.string().min(10, { message: "Message must be at least 10 characters." }).max(1000),
  imageFile: z.any().optional(), 
});
type ContactArtisanFormValues = z.infer<typeof contactArtisanSchema>;

const LOCAL_STORAGE_NOTIFICATIONS_KEY = 'lankaHandsSellerNotifications';

export default function ContactArtisanPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params); 
  const artisanId = resolvedParams.id;

  const { toast } = useToast();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [artisan, setArtisan] = useState<Pick<Artisan, 'id' | 'name' | 'profileImageUrl'> | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ContactArtisanFormValues>({
    resolver: zodResolver(contactArtisanSchema),
    defaultValues: {
      customerName: "",
      messageText: "",
      imageFile: undefined,
    },
  });

  useEffect(() => {
    const fetchArtisan = async () => {
      if (!artisanId) {
        setIsPageLoading(false);
        return;
      }
      setIsPageLoading(true);
      const artisanData = await getMockArtisanById(artisanId); // Use new mock data function
      if (artisanData) {
        setArtisan(artisanData);
      } else {
        toast({
            title: "Artisan Not Found",
            description: "Could not load artisan details.",
            variant: "destructive"
        });
      }
      setIsPageLoading(false);
    };
    fetchArtisan();
  }, [artisanId, toast]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      form.setValue("imageFile", file); 
    } else {
      setImagePreview(null);
      form.setValue("imageFile", undefined);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setValue("imageFile", undefined);
    if (fileInputRef.current) {
        fileInputRef.current.value = ""; 
    }
  };

  const handleSubmitMessage = async (data: ContactArtisanFormValues) => {
    setIsSending(true);

    console.log("Sending message to artisan:", artisan?.name, data);
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (artisan) {
      try {
        const storedNotificationsString = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
        const existingNotifications: SellerNotification[] = storedNotificationsString ? JSON.parse(storedNotificationsString) : [];
        
        const newNotification: SellerNotification = {
          id: `notif_contact_${Date.now()}`,
          type: 'new_message',
          title: `New Message from ${data.customerName || 'Customer'} for ${artisan.name}`,
          description: data.messageText + (data.imageFile ? ` (Attachment: data.imageFile.name)` : ''),
          timestamp: new Date().toISOString(),
          read: false,
          sender: data.customerName || 'Customer',
          artisanId: artisan.id,
          link: `/dashboard/seller/messages/thread/${artisan.id}/${Date.now()}` 
        };

        const updatedNotifications = [newNotification, ...existingNotifications];
        localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));

      } catch (e) {
        console.error("Failed to save notification to localStorage", e);
        toast({ title: "Error", description: "Could not save notification locally.", variant: "destructive" });
      }
    }
    
    toast({
      title: "Message Sent!",
      description: `Your message has been sent to ${artisan?.name || 'the artisan'}.`,
    });
    setIsSending(false);
    form.reset();
    setImagePreview(null);
     if (fileInputRef.current) {
        fileInputRef.current.value = "";
    }
  };

  if (isPageLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <p className="text-lg text-muted-foreground">Loading contact form...</p>
        </div>
    );
  }
  
  if (!artisan) {
     return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <UserCircle2 className="w-24 h-24 text-destructive mb-6" />
            <h1 className="text-2xl font-semibold text-destructive mb-4">Artisan Not Found</h1>
            <p className="text-muted-foreground mb-6">Sorry, we couldn&apos;t find the artisan you&apos;re trying to contact.</p>
            <Button asChild variant="outline">
                <Link href="/products">Back to Products</Link>
            </Button>
        </div>
    );
  }


  return (
    <div className="py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader className="border-b">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="mr-2" asChild>
                <Link href={`/artisans/${artisanId}`}>
                    <ChevronLeft size={24} />
                </Link>
            </Button>
            <Avatar className="h-12 w-12">
              <AvatarImage src={typeof artisan.profileImageUrl === 'string' ? artisan.profileImageUrl : undefined} alt={artisan.name} data-ai-hint="artisan avatar"/>
              <AvatarFallback>{artisan.name.substring(0,1)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-xl text-primary">Contact {artisan.name}</CardTitle>
              <CardDescription className="text-sm">Send a message about products, customizations, or general inquiries.</CardDescription>
            </div>
          </div>
        </CardHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmitMessage)}>
            <CardContent className="p-6 space-y-6">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                   <FormItem>
                    <FormLabel>Your Name*</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter your full name" {...field} disabled={isSending} />
                    </FormControl>
                    <FormMessage />
                   </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="messageText"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Message*</FormLabel>
                        <FormControl>
                            <Textarea 
                            rows={5} 
                            placeholder={`Type your message to ${artisan.name}...`} 
                            {...field} 
                            disabled={isSending} 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
              />
              
              <FormItem>
                <FormLabel htmlFor="image-upload" className="flex items-center gap-2">
                    <ImageUp size={20} className="text-primary" /> Attach an Image (Optional)
                </FormLabel>
                <FormControl>
                    <Input 
                        id="image-upload" 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageChange} 
                        disabled={isSending}
                        ref={fileInputRef}
                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                    />
                </FormControl>
                <FormMessage />
              </FormItem>

            {imagePreview && (
                <div className="mt-4 p-3 border rounded-md bg-muted/50">
                    <p className="text-sm font-medium mb-2">Image Preview:</p>
                    <div className="flex items-center gap-3">
                        <Image src={imagePreview} alt="Selected image preview" width={80} height={80} className="rounded-md border object-cover" />
                        <div className="text-xs text-muted-foreground">
                            <p>{form.getValues("imageFile")?.name}</p>
                            <p>{form.getValues("imageFile")?.size ? `${(form.getValues("imageFile").size / 1024).toFixed(1)} KB` : ''}</p>
                        </div>
                        <Button type="button" variant="ghost" size="sm" onClick={removeImage} className="text-xs text-destructive ml-auto">Remove</Button>
                    </div>
                </div>
            )}

            </CardContent>
            <CardFooter className="p-6 border-t">
              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSending}>
                {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send size={18} className="mr-2"/>}
                Send Message
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}

    