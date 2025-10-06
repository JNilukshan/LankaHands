
import ReviewWizardClient from '@/components/products/ReviewWizardClient';
import { getProductById } from '@/services/productService';

async function getProductNameForReview(productId: string): Promise<string> {
  const product = await getProductById(productId);
  return product?.name || "the Product";
}

export default async function ProductReviewPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const productName = await getProductNameForReview(id);

  return (
    <div className="py-8">
      <ReviewWizardClient productName={productName} productId={id} />
    </div>
  );
}
