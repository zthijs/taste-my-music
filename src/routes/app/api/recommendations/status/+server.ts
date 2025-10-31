import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getUserRecommendations } from '$lib/server/services/recommendation-service';

export const GET: RequestHandler = async ({ locals }) => {
    const session = await locals.auth();

    if (!session?.user?.id) {
        return json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { recommendations } = await getUserRecommendations(session.user.id);

        return json({
            hasRecommendations: recommendations.length > 0,
            count: recommendations.length
        });
    } catch (error) {
        return json(
            { error: error instanceof Error ? error.message : 'Failed to check status' },
            { status: 500 }
        );
    }
};
