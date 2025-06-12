
'use server';

import type { Artisan } from '@/types';
import { adminDb } from '@/lib/firebaseConfig';

/**
 * Fetches all artisans from Firestore.
 * @returns A promise that resolves to an array of Artisan objects.
 */
export async function getAllArtisans(): Promise<Artisan[]> {
  try {
    // Assuming your artisans are stored in a collection named 'artisanProfiles'
    // or 'artisans'. Adjust collection name if different.
    const artisansSnapshot = await adminDb.collection('artisanProfiles').get();
    if (artisansSnapshot.empty) {
      console.log('No artisans found in Firestore.');
      return [];
    }
    const artisans: Artisan[] = artisansSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || data.publicName || 'Unnamed Artisan',
        bio: data.bio || '',
        profileImageUrl: data.profileImageUrl || 'https://placehold.co/300x300.png',
        followers: data.followersCount || 0,
        averageRating: data.averageRating || 0,
        location: data.location || 'Unknown Location',
        speciality: data.speciality || 'General Artisan',
        // Ensure all fields match the Artisan type, add defaults if necessary
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

    // Here you might also want to fetch products by this artisan if needed directly
    // or let the artisan page handle that separately.

    return {
      id: artisanDoc.id,
      name: data.name || data.publicName || 'Unnamed Artisan',
      email: data.email,
      bio: data.bio || '',
      profileImageUrl: data.profileImageUrl || 'https://placehold.co/300x300.png',
      followers: data.followersCount || 0,
      averageRating: data.averageRating || 0,
      location: data.location || 'Unknown Location',
      speciality: data.speciality || 'General Artisan',
      shippingSettings: data.shippingSettings,
      storePolicies: data.storePolicies,
    } as Artisan;
  } catch (error) {
    console.error(`Error fetching artisan with ID ${id}:`, error);
    return null;
  }
}
