
'use server'; // Indicates this module can contain server-side logic, callable from Server Actions or Server Components

import type { Product, Review } from '@/types';
import { adminDb } from '@/lib/firebaseConfig'; // Using Firebase Admin SDK

/**
 * Fetches all products from Firestore.
 * @returns A promise that resolves to an array of Product objects.
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const productsSnapshot = await adminDb.collection('products').where('isVisible', '==', true).get();
    if (productsSnapshot.empty) {
      console.log('No products found in Firestore.');
      return [];
    }
    const products: Product[] = productsSnapshot.docs.map(doc => {
      const data = doc.data();
      // Basic mapping, assumes Firestore data structure matches Product type.
      // Timestamps would need conversion if stored as Firestore Timestamps, e.g., .toDate()
      return {
        id: doc.id,
        name: data.name || 'Unnamed Product',
        description: data.description || '',
        price: data.price || 0,
        category: data.category || 'Uncategorized',
        images: Array.isArray(data.images) ? data.images : ['https://placehold.co/600x400.png'],
        artisanId: data.artisanId || '',
        artisanName: data.artisanName || 'Unknown Artisan', // Denormalized
        stock: data.stock !== undefined ? data.stock : 0,
        longDescription: data.longDescription || data.description || '',
        materials: data.materials || [],
        dimensions: data.dimensions || '',
        // reviews are a subcollection, so not fetched here directly by default.
      } as Product;
    });
    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    // In a real app, you might throw a custom error or return a specific error object.
    return []; // Return empty array on error to prevent breaking pages.
  }
}

/**
 * Fetches a single product by its ID from Firestore.
 * @param id The ID of the product to fetch.
 * @returns A promise that resolves to a Product object or null if not found.
 */
export async function getProductById(id: string): Promise<Product | null> {
  if (!id) {
    console.warn("getProductById called with no ID");
    return null;
  }
  try {
    const productDoc = await adminDb.collection('products').doc(id).get();
    if (!productDoc.exists) {
      console.log(`Product with ID ${id} not found.`);
      return null;
    }
    const data = productDoc.data();
    if (!data) return null;

    // Fetch reviews subcollection
    const reviewsSnapshot = await adminDb.collection('products').doc(id).collection('reviews').orderBy('createdAt', 'desc').get();
    const reviews: Review[] = reviewsSnapshot.docs.map(reviewDoc => {
        const reviewData = reviewDoc.data();
        return {
            id: reviewDoc.id,
            userId: reviewData.userId,
            userName: reviewData.userName,
            userAvatar: reviewData.userAvatar, // Assuming this is a URL
            productId: id,
            rating: reviewData.rating,
            comment: reviewData.comment,
            createdAt: reviewData.createdAt.toDate ? reviewData.createdAt.toDate().toISOString() : new Date(reviewData.createdAt).toISOString(), // Handle Firestore Timestamp
        } as Review;
    });

    return {
      id: productDoc.id,
      name: data.name || 'Unnamed Product',
      description: data.description || '',
      price: data.price || 0,
      category: data.category || 'Uncategorized',
      images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['https://placehold.co/600x400.png'],
      artisanId: data.artisanId || '',
      artisanName: data.artisanName || 'Unknown Artisan',
      stock: data.stock !== undefined ? data.stock : 0,
      longDescription: data.longDescription || data.description || '',
      materials: data.materials || [],
      dimensions: data.dimensions || '',
      reviews: reviews,
      // TODO: Fetch artisan details separately if needed and not denormalized enough
      // For now, we assume artisanName is denormalized.
    } as Product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}
