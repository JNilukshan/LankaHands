
"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PlusCircle, Package, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import type { Product } from '@/types';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';

// Mock data for products
const mockProducts: Product[] = [
  { id: 'prod1', name: 'Ocean Breeze Batik Saree', price: 120.00, category: 'Apparel', images: ['https://placehold.co/80x80.png'], artisanId: 'seller123', stock: 5, description: 'Elegant silk saree.'},
  { id: 'prod2', name: 'Hand-Carved Elephant Statue', price: 75.00, category: 'Decor', images: ['https://placehold.co/80x80.png'], artisanId: 'seller123', stock: 10, description: 'Detailed wooden elephant.' },
  { id: 'prod3', name: 'Terracotta Clay Vase Set', price: 45.00, category: 'Pottery', images: ['https://placehold.co/80x80.png'], artisanId: 'seller123', stock: 0, description: 'Set of 3 vases.' },
  { id: 'prod4', name: 'Spiced Cinnamon Tea Blend', price: 15.00, category: 'Food', images: ['https://placehold.co/80x80.png'], artisanId: 'seller123', stock: 25, description: 'Aromatic local tea.' },
];

export default function ManageProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = mockProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-headline font-bold text-primary flex items-center">
          <Package size={32} className="mr-3 text-accent" /> Manage Your Products
        </h1>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
          <Link href="/dashboard/seller/products/new">
            <PlusCircle size={18} className="mr-2" /> Add New Product
          </Link>
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Product List</CardTitle>
          <CardDescription>View, edit, or remove your listed products.</CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search products by name or ID..." 
              className="pl-10 w-full sm:w-1/2 lg:w-1/3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <Image 
                        src={product.images[0] as string} 
                        alt={product.name} 
                        width={50} 
                        height={50} 
                        className="rounded-md object-cover"
                        data-ai-hint="product thumbnail" 
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                  <TableCell className="text-center">{product.stock}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={product.stock && product.stock > 0 ? 'default' : 'destructive'}
                           className={product.stock && product.stock > 0 ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}>
                      {product.stock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/seller/products/${product.id}/edit`} className="flex items-center w-full">
                            <Edit className="mr-2 h-4 w-4" /> Edit Product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {mockProducts.length > 0 && filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching your search criteria.
            </div>
          )}
          {mockProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products listed yet. <Link href="/dashboard/seller/products/new" className="text-primary hover:underline">Add your first product!</Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
