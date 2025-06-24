
"use client";

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Contact, Save, Loader2, Phone, Mail, Facebook, Instagram, Youtube } from 'lucide-react';
import { useState, useEffect } from "react";
import type { Artisan, ContactDetails } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { getArtisanById, updateArtisanProfile } from '@/services/artisanService';

export default function ContactsPage() {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    phone: "",
    email: "",
    facebook: "",
    instagram: "",
    youtube: "",
  });

  useEffect(() => {
    if (isAuthLoading) return;
    if (!currentUser || currentUser.role !== 'seller') {
      router.push('/login');
      return;
    }

    const fetchArtisanData = async () => {
      setIsDataLoading(true);
      const data = await getArtisanById(currentUser.id);
      if (data) {
        setContactDetails({
            phone: data.contactDetails?.phone || "",
            email: data.contactDetails?.email || data.email || "", // Fallback to main email
            facebook: data.contactDetails?.facebook || "",
            instagram: data.contactDetails?.instagram || "",
            youtube: data.contactDetails?.youtube || "",
        });
      }
      setIsDataLoading(false);
    };

    fetchArtisanData();
  }, [currentUser, isAuthLoading, router]);

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    
    const dataToUpdate: Partial<Artisan> = {
        contactDetails: {
            phone: contactDetails.phone,
            email: contactDetails.email,
            facebook: contactDetails.facebook,
            instagram: contactDetails.instagram,
            youtube: contactDetails.youtube,
        }
    };

    const success = await updateArtisanProfile(currentUser.id, dataToUpdate);
    
    if(success) {
        toast({
            title: "Contact Details Saved!",
            description: `Your contact information has been updated.`
        });
    } else {
        toast({
            title: `Error Saving Contact Details`,
            description: "There was a problem saving your information. Please try again.",
            variant: "destructive"
        });
    }

    setIsSaving(false);
  };
  
  const handleInputChange = (field: keyof ContactDetails, value: string) => {
    setContactDetails(prev => ({ ...prev, [field]: value }));
  };

  if (isAuthLoading || isDataLoading) {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="w-16 h-16 text-primary animate-spin mb-6" />
            <p className="text-lg text-muted-foreground">Loading contact settings...</p>
        </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold text-primary flex items-center">
        <Contact size={32} className="mr-3 text-accent" /> Manage Contacts
      </h1>
      
      <Card className="shadow-lg max-w-2xl mx-auto">
        <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">Public Contact Information</CardTitle>
            <CardDescription>This information may be displayed publicly on your artisan profile page. Only fill in what you want to share.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="contact-phone" className="flex items-center"><Phone size={16} className="mr-2"/>Phone Number (WhatsApp recommended)</Label>
                <Input id="contact-phone" value={contactDetails.phone} onChange={(e) => handleInputChange('phone', e.target.value)} placeholder="+94 77 123 4567" disabled={isSaving}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-email" className="flex items-center"><Mail size={16} className="mr-2"/>Public Email Address</Label>
                <Input id="contact-email" type="email" value={contactDetails.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="contact@mybrand.com" disabled={isSaving}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-facebook" className="flex items-center"><Facebook size={16} className="mr-2"/>Facebook Page URL</Label>
                <Input id="contact-facebook" value={contactDetails.facebook} onChange={(e) => handleInputChange('facebook', e.target.value)} placeholder="https://facebook.com/your-page" disabled={isSaving}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-instagram" className="flex items-center"><Instagram size={16} className="mr-2"/>Instagram Profile URL</Label>
                <Input id="contact-instagram" value={contactDetails.instagram} onChange={(e) => handleInputChange('instagram', e.target.value)} placeholder="https://instagram.com/your-profile" disabled={isSaving}/>
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact-youtube" className="flex items-center"><Youtube size={16} className="mr-2"/>YouTube Channel URL</Label>
                <Input id="contact-youtube" value={contactDetails.youtube} onChange={(e) => handleInputChange('youtube', e.target.value)} placeholder="https://youtube.com/your-channel" disabled={isSaving}/>
            </div>
        </CardContent>
        <CardFooter>
            <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleSave} disabled={isSaving}>
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save size={16} className="mr-2"/>}
                Save Contact Details
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
