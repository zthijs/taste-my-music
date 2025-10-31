import { db } from '$lib/server/db';
import { musicProfiles, listeningData, artistRecommendations } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { SessionSpotifyClient } from '$lib/spotify';
import { getClient as getAiClient } from '$lib/ai/client';
import { createRecommendationsPrompt } from '$lib/ai/prompts';
import { AI_CONFIG, SPOTIFY_LIMITS, CACHE_CONFIG } from '$lib/constants';
import type { Session } from '@auth/sveltekit';

function isStale(createdAt: Date | number, daysToRevalidate: number): boolean {
    const createdAtDate = typeof createdAt === 'number' ? new Date(createdAt) : createdAt;
    const now = new Date();
    const daysSinceCreation = (now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceCreation > daysToRevalidate;
}

export async function generateRecommendations(session: Session) {
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
        throw new Error('Music profile not found. Please analyze your profile first.');
    }

    const [listening] = await db
        .select()
        .from(listeningData)
        .where(eq(listeningData.userId, userId))
        .limit(1);

    if (!listening) {
        throw new Error('Listening data not found. Please analyze your profile first.');
    }

    const topArtists = JSON.parse(listening.topArtists);
    const topGenres = JSON.parse(profile.topGenres);

    const spotifyClient = new SessionSpotifyClient(session);
    const followedArtists = await spotifyClient.getFollowedArtists();
    const followedArtistNames = followedArtists.map(artist => artist.name);
    const followedArtistIds = new Set(followedArtists.map(artist => artist.id.toLowerCase()));

    const prompt = createRecommendationsPrompt({
        musicProfile: profile.profileText,
        topArtists: topArtists.slice(0, 15),
        topGenres,
        followedArtists: followedArtistNames
    });

    const aiClient = getAiClient();
    const completion = await aiClient.chat.completions.create({
        model: AI_CONFIG.MODEL,
        messages: [
            {
                role: 'system',
                content: 'You are a music recommendation expert. Always respond with valid JSON only.'
            },
            {
                role: 'user',
                content: prompt
            }
        ],
        max_completion_tokens: AI_CONFIG.MAX_RECOMMENDATION_TOKENS,
        reasoning_effort: 'low' as any
    });

    const responseText = completion.choices[0]?.message?.content || '[]';

    let recommendedArtists: Array<{ artistName: string; reason: string }> = [];
    try {
        recommendedArtists = JSON.parse(responseText);
    } catch (error) {
        throw new Error('Failed to parse recommendations');
    }

    const now = new Date();

    await db.delete(artistRecommendations).where(eq(artistRecommendations.userId, userId));

    const enrichedRecommendations = [];

    for (const rec of recommendedArtists.slice(0, SPOTIFY_LIMITS.RECOMMENDATIONS)) {
        try {
            const searchResults = await spotifyClient.searchArtists(rec.artistName, 1);

            if (searchResults.length > 0) {
                const artist = searchResults[0];

                if (followedArtistIds.has(artist.id.toLowerCase())) {
                    continue;
                }

                const recommendationData = {
                    id: crypto.randomUUID(),
                    userId,
                    artistName: artist.name,
                    artistId: artist.id,
                    reason: rec.reason,
                    imageUrl: artist.images?.[0]?.url || null,
                    genres: JSON.stringify(artist.genres || []),
                    popularity: artist.popularity || 0,
                    spotifyUrl: artist.external_urls?.spotify || null,
                    createdAt: now
                };

                await db.insert(artistRecommendations).values(recommendationData as any);

                enrichedRecommendations.push({
                    artistName: artist.name,
                    artistId: artist.id,
                    reason: rec.reason,
                    imageUrl: artist.images?.[0]?.url,
                    genres: artist.genres,
                    popularity: artist.popularity,
                    spotifyUrl: artist.external_urls?.spotify
                });
            }
        } catch (err) {
            continue;
        }
    }

    return enrichedRecommendations;
}

export async function getUserRecommendations(userId: string) {
    const recommendations = await db
        .select()
        .from(artistRecommendations)
        .where(eq(artistRecommendations.userId, userId));

    const mappedRecs = recommendations.map((rec) => ({
        id: rec.id,
        artistName: rec.artistName,
        artistId: rec.artistId,
        reason: rec.reason,
        imageUrl: rec.imageUrl,
        genres: parseJSON<string[]>(rec.genres, []),
        popularity: rec.popularity,
        spotifyUrl: rec.spotifyUrl,
        createdAt: rec.createdAt
    }));

    const isStaleData = recommendations.length > 0
        ? isStale(recommendations[0].createdAt, CACHE_CONFIG.RECOMMENDATIONS_REVALIDATE_DAYS)
        : false;

    return {
        recommendations: mappedRecs,
        isStale: isStaleData
    };
}

export async function getOrCreateRecommendations(session: Session, forceRefresh = false) {
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const userId = session.user.id;
    const { recommendations, isStale: isStaleData } = await getUserRecommendations(userId);

    if (recommendations.length === 0 || isStaleData || forceRefresh) {
        await generateRecommendations(session);
        const { recommendations: newRecs } = await getUserRecommendations(userId);
        return newRecs;
    }

    return recommendations;
}

export async function startRecommendationGeneration(session: Session) {
    generateRecommendations(session).catch(err => {
        console.error('Background recommendation generation failed:', err);
    });
}

function parseJSON<T>(value: string | null, fallback: T): T {
    if (!value) return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}
