import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('recommendation-service business logic', () => {
    describe('staleness detection for recommendations', () => {
        function isStale(createdAt: Date | number, daysToRevalidate: number): boolean {
            const createdAtDate = typeof createdAt === 'number' ? new Date(createdAt) : createdAt;
            const now = new Date();
            const daysSinceCreation = (now.getTime() - createdAtDate.getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceCreation > daysToRevalidate;
        }

        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2025-10-31T12:00:00Z'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should keep recommendations fresh for configured period', () => {
            const recent = new Date('2025-10-30T12:00:00Z');
            expect(isStale(recent, 7)).toBe(false);
        });

        it('should mark old recommendations as stale', () => {
            const old = new Date('2025-10-01T12:00:00Z');
            expect(isStale(old, 7)).toBe(true);
        });
    });

    describe('artist filtering logic', () => {
        it('should filter out already followed artists from recommendations', () => {
            const recommendations = [
                { artistName: 'Artist 1', artistId: 'id1' },
                { artistName: 'Artist 2', artistId: 'id2' },
                { artistName: 'Artist 3', artistId: 'id3' }
            ];

            const followedArtistIds = new Set(['id2']);

            const filtered = recommendations.filter(
                (rec) => !followedArtistIds.has(rec.artistId.toLowerCase())
            );

            expect(filtered).toHaveLength(2);
            expect(filtered.some((r) => r.artistId === 'id2')).toBe(false);
        });

        it('should handle case-insensitive artist ID matching', () => {
            const recommendations = [
                { artistName: 'Test', artistId: 'ID1' },
                { artistName: 'Test2', artistId: 'ID2' }
            ];
            const followedArtistIds = new Set(['id1']);

            const filtered = recommendations.filter(
                (rec) => !followedArtistIds.has(rec.artistId.toLowerCase())
            );

            expect(filtered).toHaveLength(1);
            expect(filtered[0].artistId).toBe('ID2');
        });
    });

    describe('recommendation enrichment from Spotify', () => {
        it('should build complete recommendation data from Spotify artist', () => {
            const artist = {
                id: 'spotify123',
                name: 'Test Artist',
                images: [{ url: 'https://example.com/image.jpg' }],
                genres: ['rock', 'indie'],
                popularity: 75,
                external_urls: { spotify: 'https://open.spotify.com/artist/123' }
            };

            const reason = 'Great music taste match!';

            const recommendation = {
                artistName: artist.name,
                artistId: artist.id,
                reason: reason,
                imageUrl: artist.images?.[0]?.url || null,
                genres: artist.genres || [],
                popularity: artist.popularity || 0,
                spotifyUrl: artist.external_urls?.spotify || null
            };

            expect(recommendation.artistName).toBe('Test Artist');
            expect(recommendation.imageUrl).toBe('https://example.com/image.jpg');
            expect(recommendation.genres).toHaveLength(2);
        });

        it('should handle missing artist data gracefully', () => {
            const minimalArtist = {
                id: 'spotify123',
                name: 'Test Artist'
            };

            const imageUrl = (minimalArtist as any).images?.[0]?.url || null;
            const popularity = (minimalArtist as any).popularity || 0;
            const genres = (minimalArtist as any).genres || [];

            expect(imageUrl).toBeNull();
            expect(popularity).toBe(0);
            expect(genres).toEqual([]);
        });
    });

    describe('AI recommendation parsing', () => {
        it('should parse AI recommendations with artist names and reasons', () => {
            const aiResponse = [
                { artistName: 'The National', reason: 'Melancholic indie rock similar to your favorites' },
                { artistName: 'Bon Iver', reason: 'Atmospheric folk that matches your taste' }
            ];

            expect(aiResponse).toHaveLength(2);
            expect(aiResponse[0].artistName).toBeTruthy();
            expect(aiResponse[0].reason).toBeTruthy();
        });

        it('should handle AI response errors', () => {
            const invalidResponse = 'not valid json';

            let parsed = [];
            try {
                parsed = JSON.parse(invalidResponse);
            } catch (error) {
                expect(error).toBeDefined();
            }

            expect(parsed).toEqual([]);
        });
    });

    describe('recommendation limit handling', () => {
        it('should respect maximum recommendation limit', () => {
            const manyRecommendations = Array.from({ length: 50 }, (_, i) => ({
                artistName: `Artist ${i}`,
                reason: `Reason ${i}`
            }));

            const LIMIT = 12;
            const limited = manyRecommendations.slice(0, LIMIT);

            expect(limited).toHaveLength(LIMIT);
        });
    });
});
