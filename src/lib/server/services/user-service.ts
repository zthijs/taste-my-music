import { db } from '$lib/server/db';
import { users, accounts, sessions, musicProfiles, listeningData, artistRecommendations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export async function deleteUserAccount(userId: string): Promise<void> {
    if (!userId) {
        throw new Error('User ID is required');
    }

    try {
        await db.delete(artistRecommendations).where(eq(artistRecommendations.userId, userId));
        await db.delete(listeningData).where(eq(listeningData.userId, userId));
        await db.delete(musicProfiles).where(eq(musicProfiles.userId, userId));
        await db.delete(sessions).where(eq(sessions.userId, userId));
        await db.delete(accounts).where(eq(accounts.userId, userId));
        await db.delete(users).where(eq(users.id, userId));
    } catch (error) {
        console.error('Error deleting user account:', error);
        throw new Error('Failed to delete user account. Please try again.');
    }
}
