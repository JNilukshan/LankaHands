
'use server';

import { adminDb } from '@/lib/firebaseConfig';
import { FieldValue } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';

/**
 * Follows an artisan, updating both the user's and artisan's documents in a transaction.
 * @param userId The ID of the user initiating the follow.
 * @param artisanId The ID of the artisan being followed.
 * @returns A promise that resolves to an object with success status and a message.
 */
export async function followArtisan(userId: string, artisanId: string) {
  if (!userId || !artisanId || userId === artisanId) {
    return { success: false, message: "Invalid request." };
  }

  const userRef = adminDb.collection('users').doc(userId);
  const artisanRef = adminDb.collection('artisanProfiles').doc(artisanId);

  try {
    await adminDb.runTransaction(async (transaction) => {
      // It's good practice to get the documents within the transaction to ensure atomicity
      const artisanDoc = await transaction.get(artisanRef);
      if (!artisanDoc.exists) {
        throw new Error("Artisan profile not found.");
      }

      // Update user's followedArtisans list
      transaction.update(userRef, {
        followedArtisans: FieldValue.arrayUnion(artisanId),
      });

      // Increment artisan's followers count
      transaction.update(artisanRef, {
        followers: FieldValue.increment(1),
      });
    });

    revalidatePath(`/artisans/${artisanId}`);
    revalidatePath(`/profile`);

    const artisanData = (await artisanRef.get()).data();
    return { success: true, message: `You are now following ${artisanData?.name || 'this artisan'}.` };

  } catch (error: any) {
    console.error("Error following artisan:", error);
    return { success: false, message: `Could not follow artisan. ${error.message}` };
  }
}

/**
 * Unfollows an artisan, updating both documents in a transaction.
 * @param userId The ID of the user initiating the unfollow.
 * @param artisanId The ID of the artisan being unfollowed.
 * @returns A promise that resolves to an object with success status and a message.
 */
export async function unfollowArtisan(userId: string, artisanId: string) {
  if (!userId || !artisanId) {
    return { success: false, message: "Invalid request." };
  }

  const userRef = adminDb.collection('users').doc(userId);
  const artisanRef = adminDb.collection('artisanProfiles').doc(artisanId);

  try {
    await adminDb.runTransaction(async (transaction) => {
      const artisanDoc = await transaction.get(artisanRef);
      if (!artisanDoc.exists) {
        // Even if artisan doesn't exist, we should proceed to clean up user's list
        console.warn(`Attempting to unfollow a non-existent artisan profile: ${artisanId}`);
      }

      // Update user's followedArtisans list
      transaction.update(userRef, {
        followedArtisans: FieldValue.arrayRemove(artisanId),
      });
      
      // Decrement artisan's followers count only if it exists and count > 0
      if (artisanDoc.exists && (artisanDoc.data()?.followers || 0) > 0) {
        transaction.update(artisanRef, {
          followers: FieldValue.increment(-1),
        });
      }
    });

    revalidatePath(`/artisans/${artisanId}`);
    revalidatePath(`/profile`);
    
    const artisanData = (await artisanRef.get()).data();
    return { success: true, message: `You have unfollowed ${artisanData?.name || 'this artisan'}.` };

  } catch (error: any) {
    console.error("Error unfollowing artisan:", error);
    return { success: false, message: `Could not unfollow artisan. ${error.message}` };
  }
}
