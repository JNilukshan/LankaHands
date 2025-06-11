"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const categories = ['Apparel', 'Decor', 'Accessories', 'Home Decor', 'Jewelry', 'Pottery'];
const MAX_PRICE = 500;

interface ProductFiltersProps {
  onFilterChange: (filters: { categories: string[]; priceRange: [number, number] }) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, MAX_PRICE]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  const applyFilters = () => {
    onFilterChange({ categories: selectedCategories, priceRange });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, MAX_PRICE]);
    onFilterChange({ categories: [], priceRange: [0, MAX_PRICE] });
  };

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="font-headline text-xl text-primary">Filter Products</CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div>
          <h3 className="text-md font-semibold mb-3 text-foreground">Categories</h3>
          <div className="space-y-2">
            {categories.map(category => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryChange(category)}
                  className="border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                />
                <Label htmlFor={category} className="text-sm font-normal text-foreground/80">
                  {category}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-md font-semibold mb-3 text-foreground">Price Range</h3>
          <Slider
            defaultValue={[0, MAX_PRICE]}
            value={priceRange}
            max={MAX_PRICE}
            step={10}
            onValueChange={handlePriceChange}
            className="[&>span>span]:bg-primary"
          />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>${priceRange[0]}</span>
            <span>${priceRange[1]}</span>
          </div>
        </div>
        
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button onClick={applyFilters} className="w-full sm:w-auto flex-grow bg-primary hover:bg-primary/90">Apply Filters</Button>
          <Button onClick={resetFilters} variant="outline" className="w-full sm:w-auto text-primary border-primary hover:bg-primary/10">
            <X size={16} className="mr-1" /> Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductFilters;
