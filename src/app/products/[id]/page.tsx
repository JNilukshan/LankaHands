
import { getProductById } from '@/services/productService'; // Import new service
import ProductView from '@/components/products/ProductView'; // Import the new client component
import { notFound } from 'next/navigation';
import type { Product } from '@/types';
import type { Metadata, ResolvingMetadata } from 'next';

interface ProductDetailPageProps {
  params: { id: string };
}

// Optional: Generate dynamic metadata for SEO
export async function generateMetadata(
  { params }: ProductDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product: Product | null = await getProductById(params.id);

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


export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product: Product | null = await getProductById(params.id);

  if (!product) {
    notFound(); // This will render the nearest not-found.js file or a default Next.js 404 page
  }

  // The ProductView component now handles all client-side logic and rendering
  return <ProductView product={product} />;
}
