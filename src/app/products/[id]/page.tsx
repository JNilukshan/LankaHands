
import { getProductById } from '@/services/productService';
import ProductView from '@/components/products/ProductView';
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import type { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductDetailPageProps {
  params: { id: string };
}

export async function generateMetadata(
  { params }: ProductDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product: Product | null = await getProductById(id);

  if (!product) {
    return {
      title: 'Product Not Found - LankaHands',
      description: 'The product you are looking for could not be found.',
    };
  }

  return {
    title: `${product.name} - LankaHands`,
    description: product.description,
    openGraph: {
        images: product.images.length > 0 ? [product.images[0]] : [],
    }
  };
}

function ProductViewSkeleton() {
    return (
        <div className="space-y-12">
            <div className="grid md:grid-cols-2 gap-8 items-start">
                <div>
                    <Skeleton className="w-full aspect-[4/3] max-w-lg rounded-lg" />
                    <div className="grid grid-cols-3 gap-2 mt-4">
                        <Skeleton className="aspect-square rounded" />
                        <Skeleton className="aspect-square rounded" />
                        <Skeleton className="aspect-square rounded" />
                    </div>
                </div>
                <div className="space-y-6">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-8 w-1/2" />
                    <div className="space-y-2 pt-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <div className="flex gap-3 pt-4">
                        <Skeleton className="h-12 flex-grow" />
                        <Skeleton className="h-12 flex-grow" />
                    </div>
                </div>
            </div>
        </div>
    );
}


async function ProductLoader({ productId }: { productId: string }) {
    const product: Product | null = await getProductById(productId);

    if (!product) {
        notFound();
    }
    return <ProductView product={product} />;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  
  return (
    <Suspense fallback={<ProductViewSkeleton />}>
        <ProductLoader productId={id} />
    </Suspense>
  );
}
