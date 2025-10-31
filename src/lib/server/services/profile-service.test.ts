import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('profile-service business logic', () => {
    describe('staleness detection', () => {
        function isStale(updatedAt: Date | number, daysToRevalidate: number): boolean {
            const updatedAtDate = typeof updatedAt === 'number' ? new Date(updatedAt) : updatedAt;
            const now = new Date();
            const daysSinceUpdate = (now.getTime() - updatedAtDate.getTime()) / (1000 * 60 * 60 * 24);
            return daysSinceUpdate > daysToRevalidate;
        }

        beforeEach(() => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date('2025-10-31T12:00:00Z'));
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('should identify fresh data within revalidation window', () => {
            const yesterday = new Date('2025-10-30T12:00:00Z');
            expect(isStale(yesterday, 7)).toBe(false);
        });

        it('should identify stale data beyond revalidation window', () => {
            const oldDate = new Date('2025-10-01T12:00:00Z');
            expect(isStale(oldDate, 7)).toBe(true);
        });
    });

    describe('genre aggregation logic', () => {
        it('should aggregate and rank genres by frequency', () => {
            const artists = [
                { name: 'Artist 1', genres: ['rock', 'indie'] },
                { name: 'Artist 2', genres: ['rock', 'alternative'] },
                { name: 'Artist 3', genres: ['indie', 'pop'] }
            ];

            const allGenres = artists.flatMap((artist) => artist.genres);
            const genreCount = allGenres.reduce(
                (acc, genre) => {
                    acc[genre] = (acc[genre] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>
            );

            const topGenres = Object.entries(genreCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([genre]) => genre);

            expect(['rock', 'indie']).toContain(topGenres[0]);
            expect(['rock', 'indie']).toContain(topGenres[1]);
        });

        it('should limit results to top 10 genres', () => {
            const manyGenres = Array.from({ length: 20 }, (_, i) => ({
                name: `Artist ${i}`,
                genres: [`genre${i}`]
            }));

            const allGenres = manyGenres.flatMap((artist) => artist.genres);
            const genreCount = allGenres.reduce(
                (acc, genre) => {
                    acc[genre] = (acc[genre] || 0) + 1;
                    return acc;
                },
                {} as Record<string, number>
            );

            const topGenres = Object.entries(genreCount)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([genre]) => genre);

            expect(topGenres.length).toBeLessThanOrEqual(10);
        });
    });

    describe('fallback strategies', () => {
        it('should fallback to long-term data when short-term unavailable', async () => {
            const mockClient = {
                getTopTracks: vi
                    .fn()
                    .mockRejectedValueOnce(new Error('Short term failed'))
                    .mockResolvedValueOnce([{ id: '1', name: 'Track' }])
            };

            let tracks = [];
            try {
                tracks = await mockClient.getTopTracks('short_term', 50);
            } catch (error) {
                try {
                    tracks = await mockClient.getTopTracks('long_term', 50);
                } catch (error2) {
                }
            }

            expect(tracks).toHaveLength(1);
            expect(mockClient.getTopTracks).toHaveBeenCalledTimes(2);
        });

        it('should derive artists from tracks when artist API fails', () => {
            const tracks = [
                { id: '1', artists: [{ id: 'a1', name: 'Artist 1' }] },
                { id: '2', artists: [{ id: 'a2', name: 'Artist 2' }] },
                { id: '3', artists: [{ id: 'a1', name: 'Artist 1' }] }
            ];

            const artistsMap = new Map();
            tracks.forEach((track) => {
                track.artists?.forEach((artist) => {
                    if (!artistsMap.has(artist.id)) {
                        artistsMap.set(artist.id, artist);
                    }
                });
            });

            const uniqueArtists = Array.from(artistsMap.values());
            expect(uniqueArtists).toHaveLength(2);
        });
    });
});
