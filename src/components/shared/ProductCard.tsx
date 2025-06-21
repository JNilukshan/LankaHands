
import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block relative w-full h-60">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            style={{ objectFit: 'cover' }}
            data-ai-hint="handicraft product"
          />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-lg font-headline mb-1 hover:text-primary transition-colors">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </CardTitle>
        {product.artisanName && (
          <CardDescription className="text-xs text-muted-foreground mb-1">
            By <Link href={`/artisans/${product.artisanId}`} className="hover:underline text-accent">{product.artisanName}</Link>
          </CardDescription>
        )}
        <p className="text-sm text-foreground/80 line-clamp-2 mb-2">
          {product.description}
        </p>
        {product.stock !== undefined && (
          <p className={`text-xs mb-2 ${product.stock > 0 ? 'text-muted-foreground' : 'text-destructive font-semibold'}`}>
            {product.stock > 0 ? `Availability: In Stock (${product.stock})` : 'Availability: Out of Stock'}
          </p>
        )}
        <div className="flex items-center justify-between mb-2">
          <p className="text-lg font-semibold text-primary">
            ${product.price.toFixed(2)}
          </p>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button variant="default" className="w-full bg-primary hover:bg-primary/90" asChild>
          <Link href={`/products/${product.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
