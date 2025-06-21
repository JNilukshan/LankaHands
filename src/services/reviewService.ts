
'use server';

import type { Review, Product } from '@/types';
import { adminDb } from '@/lib/firebaseConfig';

// A type for reviews that also includes product info
export type ReviewWithProductInfo = Review & { productName: string, productImageUrl?: string };

export async function getReviewsByArtisanId(artisanId: string): Promise<ReviewWithProductInfo[]> {
  if (!artisanId) return [];

  try {
    // 1. Get all products for the artisan
    const productsSnapshot = await adminDb.collection('products')
      .where('artisanId', '==', artisanId)
      .get();

    if (productsSnapshot.empty) return [];

    const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));

    // 2. For each product, get its reviews
    const allReviews: ReviewWithProductInfo[] = [];
    for (const product of products) {
      const reviewsSnapshot = await adminDb.collection('products').doc(product.id).collection('reviews').get();
      if (!reviewsSnapshot.empty) {
        reviewsSnapshot.docs.forEach(reviewDoc => {
          const reviewData = reviewDoc.data();
          allReviews.push({
            id: reviewDoc.id,
            ...reviewData,
            createdAt: reviewData.createdAt?.toDate ? reviewData.createdAt.toDate().toISOString() : new Date().toISOString(),
            productId: product.id,
            productName: product.name,
            productImageUrl: product.images?.[0],
          } as ReviewWithProductInfo);
        });
      }
    }

    // 3. Sort reviews by date, most recent first
    allReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return allReviews;
  } catch (error) {
    console.error(`Error fetching reviews for artisan ID ${artisanId}:`, error);
    return [];
  }
}
