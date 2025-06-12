
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
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { getMockProductsByArtisanId, mockArtisanNimali } from '@/lib/mock-data'; // Using Nimali as the seller

const SELLER_ARTISAN_ID = mockArtisanNimali.id;

export default function ManageProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [productToDeleteId, setProductToDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      const sellerProducts = await getMockProductsByArtisanId(SELLER_ARTISAN_ID);
      setProducts(sellerProducts);
      setIsLoading(false);
    };
    fetchProducts();
  }, []);

  const handleDeleteClick = (productId: string) => {
    setProductToDeleteId(productId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = () => {
    if (productToDeleteId) {
      const deletedProduct = products.find(p => p.id === productToDeleteId);
      setProducts(currentProducts => currentProducts.filter(product => product.id !== productToDeleteId));
      toast({
        title: "Product Deleted",
        description: `${deletedProduct?.name || 'The product'} has been successfully deleted.`,
      });
      // In a real app, also call backend to delete
    }
    setIsDeleteDialogOpen(false);
    setProductToDeleteId(null);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

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
                           className={product.stock && product.stock > 0 ? 'bg-green-500 text-white hover:bg-green-500/90' : 'bg-red-500 text-white hover:bg-red-500/90'}>
                      {product.stock && product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions for {product.name}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/seller/products/${product.id}/edit`} className="flex items-center w-full">
                            <Edit className="mr-2 h-4 w-4" /> Edit Product
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                          onClick={() => handleDeleteClick(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {products.length > 0 && filteredProducts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products found matching your search criteria.
            </div>
          )}
          {products.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No products listed yet. <Link href="/dashboard/seller/products/new" className="text-primary hover:underline">Add your first product!</Link>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the product
              "{products.find(p => p.id === productToDeleteId)?.name || 'selected product'}" from your listings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setProductToDeleteId(null)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteProduct} className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

    