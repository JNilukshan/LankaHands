
import ReviewWizardClient from '@/components/products/ReviewWizardClient';
import { getMockProductById } from '@/lib/mock-data'; // Import from new mock data source

async function getProductNameForReview(productId: string): Promise<string> {
  const product = await getMockProductById(productId); // Use new mock data function
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

    