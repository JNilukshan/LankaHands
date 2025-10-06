
'use server';

import type { Product, Review } from '@/types';
import { adminDb } from '@/lib/firebaseConfig';
import { FieldValue }from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { unstable_cache } from 'next/cache';

/**
 * Creates a new product document in Firestore.
 * @param productData The data for the new product.
 * @returns The newly created Product object or null on error.
 */
export async function createProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'reviews'>): Promise<Product | null> {
    try {
        const newProductRef = adminDb.collection('products').doc();
        const now = FieldValue.serverTimestamp();

        const finalProductData = {
            ...productData,
            images: productData.images?.length ? productData.images : ['https://placehold.co/600x400.png'],
            isVisible: true,
            createdAt: now,
            updatedAt: now,
        };

        await newProductRef.set(finalProductData);
        
        revalidatePath('/products');
        revalidatePath('/dashboard/seller/products');

        const newProductDoc = await newProductRef.get();
        const data = newProductDoc.data();

        if (!data) return null;
        
        return {
            id: newProductDoc.id,
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
            isVisible: data.isVisible !== undefined ? data.isVisible : true,
            // Convert Firestore Timestamps to ISO strings for client compatibility
            createdAt: data.createdAt?.toDate?.().toISOString() || new Date().toISOString(),
            updatedAt: data.updatedAt?.toDate?.().toISOString() || new Date().toISOString(),
            reviews: [],
        } as Product;

    } catch (error) {
        console.error("Error creating product:", error);
        return null;
    }
}

/**
 * Updates an existing product document in Firestore.
 * @param productId The ID of the product to update.
 * @param productData The data to update.
 * @returns True if successful, false otherwise.
 */
export async function updateProduct(productId: string, productData: Partial<Omit<Product, 'id' | 'reviews'>>): Promise<boolean> {
    try {
        const productRef = adminDb.collection('products').doc(productId);
        await productRef.update({
            ...productData,
            updatedAt: FieldValue.serverTimestamp(),
        });
        
        revalidatePath(`/products/${productId}`);
        revalidatePath(`/dashboard/seller/products`);
        revalidatePath(`/dashboard/seller/products/${productId}/edit`);

        return true;
    } catch (error) {
        console.error(`Error updating product ${productId}:`, error);
        return false;
    }
}

/**
 * Deletes a product from Firestore.
 * @param productId The ID of the product to delete.
 * @returns True if successful, false otherwise.
 */
export async function deleteProduct(productId: string): Promise<boolean> {
    try {
        await adminDb.collection('products').doc(productId).delete();

        revalidatePath('/products');
        revalidatePath('/dashboard/seller/products');
        return true;
    } catch (error) {
        console.error(`Error deleting product ${productId}:`, error);
        return false;
    }
}


/**
 * Fetches all products from Firestore.
 * @returns A promise that resolves to an array of Product objects.
 */
export const getAllProducts = unstable_cache(
  async (): Promise<Product[]> => {
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
          reviews: [], // Reviews are fetched separately
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : new Date().toISOString(),
          updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : new Date().toISOString(),
        } as Product;
      });
      return products;
    } catch (error) {
      console.error("Error fetching all products:", error);
      return [];
    }
  },
  ['all-products'],
  {
    tags: ['products'],
    revalidate: 300, // Cache for 5 minutes
  }
);

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
      // .where('isVisible', '==', true) // Seller should see all their products, even hidden ones
      .get();
      
    if (productsSnapshot.empty) {
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
        artisanId: data.artisanId,
        artisanName: data.artisanName || 'Unknown Artisan',
        stock: data.stock !== undefined ? data.stock : 0,
      } as Product;
    });
    return products;
  } catch (error) {
    console.error(`Error fetching products for artisan ID ${artisanId}:`, error);
    return [];
  }
}
