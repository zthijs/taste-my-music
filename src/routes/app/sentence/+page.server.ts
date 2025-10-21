import type { PageServerLoad, Actions } from './$types';
import { generateStyleSentence, getStyleSentence } from '$lib/server/services/style-sentence-service';
import { getUserProfile } from '$lib/server/services/profile-service';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();

    if (!session?.user?.id) {
        return {
            session,
            styleSentence: null,
            profile: null,
            error: 'Please sign in to view your style sentence'
        };
    }

    try {
        const { profile } = await getUserProfile(session.user.id);

        if (!profile) {
            return {
                session,
                styleSentence: null,
                profile: null,
                error: 'No music profile found. Please analyze your profile first on the dashboard.'
            };
        }

        let styleSentence = await getStyleSentence(session.user.id);

        if (!styleSentence) {
            try {
                styleSentence = await generateStyleSentence(session, false);
            } catch (genError) {
                return {
                    session,
                    styleSentence: null,
                    profile,
                    error: genError instanceof Error ? genError.message : 'Failed to generate style sentence',
                    isGenerating: false
                };
            }
        }

        return {
            session,
            styleSentence,
            profile,
            error: null
        };
    } catch (error) {
        return {
            session,
            styleSentence: null,
            profile: null,
            error: error instanceof Error ? error.message : 'Failed to load style sentence'
        };
    }
};

export const actions: Actions = {
    regenerate: async ({ locals }) => {
        const session = await locals.auth();

        if (!session?.user?.id) {
            return fail(401, { error: 'Unauthorized' });
        }

        try {
            const styleSentence = await generateStyleSentence(session, true);
            return { success: true, styleSentence };
        } catch (error) {
            return fail(500, {
                error: error instanceof Error ? error.message : 'Failed to regenerate style sentence'
            });
        }
    }
};
