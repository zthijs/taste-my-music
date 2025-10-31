import type { PageServerLoad, Actions } from './$types';
import { deleteUserAccount } from '$lib/server/services/user-service';
import { signOut } from '$lib/auth';
import { fail, redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
    const session = await locals.auth();

    return {
        session
    };
};

export const actions: Actions = {
    deleteAccount: async (event) => {
        const session = await event.locals.auth();

        if (!session?.user?.id) {
            return fail(401, { error: 'Unauthorized' });
        }

        try {
            await deleteUserAccount(session.user.id);
            await signOut(event);
            redirect(307, '/auth/signin');
        } catch (error) {
            if (error instanceof Response && error.status === 303) {
                throw error;
            }

            console.error('Error deleting account:', error);
            return fail(500, {
                error: error instanceof Error ? error.message : 'Failed to delete account. Please try again.'
            });
        }
    }
};
