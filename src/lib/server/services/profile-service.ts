import { db } from '$lib/server/db';
import { musicProfiles, listeningData } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { SessionSpotifyClient } from '$lib/spotify';
import { getClient as getAiClient } from '$lib/ai/client';
import { createMusicProfilePrompt } from '$lib/ai/prompts';
import { SPOTIFY_LIMITS, AI_CONFIG, TIME_RANGES, CACHE_CONFIG } from '$lib/constants';
import type { Session } from '@auth/sveltekit';
import type { SpotifyTrack, SpotifyArtist } from '$lib/types';

function isStale(updatedAt: Date | number, daysToRevalidate: number): boolean {
    const updatedAtDate = typeof updatedAt === 'number' ? new Date(updatedAt) : updatedAt;
    const now = new Date();
    const daysSinceUpdate = (now.getTime() - updatedAtDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceUpdate > daysToRevalidate;
}

export async function analyzeUserProfile(session: Session) {
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const spotifyClient = new SessionSpotifyClient(session);
    const userId = session.user.id;

    let topTracks: SpotifyTrack[] = [];
    let topArtists: SpotifyArtist[] = [];

    try {
        topTracks = await spotifyClient.getTopTracks(
            TIME_RANGES.SHORT_TERM as any,
            SPOTIFY_LIMITS.TOP_TRACKS
        );
    } catch (error) {
        try {
            topTracks = await spotifyClient.getTopTracks(
                TIME_RANGES.LONG_TERM as any,
                SPOTIFY_LIMITS.TOP_TRACKS
            );
        } catch (error2) {
            try {
                const recentlyPlayed = await spotifyClient.getRecentlyPlayed(
                    SPOTIFY_LIMITS.RECENTLY_PLAYED
                );
                topTracks = recentlyPlayed.map((item: any) => item.track);
            } catch (error3) {
                throw error3;
            }
        }
    }

    try {
        topArtists = await spotifyClient.getTopArtists(
            TIME_RANGES.SHORT_TERM as any,
            SPOTIFY_LIMITS.TOP_ARTISTS
        );
    } catch (error) {
        try {
            topArtists = await spotifyClient.getTopArtists(
                TIME_RANGES.LONG_TERM as any,
                SPOTIFY_LIMITS.TOP_ARTISTS
            );
        } catch (error2) {
            const artistsMap = new Map();
            topTracks.forEach((track) => {
                track.artists?.forEach((artist) => {
                    if (!artistsMap.has(artist.id)) {
                        artistsMap.set(artist.id, artist);
                    }
                });
            });
            topArtists = Array.from(artistsMap.values()).slice(0, 50);
        }
    }

    if (topTracks.length === 0) {
        throw new Error('No listening data available. Please listen to some music on Spotify and try again later.');
    }

    if (topArtists.length === 0) {
        throw new Error('No artist data available. Please listen to more music on Spotify and try again later.');
    }

    const allGenres = topArtists.flatMap((artist) => artist.genres);
    const genreCount = allGenres.reduce(
        (acc, genre) => {
            acc[genre] = (acc[genre] || 0) + 1;
            return acc;
        },
        {} as Record<string, number>
    );

    const topGenres = Object.entries(genreCount)
        .sort((a, b) => (b[1] as number) - (a[1] as number))
        .slice(0, 10)
        .map(([genre]) => genre);

    const now = new Date();

    const [existingData] = await db
        .select()
        .from(listeningData)
        .where(eq(listeningData.userId, userId))
        .limit(1);

    if (existingData) {
        await db
            .update(listeningData)
            .set({
                topTracks: JSON.stringify(topTracks),
                topArtists: JSON.stringify(topArtists),
                updatedAt: now
            })
            .where(eq(listeningData.userId, userId));
    } else {
        await db.insert(listeningData).values({
            id: crypto.randomUUID(),
            userId,
            topTracks: JSON.stringify(topTracks),
            topArtists: JSON.stringify(topArtists),
            recentlyPlayed: JSON.stringify([]),
            createdAt: now,
            updatedAt: now
        });
    }

    const prompt = createMusicProfilePrompt({
        topTracks,
        topArtists
    });

    let completion;
    try {
        const aiClient = getAiClient();
        completion = await aiClient.chat.completions.create({
            model: AI_CONFIG.MODEL,
            messages: [
                {
                    role: 'system',
                    content:
                        'You are an expert music analyst who creates concise, engaging music taste profiles. Always write exactly 2 sentences.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            max_completion_tokens: AI_CONFIG.MAX_PROFILE_TOKENS,
            reasoning_effort: 'low' as any
        });
    } catch (error) {
        throw new Error('Failed to generate profile with AI: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }

    const profileText = completion.choices[0]?.message?.content;

    if (!profileText || profileText.trim() === '') {
        throw new Error('AI returned empty profile. Please try again.');
    }

    const [existingProfile] = await db
        .select()
        .from(musicProfiles)
        .where(eq(musicProfiles.userId, userId))
        .limit(1);

    if (existingProfile) {
        await db
            .update(musicProfiles)
            .set({
                profileText,
                topGenres: JSON.stringify(topGenres),
                updatedAt: now
            })
            .where(eq(musicProfiles.userId, userId));
    } else {
        await db.insert(musicProfiles).values({
            id: crypto.randomUUID(),
            userId,
            profileText,
            topGenres: JSON.stringify(topGenres),
            createdAt: now,
            updatedAt: now
        });
    }

    return {
        profileText,
        topGenres,
        topArtists: topArtists.slice(0, 10),
        topTracks: topTracks.slice(0, 10)
    };
}

export async function getUserProfile(userId: string) {
    const [profile] = await db
        .select()
        .from(musicProfiles)
        .where(eq(musicProfiles.userId, userId))
        .limit(1);

    const [listening] = await db
        .select()
        .from(listeningData)
        .where(eq(listeningData.userId, userId))
        .limit(1);

    return {
        profile: profile
            ? {
                profileText: profile.profileText,
                topGenres: parseJSON<string[]>(profile.topGenres, []),
                updatedAt: profile.updatedAt,
                isStale: isStale(profile.updatedAt, CACHE_CONFIG.PROFILE_REVALIDATE_DAYS)
            }
            : null,
        listeningData: listening
            ? {
                topTracks: parseJSON<SpotifyTrack[]>(listening.topTracks, []),
                topArtists: parseJSON<SpotifyArtist[]>(listening.topArtists, []),
                updatedAt: listening.updatedAt
            }
            : null
    };
}

export async function getOrCreateUserProfile(session: Session, forceRefresh = false) {
    if (!session?.user?.id) {
        throw new Error('Unauthorized');
    }

    const userId = session.user.id;
    const { profile } = await getUserProfile(userId);

    if (!profile || profile.isStale || forceRefresh) {
        await analyzeUserProfile(session);
        const { profile: newProfile } = await getUserProfile(userId);
        return newProfile;
    }

    return profile;
}

function parseJSON<T>(value: string | null, fallback: T): T {
    if (!value) return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}
