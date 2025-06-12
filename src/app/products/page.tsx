
"use client";

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ListFilter, Users } from 'lucide-react'; // Keep Users import for now, in case it's used elsewhere or as placeholder. Will remove if truly unused.
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { getMockAllProducts } from '@/lib/mock-data';
import { useAuth } from '@/context/AuthContext';

const FOLLOWED_ARTISANS_FILTER_VALUE = "followed-artisans";

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); 
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setIsLoading(true);
      const productsData = await getMockAllProducts();
      setAllProducts(productsData);

      const uniqueCategories = Array.from(new Set(productsData.map(p => p.category)));
      setCategories(uniqueCategories.sort());
      
      // Initial sort by name (A-Z)
      setFilteredProducts(productsData.sort((a,b) => a.name.localeCompare(b.name))); 
      setIsLoading(false);
    };
    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    let productsToDisplay = [...allProducts];

    if (selectedCategory === FOLLOWED_ARTISANS_FILTER_VALUE) {
      if (currentUser && currentUser.followedArtisans && currentUser.followedArtisans.length > 0) {
        productsToDisplay = productsToDisplay.filter(p =>
          currentUser.followedArtisans!.includes(p.artisanId)
        );
      } else {
        productsToDisplay = []; 
      }
    } else if (selectedCategory !== 'All') {
      productsToDisplay = productsToDisplay.filter(p => p.category === selectedCategory);
    }

    if (searchTerm) {
      productsToDisplay = productsToDisplay.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.artisan?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Default sort: Name A-Z
    productsToDisplay.sort((a, b) => a.name.localeCompare(b.name));


    // Simulate a brief loading delay for filter changes
    setTimeout(() => {
      setFilteredProducts(productsToDisplay);
      setIsLoading(false);
    }, 200); 

  }, [searchTerm, selectedCategory, allProducts, currentUser]);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };


  return (
    <div className="space-y-8">
      <section className="py-6 px-4 md:px-6 bg-card rounded-lg shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-headline font-bold text-primary mb-6 text-center">
            Our Artisan Collections
          </h1>
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search by product, artisan, or description..." 
                value={searchTerm}
                onChange={handleSearch}
                className="pl-10 w-full text-base"
              />
            </div>
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-full md:w-[250px] text-base">
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
                 {currentUser && ( 
                    <SelectItem value={FOLLOWED_ARTISANS_FILTER_VALUE}>
                        Products from Followed Artisans
                    </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-0">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden rounded-lg">
                <Skeleton className="h-64 w-full" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-10 w-full mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ListFilter size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-2">No Products Found</p>
            <p className="text-sm text-muted-foreground">
              {selectedCategory === FOLLOWED_ARTISANS_FILTER_VALUE && (!currentUser || !currentUser.followedArtisans || currentUser.followedArtisans.length === 0)
                ? "You are not following any artisans yet, or you are not logged in."
                : "Try adjusting your search or filters."}
            </p>
             {selectedCategory === FOLLOWED_ARTISANS_FILTER_VALUE && (!currentUser) && (
                <Button asChild className="mt-4">
                    <a href="/login">Login to see followed artisan products</a>
                </Button>
            )}
          </div>
        )}
      </section>
    </div>
  );
}
