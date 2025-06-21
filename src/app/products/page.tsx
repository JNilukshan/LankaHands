
import ProductCard from '@/components/shared/ProductCard';
import type { Product } from '@/types';
import { ListFilter, Package } from 'lucide-react';
import { getAllProducts } from '@/services/productService';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

async function ProductGrid() {
  const allProducts: Product[] = await getAllProducts();
  const sortedProducts = [...allProducts].sort((a, b) => a.name.localeCompare(b.name));

  if (sortedProducts.length === 0) {
    return (
      <div className="text-center py-16">
        <ListFilter size={64} className="mx-auto text-muted-foreground mb-4" />
        <p className="text-xl text-muted-foreground mb-2">No Products Found</p>
        <p className="text-sm text-muted-foreground">
          There are currently no products available. Please check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {sortedProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-4">
                    <Skeleton className="h-60 w-full" />
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-10 w-full" />
                </div>
            ))}
        </div>
    );
}

export default function ProductsPage() {
  return (
    <div className="space-y-8">
      <section className="py-6 px-4 md:px-6 bg-card rounded-lg shadow-md">
        <div className="container mx-auto">
          <h1 className="text-4xl font-headline font-bold text-primary mb-6 text-center flex items-center justify-center">
            <Package size={40} className="mr-4 text-accent" /> Our Artisan Collections
          </h1>
           <p className="text-center text-muted-foreground">Browse all available handcrafted items.</p>
        </div>
      </section>

      <section className="container mx-auto px-4 md:px-0">
        <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
        </Suspense>
      </section>
    </div>
  );
}
