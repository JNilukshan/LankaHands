import ReviewWizardClient from '@/components/products/ReviewWizardClient';
import type { Product } from '@/types'; // Assuming types are defined

// Placeholder function to get product name - in a real app, this would fetch data
async function getProductName(productId: string): Promise<string> {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 100));
  const products: Record<string, Pick<Product, 'name'>> = {
    '101': { name: 'Ocean Breeze Batik Saree' },
    '102': { name: 'Hand-Carved Elephant Statue' },
    // ... other products
  };
  return products[productId]?.name || "the Product";
}

export default async function ReviewPage({ params }: { params: { id: string } }) {
  const productName = await getProductName(params.id);

  return (
    <div className="py-8">
      <ReviewWizardClient productName={productName} productId={params.id} />
    </div>
  );
}
