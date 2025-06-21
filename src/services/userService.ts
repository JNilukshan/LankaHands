
'use server';

import type { User } from '@/types';
import { adminDb } from '@/lib/firebaseConfig';

/**
 * Fetches all users who are following a specific artisan.
 * @param artisanId The ID of the artisan.
 * @returns A promise that resolves to an array of simplified User objects (followers).
 */
export async function getFollowersByArtisanId(artisanId: string): Promise<Pick<User, 'uid' | 'name' | 'profileImageUrl'>[]> {
  if (!artisanId) return [];
  try {
    const followersSnapshot = await adminDb.collection('users')
      .where('followedArtisans', 'array-contains', artisanId)
      .get();

    if (followersSnapshot.empty) {
      return [];
    }

    const followers: Pick<User, 'uid' | 'name' | 'profileImageUrl'>[] = followersSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: doc.id,
        name: data.name || 'Unnamed User',
        profileImageUrl: data.profileImageUrl || 'https://placehold.co/128x128.png',
      };
    });

    return followers;
  } catch (error) {
    console.error(`Error fetching followers for artisan ID ${artisanId}:`, error);
    return [];
  }
}
