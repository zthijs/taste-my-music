import type { PageServerLoad } from './$types';
import { getOrCreateRecommendations } from '$lib/server/services/recommendation-service';

export const load: PageServerLoad = async ({ parent }) => {
    const { session } = await parent();

    if (!session?.user?.id) {
        return {
            recommendations: [],
            isInitializing: false
        };
    }

    try {
        const recommendations = await getOrCreateRecommendations(session);

        return {
            recommendations,
            isInitializing: false
        };
    } catch (error) {
        return {
            recommendations: [],
            isInitializing: true,
            error: error instanceof Error ? error.message : 'Failed to load recommendations'
        };
    }
};
