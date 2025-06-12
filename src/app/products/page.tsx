
import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/types';
import { ListFilter, Package } from 'lucide-react'; // Users icon removed as filter is removed for now
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { getAllProducts } from '@/services/productService'; // Import new service

// This page is now a Server Component

export default async function ProductsPage() {
  // Fetch products directly on the server
  // Error handling for getAllProducts is done within the service itself, returning [] on error.
  const allProducts: Product[] = await getAllProducts();

  // Default sort: Name A-Z (can be made more sophisticated later)
  const sortedProducts = [...allProducts].sort((a, b) => a.name.localeCompare(b.name));

  // For now, filtering UI and logic are removed for simplicity.
  // This page will display all products fetched from the backend.
  // We can re-add filtering later (e.g., using URL query params and server-side filtering).

  return (
    <div className="space-y-8">
      <section className="py-6 px-4 md:px-6 bg-card rounded-lg shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-headline font-bold text-primary mb-6 text-center flex items-center justify-center">
            <Package size={40} className="mr-4 text-accent" /> Our Artisan Collections
          </h1>
          {/* Search and filter UI temporarily removed for server component conversion */}
          {/* <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
            ... Search Input ...
            ... Category Select ...
          </div> */}
           <p className="text-center text-muted-foreground">Browse all available handcrafted items.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-0">
        {/* isLoading state is not needed as data is fetched on server before render */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {sortedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <ListFilter size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground mb-2">No Products Found</p>
            <p className="text-sm text-muted-foreground">
              There are currently no products available. Please check back later.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
