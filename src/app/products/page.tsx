"use client";

import { useState, useEffect } from 'react';
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
import { Card, CardContent } from '@/components/ui/card'; // Added Card and CardContent import

// Placeholder data
const allProducts: Product[] = [
  { id: '101', name: 'Ocean Breeze Batik Saree', description: 'Elegant silk saree with hand-painted Batik motifs.', price: 120.00, category: 'Apparel', images: ['https://placehold.co/600x400.png'], artisanId: '1', reviews: [{id:'r1', userId:'u1', userName:'Aisha K.', productId:'101', rating:5, comment:'Beautiful!', createdAt: new Date().toISOString()}] },
  { id: '102', name: 'Hand-Carved Elephant Statue', description: 'Detailed wooden elephant statue.', price: 75.00, category: 'Decor', images: ['https://placehold.co/600x400.png'], artisanId: '2' },
  { id: '103', name: 'Sunset Hues Handloom Shawl', description: 'Soft and warm handloom shawl.', price: 55.00, category: 'Accessories', images: ['https://placehold.co/600x400.png'], artisanId: '3', reviews: [{id:'r2', userId:'u2', userName:'Ben S.', productId:'103', rating:4, comment:'Great quality.', createdAt: new Date().toISOString()}] },
  { id: '104', name: 'Lotus Bloom Batik Wall Hanging', description: 'Stunning Batik wall art.', price: 90.00, category: 'Home Decor', images: ['https://placehold.co/600x400.png'], artisanId: '1' },
  { id: '105', name: 'Terracotta Clay Vase Set', description: 'Set of 3 handcrafted terracotta vases.', price: 45.00, category: 'Pottery', images: ['https://placehold.co/600x400.png'], artisanId: '4' },
  { id: '106', name: 'Silver Filigree Earrings', description: 'Intricate silver filigree earrings.', price: 150.00, category: 'Jewelry', images: ['https://placehold.co/600x400.png'], artisanId: '5', reviews: [{id:'r3', userId:'u3', userName:'Chloe T.', productId:'106', rating:5, comment:'Absolutely gorgeous!', createdAt: new Date().toISOString()}] },
  { id: '107', name: 'Leather Bound Journal', description: 'Hand-stitched leather journal with recycled paper.', price: 35.00, category: 'Accessories', images: ['https://placehold.co/600x400.png'], artisanId: '6' },
  { id: '108', name: 'Painted Wooden Mask', description: 'Traditional Sri Lankan wooden mask, hand-painted.', price: 60.00, category: 'Decor', images: ['https://placehold.co/600x400.png'], artisanId: '2' },
];

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFilteredProducts(allProducts);
      setIsLoading(false);
    }, 500);
  }, []);

  const handleFilterChange = (filters: { categories: string[]; priceRange: [number, number] }) => {
    setIsLoading(true);
    let products = [...allProducts];
    if (filters.categories.length > 0) {
      products = products.filter(p => filters.categories.includes(p.category));
    }
    products = products.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);
    
    setTimeout(() => { // Simulate filtering delay
      setFilteredProducts(products);
      setIsLoading(false);
    }, 300);
  };

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
    <div className="flex flex-col lg:flex-row gap-8">
      <aside className="lg:w-1/4 xl:w-1/5">
        <ProductFilters onFilterChange={handleFilterChange} />
      </aside>
      <section className="lg:w-3/4 xl:w-4/5">
        <div className="mb-6 p-4 bg-card rounded-lg shadow">
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
