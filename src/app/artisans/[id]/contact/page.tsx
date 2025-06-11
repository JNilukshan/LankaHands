
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect, type ChangeEvent, useRef } from "react";
import React from "react"; // Ensure React is imported for React.use()
import { Loader2, Send, ImageUp, UserCircle2, CornerDownLeft, ChevronLeft } from "lucide-react";
import type { Artisan, SellerNotification } from "@/types"; // Added SellerNotification
import Link from "next/link";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// Simplified mock artisan data fetching
const getArtisanDetails = async (id: string): Promise<Pick<Artisan, 'id' | 'name' | 'profileImageUrl'> | null> => {
  await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API call
  const artisans: Record<string, Pick<Artisan, 'id' | 'name' | 'profileImageUrl'>> = {
    '1': { id: '1', name: 'Nimali Perera', profileImageUrl: 'https://placehold.co/40x40.png' },
    '6': { id: '6', name: 'Sustainable Leather Co.', profileImageUrl: 'https://placehold.co/40x40.png' },
  };
  return artisans[id] || null;
};

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'artisan';
  timestamp: Date;
  imagePreview?: string;
  imageFileName?: string;
}

const chatMessageSchema = z.object({
  customerName: z.string().min(2, { message: "Your name must be at least 2 characters."}),
  messageText: z.string().min(1, { message: "Message cannot be empty." }).max(1000),
  imageFile: z.any().optional(),
});
type ChatMessageFormValues = z.infer<typeof chatMessageSchema>;

const LOCAL_STORAGE_NOTIFICATIONS_KEY = 'lankaHandsSellerNotifications';

export default function ContactArtisanPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params); 
  const artisanId = resolvedParams.id;

  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false); // General loading for page/artisan details
  const [isSending, setIsSending] = useState(false); // Loading for message sending
  const [artisan, setArtisan] = useState<Pick<Artisan, 'id' | 'name' | 'profileImageUrl'> | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const form = useForm<ChatMessageFormValues>({
    resolver: zodResolver(chatMessageSchema),
    defaultValues: {
      customerName: "",
      messageText: "",
    },
  });

  useEffect(() => {
    const fetchArtisan = async () => {
      if (!artisanId) return;
      setIsLoading(true);
      const artisanData = await getArtisanDetails(artisanId);
      if (artisanData) {
        setArtisan(artisanData);
      } else {
        toast({
            title: "Artisan Not Found",
            description: "Could not load artisan details.",
            variant: "destructive"
        });
      }
      setIsLoading(false);
    };
    fetchArtisan();
  }, [artisanId, toast]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      form.setValue("imageFile", event.target.files[0]); 
    } else {
      setImagePreview(null);
      form.setValue("imageFile", undefined);
    }
  };

  const handleSubmitMessage = async (data: ChatMessageFormValues) => {
    setIsSending(true);
    const userMessage: ChatMessage = {
      id: `msg_${Date.now()}_user`,
      text: data.messageText,
      sender: 'user',
      timestamp: new Date(),
      imagePreview: imagePreview || undefined,
      imageFileName: data.imageFile?.name
    };
    setMessages(prev => [...prev, userMessage]);

    // Store notification in localStorage
    if (artisan) {
      try {
        const storedNotificationsString = localStorage.getItem(LOCAL_STORAGE_NOTIFICATIONS_KEY);
        const existingNotifications: SellerNotification[] = storedNotificationsString ? JSON.parse(storedNotificationsString) : [];
        
        const newNotification: SellerNotification = {
          id: `notif_${Date.now()}`,
          type: 'new_message',
          title: `New Message from ${data.customerName || 'Customer'}`,
          description: data.messageText + (data.imageFile?.name ? ` (Attachment: ${data.imageFile.name})` : ''),
          timestamp: new Date().toISOString(), // Store as ISO string
          read: false,
          sender: data.customerName || 'Customer',
          artisanId: artisan.id, // Store artisanId for potential future filtering
          // link: `/dashboard/seller/messages/thread/${artisan.id}/${userMessage.id}` // Example link
        };

        const updatedNotifications = [newNotification, ...existingNotifications];
        localStorage.setItem(LOCAL_STORAGE_NOTIFICATIONS_KEY, JSON.stringify(updatedNotifications));

      } catch (e) {
        console.error("Failed to save notification to localStorage", e);
        toast({ title: "Error", description: "Could not save notification locally.", variant: "destructive" });
      }
    }


    // Simulate artisan reply
    await new Promise(resolve => setTimeout(resolve, 1500));
    const artisanReply: ChatMessage = {
      id: `msg_${Date.now()}_artisan`,
      text: `Hello ${data.customerName || 'there'}! Thanks for your message about "${data.messageText.substring(0,20)}...". I'll get back to you soon.`,
      sender: 'artisan',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, artisanReply]);
    
    toast({
      title: "Message Sent!",
      description: "The artisan has been notified (simulated).",
    });
    setIsSending(false);
    form.reset({customerName: data.customerName, messageText: "", imageFile: undefined}); // Keep customer name, clear message and image
    setImagePreview(null);
  };

  if (isLoading || !artisan) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <p className="text-lg text-muted-foreground">Loading chat with {artisan?.name || 'artisan'}...</p>
        </div>
    );
  }

  return (
    <div className="py-8 flex flex-col h-[calc(100vh-10rem)] max-h-[700px]">
      <Card className="w-full max-w-2xl mx-auto shadow-xl flex flex-col flex-grow">
        <CardHeader className="border-b p-4">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="mr-2" asChild>
                <Link href={`/artisans/${artisanId}`}>
                    <ChevronLeft size={24} />
                </Link>
            </Button>
            <Avatar>
              <AvatarImage src={typeof artisan.profileImageUrl === 'string' ? artisan.profileImageUrl : undefined} alt={artisan.name} data-ai-hint="artisan avatar small"/>
              <AvatarFallback>{artisan.name.substring(0,1)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="font-headline text-lg text-primary">{artisan.name}</CardTitle>
              <CardDescription className="text-xs">Typically replies within a few hours</CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 flex-grow overflow-hidden">
          <ScrollArea className="h-full p-4" ref={chatContainerRef}>
            <div className="space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded-xl shadow ${msg.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                    <p className="text-sm">{msg.text}</p>
                    {msg.imagePreview && (
                        <div className="mt-2">
                            <Image src={msg.imagePreview} alt={msg.imageFileName || "Uploaded image"} width={150} height={150} className="rounded-md border object-contain max-h-36" />
                            {msg.imageFileName && <p className="text-xs opacity-80 mt-1">{msg.imageFileName}</p>}
                        </div>
                    )}
                    <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-foreground/70 text-right' : 'text-muted-foreground/70'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
               {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-10">
                    Start the conversation with {artisan.name}. Ask about products, customizations, or anything else!
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
        
        <CardFooter className="p-4 border-t">
          <form onSubmit={form.handleSubmit(handleSubmitMessage)} className="w-full space-y-3">
            <Controller
              control={form.control}
              name="customerName"
              render={({ field }) => (
                 <Input 
                    {...field} 
                    placeholder="Your Name*" 
                    className="text-sm" 
                    disabled={isSending || messages.some(m => m.sender === 'user')} // Disable if messages already sent with a name
                  />
              )}
            />
             {form.formState.errors.customerName && <p className="text-xs text-destructive mt-1">{form.formState.errors.customerName.message}</p>}


            {imagePreview && (
                <div className="mt-2 flex items-center gap-2">
                    <Image src={imagePreview} alt="Preview" width={40} height={40} className="rounded border object-cover" />
                    <p className="text-xs text-muted-foreground">{form.getValues("imageFile")?.name}</p>
                    <Button type="button" variant="ghost" size="sm" onClick={() => {setImagePreview(null); form.setValue("imageFile", undefined);}} className="text-xs">Remove</Button>
                </div>
            )}
            <div className="flex items-center gap-2">
              <Controller
                control={form.control}
                name="messageText"
                render={({ field }) => (
                    <Textarea 
                      {...field} 
                      placeholder="Type your message..." 
                      rows={1} 
                      className="flex-grow resize-none text-sm" 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(handleSubmitMessage)();
                        }
                      }}
                    />
                )}
              />
              <label htmlFor="image-upload" className="cursor-pointer">
                <ImageUp size={22} className="text-primary hover:text-accent transition-colors" />
                <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={isSending} />
              </label>
              <Button type="submit" size="icon" disabled={isSending} className="bg-accent hover:bg-accent/90">
                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send size={18} />}
              </Button>
            </div>
            {form.formState.errors.messageText && <p className="text-xs text-destructive mt-1">{form.formState.errors.messageText.message}</p>}
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
