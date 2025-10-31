import { db } from '$lib/server/db';
import { musicProfiles, listeningData } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { getClient as getAiClient } from '$lib/ai/client';
import { createStyleSentencePrompt } from '$lib/ai/prompts';
import { AI_CONFIG } from '$lib/constants';
import type { Session } from '@auth/sveltekit';
import type { SpotifyArtist } from '$lib/types';

function parseJSON<T>(value: string | null, fallback: T): T {
    if (!value) return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}

export async function generateStyleSentence(session: Session, forceRefresh = false) {
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const userId = session.user.id;

    const [profile] = await db
        .select()
        .from(musicProfiles)
        .where(eq(musicProfiles.userId, userId))
        .limit(1);

    if (!profile) {
        throw new Error('No music profile found. Please analyze your profile first.');
    }

    if (profile.styleSentence && !forceRefresh) {
        return profile.styleSentence;
    }

    const [listening] = await db
        .select()
        .from(listeningData)
        .where(eq(listeningData.userId, userId))
        .limit(1);

    if (!listening) {
        throw new Error('No listening data found. Please analyze your profile first.');
    }

    const topArtists = parseJSON<SpotifyArtist[]>(listening.topArtists, []);
    const topGenres = parseJSON<string[]>(profile.topGenres, []);

    const prompt = createStyleSentencePrompt({
        musicProfile: profile.profileText,
        topGenres,
        topArtists
    });

    const maxCompletionTokens = 800;

    let completion;
    try {
        const aiClient = getAiClient();
        completion = await aiClient.chat.completions.create({
            model: AI_CONFIG.MODEL,
            messages: [
                {
                    role: 'system',
                    content:
                        'You are a music expert who helps people describe their taste concisely. Always write exactly one natural-sounding sentence.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_completion_tokens: maxCompletionTokens,
            reasoning_effort: 'low' as any
        });
    } catch (error) {
        throw new Error(
            'Failed to generate style sentence with AI: ' +
            (error instanceof Error ? error.message : 'Unknown error')
        );
    }

    const message = completion.choices[0]?.message;
    const styleSentence = message?.content?.trim() || (message as any)?.text?.trim();

    if (!styleSentence || styleSentence === '') {
        throw new Error('AI returned empty style sentence. Please try again.');
    }

    await db
        .update(musicProfiles)
        .set({
            styleSentence,
            updatedAt: new Date()
        })
        .where(eq(musicProfiles.userId, userId));

    return styleSentence;
}

export async function getStyleSentence(userId: string) {
    const [profile] = await db
        .select()
        .from(musicProfiles)
        .where(eq(musicProfiles.userId, userId))
        .limit(1);

    return profile?.styleSentence || null;
}
