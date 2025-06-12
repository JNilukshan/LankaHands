
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
      return {
        id: doc.id,
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
        reviews: [], // Reviews are typically fetched separately or on product detail page
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      } as Product;
    });
    return products;
  } catch (error) {
    console.error("Error fetching all products:", error);
    return [];
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

    const reviewsSnapshot = await adminDb.collection('products').doc(id).collection('reviews').orderBy('createdAt', 'desc').get();
    const reviews: Review[] = reviewsSnapshot.docs.map(reviewDoc => {
        const reviewData = reviewDoc.data();
        return {
            id: reviewDoc.id,
            userId: reviewData.userId,
            userName: reviewData.userName,
            userAvatar: reviewData.userAvatar,
            productId: id,
            rating: reviewData.rating,
            comment: reviewData.comment,
            reviewTitle: reviewData.reviewTitle,
            createdAt: reviewData.createdAt?.toDate ? reviewData.createdAt.toDate().toISOString() : new Date(reviewData.createdAt).toISOString(),
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
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
    } as Product;
  } catch (error) {
    console.error(`Error fetching product with ID ${id}:`, error);
    return null;
  }
}

/**
 * Fetches all products by a specific artisan ID from Firestore.
 * @param artisanId The ID of the artisan.
 * @returns A promise that resolves to an array of Product objects.
 */
export async function getProductsByArtisanId(artisanId: string): Promise<Product[]> {
  if (!artisanId) {
    console.warn("getProductsByArtisanId called with no artisanId");
    return [];
  }
  try {
    const productsSnapshot = await adminDb.collection('products')
      .where('artisanId', '==', artisanId)
      .where('isVisible', '==', true)
      .get();
      
    if (productsSnapshot.empty) {
      console.log(`No products found for artisan ID ${artisanId}.`);
      return [];
    }
    const products: Product[] = productsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unnamed Product',
        description: data.description || '',
        price: data.price || 0,
        category: data.category || 'Uncategorized',
        images: Array.isArray(data.images) && data.images.length > 0 ? data.images : ['https://placehold.co/600x400.png'],
        artisanId: data.artisanId, // Should match the queried artisanId
        artisanName: data.artisanName || 'Unknown Artisan',
        stock: data.stock !== undefined ? data.stock : 0,
        longDescription: data.longDescription || data.description || '',
        materials: data.materials || [],
        dimensions: data.dimensions || '',
        reviews: [], // Full reviews typically fetched on product detail page
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
      } as Product;
    });
    return products;
  } catch (error) {
    console.error(`Error fetching products for artisan ID ${artisanId}:`, error);
    return [];
  }
}
