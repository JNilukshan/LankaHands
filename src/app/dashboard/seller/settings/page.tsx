
"use client"; // Needed for Tabs and client-side form components

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Store, CreditCard, Truck, ShieldCheck, ImagePlus, Save, UserCircle } from 'lucide-react'; 

export default function StoreSettingsPage() {
  // In a real app, form state would be managed with react-hook-form or similar
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-headline font-bold text-primary flex items-center">
        <Settings size={32} className="mr-3 text-accent" /> Store Settings
      </h1>

      <Tabs defaultValue="artisan-profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 h-auto p-1"> 
          <TabsTrigger value="artisan-profile" className="flex items-center gap-2 py-2"><UserCircle size={16}/> Artisan Profile</TabsTrigger>
          <TabsTrigger value="payment" className="flex items-center gap-2 py-2"><CreditCard size={16}/> Payments</TabsTrigger>
          <TabsTrigger value="shipping" className="flex items-center gap-2 py-2"><Truck size={16}/> Shipping</TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2 py-2"><ShieldCheck size={16}/> Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="artisan-profile">
          <Card className="shadow-lg mt-4">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">Artisan Profile Information</CardTitle>
              <CardDescription>Manage your public artisan profile details. This information appears on your store and product pages.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                  <Label htmlFor="artisanName">Artisan/Brand Name (Public)</Label>
                  <Input id="artisanName" defaultValue="Nimali Perera - Batik Artistry" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="artisanSpeciality">Speciality / Craft Type</Label>
                  <Input id="artisanSpeciality" placeholder="e.g., Batik Artist, Wood Carver" defaultValue="Master Batik Artist" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="artisanLocation">Location</Label>
                  <Input id="artisanLocation" placeholder="e.g., Kandy, Sri Lanka" defaultValue="Kandy, Sri Lanka" />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="artisanBio">Full Artisan Bio (Public)</Label>
                  <Textarea id="artisanBio" rows={6} placeholder="Share your story, inspiration, and techniques with customers." defaultValue="Nimali Perera is a celebrated Batik artist from the historic city of Kandy. With over 20 years of experience, Nimali draws inspiration from Sri Lanka's lush landscapes and rich cultural tapestry. Her work is characterized by intricate details, vibrant color palettes, and a fusion of traditional motifs with contemporary aesthetics." />
              </div>
              <div className="space-y-2">
                  <Label htmlFor="artisanProfilePic" className="flex items-center"><ImagePlus size={16} className="mr-2"/>Profile Picture</Label>
                  <Input id="artisanProfilePic" type="file" accept="image/*" />
                  <p className="text-xs text-muted-foreground">Recommended size: 400x400px. Max 1MB.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground"><Save size={16} className="mr-2"/> Save Profile Information</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card className="shadow-lg mt-4">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">Payment Settings</CardTitle>
              <CardDescription>Configure how you receive payments for your sales.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="bankAccountName">Bank Account Holder Name</Label>
                <Input id="bankAccountName" placeholder="Your Full Name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                <Input id="bankAccountNumber" placeholder="0000-0000-0000-0000" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankName">Bank Name</Label>
                <Input id="bankName" placeholder="e.g., Commercial Bank" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bankBranch">Bank Branch</Label>
                <Input id="bankBranch" placeholder="e.g., Colombo Main Branch" />
              </div>
              <p className="text-sm text-muted-foreground">Ensure all details are accurate to avoid payment delays. Payments are processed monthly.</p>
            </CardContent>
            <CardFooter>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground"><Save size={16} className="mr-2"/> Save Payment Details</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card className="shadow-lg mt-4">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">Shipping Configuration</CardTitle>
              <CardDescription>Set up your shipping rates and options.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Shipping settings are currently managed globally by LankaHands. If you have specific shipping needs or offer custom shipping, please contact support.</p>
              <div>
                <h4 className="font-semibold text-foreground">Standard Shipping Policy:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 mt-2">
                    <li>Local (Sri Lanka): $5 (3-5 business days)</li>
                    <li>International: $25 (7-21 business days, varies by destination)</li>
                    <li>Free shipping on orders over $100 (local) / $200 (international).</li>
                </ul>
              </div>
              <div className="space-y-2">
                <Label htmlFor="processingTime">Typical Order Processing Time</Label>
                <Input id="processingTime" placeholder="e.g., 1-3 business days" defaultValue="1-2 business days"/>
                 <p className="text-xs text-muted-foreground">This helps set customer expectations.</p>
              </div>
            </CardContent>
             <CardFooter>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground"><Save size={16} className="mr-2"/> Save Shipping Settings</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card className="shadow-lg mt-4">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-primary">Store Policies</CardTitle>
              <CardDescription>Define your return, exchange, and cancellation policies.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="returnPolicy">Return & Refund Policy</Label>
                <Textarea id="returnPolicy" rows={5} placeholder="Detail your return and refund process, conditions, and timeframe." defaultValue="We accept returns within 14 days for defective items or if the product is not as described. Please contact us for a return authorization. Buyer pays return shipping unless the item is faulty." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exchangePolicy">Exchange Policy</Label>
                <Textarea id="exchangePolicy" rows={3} placeholder="Specify if you offer exchanges and under what conditions." defaultValue="Exchanges are offered on a case-by-case basis for items of similar value, subject to availability. Please contact us to discuss."/>
              </div>
               <div className="space-y-2">
                <Label htmlFor="cancellationPolicy">Order Cancellation Policy</Label>
                <Textarea id="cancellationPolicy" rows={2} placeholder="When can customers cancel an order?" defaultValue="Orders can be cancelled within 24 hours of placement, provided they have not yet been shipped."/>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="bg-accent hover:bg-accent/90 text-accent-foreground"><Save size={16} className="mr-2"/> Save Policies</Button>
            </CardFooter>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
