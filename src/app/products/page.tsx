
"use client";

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/shared/ProductCard';
// import ProductFilters from '@/components/products/ProductFilters'; // Removed
import type { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ListFilter, ChevronDown } from 'lucide-react';
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

export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    const fetchProductsAndCategories = async () => {
      setIsLoading(true);
      const productsData = await getMockAllProducts();
      setAllProducts(productsData);

      // Extract unique categories
      const uniqueCategories = Array.from(new Set(productsData.map(p => p.category)));
      setCategories(['All', ...uniqueCategories.sort()]);
      
      // Initial full list for display before any filtering
      setFilteredProducts(productsData); 
      setIsLoading(false);
    };
    fetchProductsAndCategories();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    let productsToDisplay = [...allProducts];

    // Filter by category
    if (selectedCategory !== 'All') {
      productsToDisplay = productsToDisplay.filter(p => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      productsToDisplay = productsToDisplay.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.artisan?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    productsToDisplay.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-desc': return b.name.localeCompare(a.name) * -1;
        case 'name-asc':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    // Simulate loading delay for filter changes if needed, or apply directly
    setTimeout(() => {
      setFilteredProducts(productsToDisplay);
      setIsLoading(false);
    }, 200); // Short delay to give feedback that filtering is happening

  }, [searchTerm, sortBy, selectedCategory, allProducts]);


  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="space-y-8">
      {/* Header and Controls Section */}
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
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full md:w-[200px] text-base">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                <SelectItem value="price-asc">Price (Low-High)</SelectItem>
                <SelectItem value="price-desc">Price (High-Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Category Filters Section */}
      {categories.length > 1 && ( // Only show if there are categories to filter by
        <section className="container mx-auto px-4 md:px-0">
          <div className="flex flex-wrap gap-3 items-center justify-center">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                onClick={() => handleCategorySelect(category)}
                className={`rounded-full px-4 py-2 text-sm transition-colors duration-200 ease-in-out
                  ${selectedCategory === category 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'border-primary text-primary hover:bg-primary/10'}`}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>
      )}

      {/* Products Grid Section */}
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
              Try adjusting your search or filters.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
