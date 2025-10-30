import type { PageServerLoad, Actions } from './$types';
import { getOrCreateUserProfile } from '$lib/server/services/profile-service';
import { getOrCreateRecommendations } from '$lib/server/services/recommendation-service';
import { fail } from '@sveltejs/kit';
import { dev } from '$app/environment';

export const load: PageServerLoad = async ({ parent }) => {
    const { session } = await parent();

    if (!session?.user?.id) {
        return {
            profile: null,
            recommendations: [],
            isInitializing: false,
            isDevelopment: dev
        };
    }

    try {
        const [profile, recommendations] = await Promise.all([
            getOrCreateUserProfile(session),
            getOrCreateRecommendations(session)
        ]);

        return {
            profile: profile ? {
                profileText: profile.profileText,
                topGenres: profile.topGenres,
                updatedAt: profile.updatedAt
            } : null,
            recommendations: recommendations.slice(0, 6),
            isInitializing: false,
            isDevelopment: dev
        };
    } catch (error) {
        return {
            profile: null,
            recommendations: [],
            isInitializing: true,
            isDevelopment: dev,
            error: error instanceof Error ? error.message : 'Failed to load data'
        };
    }
}

export const actions: Actions = {
    refreshProfile: async ({ locals }) => {
        if (!dev) {
            return fail(403, { error: 'Action not available in production' });
        }

        const session = await locals.auth();

        if (!session?.user?.id) {
            return fail(401, { error: 'Unauthorized' });
        }

        try {
            await getOrCreateUserProfile(session, true);
            return { success: true };
        } catch (error) {
            return fail(500, { error: error instanceof Error ? error.message : 'Failed to refresh profile' });
        }
    },

    refreshRecommendations: async ({ locals }) => {
        if (!dev) {
            return fail(403, { error: 'Action not available in production' });
        }

        const session = await locals.auth();

        if (!session?.user?.id) {
            return fail(401, { error: 'Unauthorized' });
        }

        try {
            await getOrCreateRecommendations(session, true);
            return { success: true };
        } catch (error) {
            return fail(500, { error: error instanceof Error ? error.message : 'Failed to refresh recommendations' });
        }
    }
};
