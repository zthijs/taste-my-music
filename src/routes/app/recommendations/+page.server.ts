import type { PageServerLoad } from './$types';
import { getUserRecommendations, startRecommendationGeneration } from '$lib/server/services/recommendation-service';

export const load: PageServerLoad = async ({ parent }) => {
    const { session } = await parent();

    if (!session?.user?.id) {
        return {
            recommendations: [],
            isGenerating: false
        };
    }

    try {
        const userId = session.user.id;
        const { recommendations, isStale } = await getUserRecommendations(userId);

        if (recommendations.length === 0 || isStale) {
            startRecommendationGeneration(session);

            return {
                recommendations: [],
                isGenerating: true
            };
        }

        return {
            recommendations,
            isGenerating: false
        };
    } catch (error) {
        return {
            recommendations: [],
            isGenerating: false,
            error: error instanceof Error ? error.message : 'Failed to load recommendations'
        };
    }
};
