
'use server';

import type { Review, Product } from '@/types';
import { adminDb } from '@/lib/firebaseConfig';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

// A type for reviews that also includes product info
export type ReviewWithProductInfo = Review & { productName: string, productImageUrl?: string };

export interface SubmitReviewData {
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  reviewTitle?: string;
  comment: string;
}

export async function submitReview(data: SubmitReviewData): Promise<{ success: boolean; message: string; }> {
  const { productId, userId, userName, userAvatar, rating, reviewTitle, comment } = data;
  
  // Validate required fields
  if (!productId || !userId || !rating || !comment) {
      console.error('submitReview: Missing required data:', { productId, userId, rating: !!rating, comment: !!comment });
      return { success: false, message: 'Missing required review data.' };
  }

  console.log('submitReview: Starting submission with data:', { productId, userId, userName, rating, reviewTitle, comment: comment.substring(0, 50) + '...' });

  try {
      // Check if product exists first
      const productDoc = await adminDb.collection('products').doc(productId).get();
      if (!productDoc.exists) {
        console.error('submitReview: Product not found:', productId);
        return { success: false, message: "Cannot submit a review for a product that doesn't exist." };
      }

      // Create review reference
      const reviewRef = adminDb.collection('products').doc(productId).collection('reviews').doc();
      console.log('submitReview: Created review reference:', reviewRef.path);

      // Prepare review data - exclude undefined fields completely
      const newReviewData: any = {
          userId,
          userName,
          rating,
          reviewTitle: reviewTitle || '',
          comment,
          createdAt: FieldValue.serverTimestamp(),
      };

      // Only add userAvatar if it exists and is not undefined
      if (userAvatar && userAvatar.trim() !== '') {
          newReviewData.userAvatar = userAvatar;
      }

      console.log('submitReview: Submitting review data:', newReviewData);
      
      // Submit the review
      await reviewRef.set(newReviewData);
      console.log('submitReview: Review submitted successfully to:', reviewRef.path);

      // Revalidate the product page
      revalidatePath(`/products/${productId}`);
      console.log('submitReview: Revalidated path:', `/products/${productId}`);

      return { success: true, message: 'Your review has been submitted!' };
  } catch (error) {
      console.error("submitReview: Error occurred:", error);
      console.error("submitReview: Error details:", {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      return { success: false, message: 'There was an error submitting your review.' };
  }
}

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
