
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, PackagePlus, ImagePlus, Tag, DollarSign } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { createProduct } from "@/services/productService";
import type { Product } from "@/types";

const productSchema = z.object({
  productName: z.string().min(3, { message: "Product name must be at least 3 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }),
  longDescription: z.string().min(50, { message: "Detailed description must be at least 50 characters." }).optional(),
  price: z.coerce.number().min(0.01, { message: "Price must be a positive value." }),
  category: z.string().min(1, { message: "Please select a category." }),
  stock: z.coerce.number().int().min(0, { message: "Stock quantity must be a non-negative integer." }),
  materials: z.string().optional(), // comma-separated
  dimensions: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const categories = ['Apparel', 'Decor', 'Accessories', 'Home Decor', 'Jewelry', 'Pottery', 'Paintings', 'Sculptures', 'Other'];

export default function AddNewProductPage() {
  const { currentUser, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      description: "",
      longDescription: "",
      price: 0,
      category: "",
      stock: 0,
      materials: "",
      dimensions: "",
    },
  });

  const onSubmit = async (data: ProductFormValues) => {
    if (!currentUser || currentUser.role !== 'seller') {
        toast({ title: "Unauthorized", description: "You must be a seller to add products.", variant: "destructive" });
        return;
    }
    setIsLoading(true);
    
    const productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'reviews'> = {
        name: data.productName,
        description: data.description,
        longDescription: data.longDescription,
        price: data.price,
        category: data.category,
        stock: data.stock,
        materials: data.materials ? data.materials.split(',').map(m => m.trim()) : [],
        dimensions: data.dimensions,
        artisanId: currentUser.id,
        artisanName: currentUser.name,
        images: ['https://placehold.co/600x400.png'], // Placeholder image for now
        isVisible: true,
    };

    const newProduct = await createProduct(productData);
    
    setIsLoading(false);

    if (newProduct) {
        toast({
            title: "Product Added!",
            description: `${newProduct.name} has been successfully listed.`,
        });
        router.push('/dashboard/seller/products');
    } else {
        toast({
            title: "Error",
            description: "Failed to add the product. Please try again.",
            variant: "destructive",
        });
    }
  };
  
  if (isAuthLoading) {
     return <div className="flex justify-center items-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /> <p className="ml-2">Loading...</p></div>;
  }
  
  if (!currentUser || currentUser.role !== 'seller') {
      router.push('/login');
      return <div className="text-center py-10">Redirecting to login...</div>;
  }

  return (
    <div className="py-8">
      <Card className="w-full max-w-3xl mx-auto shadow-xl">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
            <PackagePlus size={28} className="mr-3" /> Add New Product
          </CardTitle>
          <CardDescription>Fill in the details to list your new creation on LankaHands.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Hand-painted Silk Scarf" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Short Description (for listings)</FormLabel>
                    <FormControl>
                      <Textarea rows={3} placeholder="A brief, catchy description of your product." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="longDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Detailed Description (for product page)</FormLabel>
                    <FormControl>
                      <Textarea rows={6} placeholder="Provide more details about materials, techniques, story, etc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><DollarSign size={16} className="mr-1 text-muted-foreground"/>Price (USD)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Tag size={16} className="mr-1 text-muted-foreground"/>Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                 <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="0" {...field} />
                      </FormControl>
                       <FormDescription>Enter 0 if made to order.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="materials"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Materials Used (comma-separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Silk, Natural Dyes, Clay" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="dimensions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Dimensions (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 10cm x 15cm x 5cm, or 6 yards" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

               <FormItem>
                <FormLabel className="flex items-center"><ImagePlus size={16} className="mr-1 text-muted-foreground"/>Product Images (up to 5)</FormLabel>
                <Input type="file" accept="image/*" multiple disabled /> 
                <FormDescription>Image upload functionality will be implemented soon. For now, a placeholder image will be used.</FormDescription>
              </FormItem>


              <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Product
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
