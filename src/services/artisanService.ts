
'use server';

import type { Artisan } from '@/types';
import { adminDb } from '@/lib/firebaseConfig';
import { revalidatePath } from 'next/cache';

/**
 * Fetches all artisans from Firestore.
 * @returns A promise that resolves to an array of Artisan objects.
 */
export async function getAllArtisans(): Promise<Artisan[]> {
  try {
    const artisansSnapshot = await adminDb.collection('artisanProfiles').get();
    if (artisansSnapshot.empty) {
      console.log('No artisans found in Firestore.');
      return [];
    }
    const artisans: Artisan[] = artisansSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || 'Unnamed Artisan',
        bio: data.bio || '',
        profileImageUrl: data.profileImageUrl || 'https://placehold.co/300x300.png',
        followers: data.followers || 0,
        averageRating: data.averageRating || 0,
        location: data.location || 'Unknown Location',
        speciality: data.speciality || 'General Artisan',
      } as Artisan;
    });
    return artisans;
  } catch (error) {
    console.error("Error fetching all artisans:", error);
    return [];
  }
}

/**
 * Fetches a single artisan by their ID from Firestore.
 * @param id The ID of the artisan to fetch.
 * @returns A promise that resolves to an Artisan object or null if not found.
 */
export async function getArtisanById(id: string): Promise<Artisan | null> {
  if (!id) {
    console.warn("getArtisanById called with no ID");
    return null;
  }
  try {
    const artisanDoc = await adminDb.collection('artisanProfiles').doc(id).get();
    if (!artisanDoc.exists) {
      console.log(`Artisan with ID ${id} not found.`);
      return null;
    }
    const data = artisanDoc.data();
    if (!data) return null;

    return {
      id: artisanDoc.id,
      ...data,
      // Ensure date fields are converted if they exist
      createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt,
    } as Artisan;
  } catch (error) {
    console.error(`Error fetching artisan with ID ${id}:`, error);
    return null;
  }
}

/**
 * Updates an artisan's profile in Firestore using a robust set-merge operation.
 * @param artisanId The ID of the artisan to update.
 * @param dataToUpdate The data to update.
 * @returns True if successful, false otherwise.
 */
export async function updateArtisanProfile(artisanId: string, dataToUpdate: Partial<Artisan>): Promise<boolean> {
  if (!artisanId) {
    console.error("updateArtisanProfile called with no artisanId");
    return false;
  }
  try {
    const artisanRef = adminDb.collection('artisanProfiles').doc(artisanId);
    // Use set with merge:true for a more robust update. This will create the document if it doesn't exist
    // and update fields without overwriting the entire document.
    await artisanRef.set({
        ...dataToUpdate,
        updatedAt: new Date().toISOString(),
    }, { merge: true });

    // Revalidate paths to ensure data is fresh across the app
    revalidatePath(`/artisans/${artisanId}`);
    revalidatePath(`/dashboard/seller/settings`);
    
    return true;
  } catch (error) {
    console.error(`Error updating artisan profile for ${artisanId}:`, error);
    return false;
  }
}
