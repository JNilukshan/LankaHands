
import ReviewWizardClient from '@/components/products/ReviewWizardClient';
import { getProductById } from '@/services/productService';

async function getProductNameForReview(productId: string): Promise<string> {
  const product = await getProductById(productId);
  return product?.name || "the Product";
}

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const productName = await getProductNameForReview(params.id);

  return (
    <div className="py-8">
      <ReviewWizardClient productName={productName} productId={params.id} />
    </div>
  );
}
