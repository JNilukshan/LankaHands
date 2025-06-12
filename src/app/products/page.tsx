
"use client";

import { useState, useEffect, useCallback } from 'react';
import ProductCard from '@/components/shared/ProductCard';
import ProductFilters from '@/components/products/ProductFilters';
import type { Product } from '@/types';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { getMockAllProducts } from '@/lib/mock-data'; // Import from new mock data source


export default function ProductsPage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const productsWithDetails = await getMockAllProducts();
      setAllProducts(productsWithDetails);
      setFilteredProducts(productsWithDetails);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const handleFilterChange = useCallback((filters: { categories: string[]; priceRange: [number, number] }) => {
    setIsLoading(true);
    let productsToSet = [...allProducts];
    if (filters.categories.length > 0) {
      productsToSet = productsToSet.filter(p => filters.categories.includes(p.category));
    }
    // Price range filtering is currently not used based on ProductFilters component
    
    setTimeout(() => { 
      setFilteredProducts(productsToSet);
      setIsLoading(false);
    }, 300);
  }, [allProducts]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };
  
  const displayedProducts = filteredProducts
    .filter(product => product.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc': return a.price - b.price;
        case 'price-desc': return b.price - a.price;
        case 'name-asc': return a.name.localeCompare(b.name);
        case 'name-desc': return b.name.localeCompare(a.name);
        default: return 0;
      }
    });

  return (
    <div className="flex flex-col gap-8"> 
      <div className="p-4 bg-card rounded-lg shadow">
        <h1 className="text-3xl font-headline font-semibold mb-4 text-primary">Our Collection</h1>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-grow w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 w-full"
            />
          </div>
          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
      
      <div> 
        <ProductFilters onFilterChange={handleFilterChange} />
      </div>

      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-60 w-full" />
                <CardContent className="p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : displayedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {displayedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-muted-foreground">No products found matching your criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}

    