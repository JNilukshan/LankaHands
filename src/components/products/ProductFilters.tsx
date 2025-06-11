
"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const allCategories = ['All', 'Apparel', 'Decor', 'Accessories', 'Home Decor', 'Jewelry', 'Pottery'];
const MAX_PRICE = 500; // Kept in case other parts of the app expect a full price range

interface ProductFiltersProps {
  onFilterChange: (filters: { categories: string[]; priceRange: [number, number] }) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    // Apply filter whenever selectedCategory changes
    const categoriesToFilter = selectedCategory === 'All' ? [] : [selectedCategory];
    onFilterChange({ categories: categoriesToFilter, priceRange: [0, MAX_PRICE] });
  }, [selectedCategory, onFilterChange]);

  const handleCategoryChange = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="font-headline text-xl text-primary">Filter Products</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <Label htmlFor="category-select" className="text-md font-semibold mb-3 text-foreground block">Category</Label>
          <Select value={selectedCategory} onValueChange={handleCategoryChange}>
            <SelectTrigger id="category-select" className="w-full">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              {allCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
