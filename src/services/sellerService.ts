
'use server';

import type { SellerStats } from '@/types';
import { adminDb } from '@/lib/firebaseConfig';

export async function getSellerStats(artisanId: string): Promise<SellerStats | null> {
    if (!artisanId) return null;

    try {
        const artisanDoc = await adminDb.collection('artisanProfiles').doc(artisanId).get();
        if (!artisanDoc.exists) return null;
        const artisan = artisanDoc.data();

        // Check if the profile is using the default bio, indicating it's likely incomplete.
        const isProfileIncomplete = artisan?.bio === "Welcome to my artisan store! I'm excited to share my creations with you.";

        const productsSnapshot = await adminDb.collection('products').where('artisanId', '==', artisanId).get();
        const ordersSnapshot = await adminDb.collection('orders').where('artisanId', '==', artisanId).get();

        const totalSales = ordersSnapshot.docs
            .map(doc => doc.data())
            .filter(order => order.status === 'Delivered')
            .reduce((sum, order) => sum + order.totalAmount, 0);
            
        const pendingOrders = ordersSnapshot.docs.filter(doc => doc.data().status === 'Pending').length;
        
        let totalReviews = 0;
        // Using a for...of loop to allow await inside
        for (const doc of productsSnapshot.docs) {
            const reviewsSnapshot = await doc.ref.collection('reviews').count().get();
            totalReviews += reviewsSnapshot.data().count;
        }

        return {
            totalSales: totalSales,
            averageRating: artisan?.averageRating || 0,
            followers: artisan?.followers || 0,
            totalReviews: totalReviews,
            productsCount: productsSnapshot.size,
            pendingOrders: pendingOrders,
            isProfileIncomplete: isProfileIncomplete,
        };
    } catch (error) {
        console.error(`Error fetching seller stats for artisan ID ${artisanId}:`, error);
        return null;
    }
}

    