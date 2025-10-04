import type { PageServerLoad } from './$types';
import { SessionSpotifyClient } from '$lib/spotify';
import { getOrCreateUserProfile } from '$lib/server/services/profile-service';
import { getUserProfile } from '$lib/server/services/profile-service';

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    if (!session?.user?.id) {
        return {
            spotifyUser: null,
            profile: null,
            listeningData: null,
            isInitializing: false
        };
    }

    try {
        const spotify = new SessionSpotifyClient(session);
        const client = await spotify.getClient();
        const spotifyUser = await client.getMe();

        await getOrCreateUserProfile(session);
        const { profile, listeningData } = await getUserProfile(session.user.id);

        return {
            spotifyUser: spotifyUser.body,
            profile,
            listeningData,
            isInitializing: false
        };
    } catch (error) {
        return {
            spotifyUser: null,
            profile: null,
            listeningData: null,
            isInitializing: true,
            error: error instanceof Error ? error.message : 'Failed to load profile data'
        };
    }
};
