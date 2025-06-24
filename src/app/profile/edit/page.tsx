
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Save, UserCircle, ImagePlus } from "lucide-react";
import type { AuthenticatedUser } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useAuth } from '@/context/AuthContext';
import { useRouter } from "next/navigation";

const profileSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  // profileImage: typeof window === 'undefined' ? z.any() : z.instanceof(FileList).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function EditProfilePage() {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  useEffect(() => {
    if (isAuthLoading) return;
    if (!currentUser) {
        router.push('/login');
        return;
    }
    
    form.reset({
      name: currentUser.name,
      email: currentUser.email,
    });
    if (typeof currentUser.profileImageUrl === 'string') {
      setImagePreview(currentUser.profileImageUrl);
    }
  }, [form, currentUser, isAuthLoading, router]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImagePreview(URL.createObjectURL(file));
      // form.setValue("profileImage", event.target.files);
    }
  };

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    console.log("Updated profile data:", data);
    // Simulate API call to update user document in Firestore
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast({
      title: "Profile Updated!",
      description: "Your profile information has been successfully updated.",
    });
    setIsSubmitting(false);
    // You could also call a function from AuthContext to refresh currentUser state if needed
  };

  if (isAuthLoading || !currentUser) {
    return (
        <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-2">Loading profile...</p>
        </div>
    );
  }

  return (
    <div className="py-8">
      <Card className="w-full max-w-2xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <UserCircle size={28} className="mr-3" /> Edit Your Profile
          </CardTitle>
          <CardDescription>Update your personal information. Changes will be reflected across LankaHands.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="profileImage" // This field is not in schema for data, but for UI interaction
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center">
                    <FormLabel htmlFor="profile-image-upload">
                      <Avatar className="h-32 w-32 cursor-pointer border-4 border-primary/20 hover:border-primary/50 transition-colors">
                        <AvatarImage src={imagePreview || undefined} alt={currentUser.name} data-ai-hint="person avatar" />
                        <AvatarFallback className="text-4xl bg-black text-white">
                          {currentUser.name ? currentUser.name.substring(0,2).toUpperCase() : <UserCircle />}
                        </AvatarFallback>
                      </Avatar>
                    </FormLabel>
                    <FormControl>
                      <Input 
                        id="profile-image-upload"
                        type="file" 
                        accept="image/*" 
                        className="hidden"
                        onChange={handleImageChange}
                        disabled // Disabled until backend logic is implemented
                      />
                    </FormControl>
                    <FormDescription className="mt-2">Click image to change (Upload disabled). Max 1MB.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
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
                      <Input type="email" placeholder="your.email@example.com" {...field} disabled />
                    </FormControl>
                    <FormDescription>Email cannot be changed after registration.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save size={16} className="mr-2"/>}
                  Save Changes
                </Button>
                 <Button variant="outline" className="w-full sm:w-auto" asChild>
                   <Link href="/profile">Cancel</Link>
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
