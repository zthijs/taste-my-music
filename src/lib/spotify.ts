import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from '$env/static/private';
import { db } from '$lib/server/db';
import { accounts } from '$lib/server/db/schema';
import { eq, and } from 'drizzle-orm';
import type { Session } from '@auth/sveltekit';
import SpotifyWebApi from 'spotify-web-api-node';

export class SessionSpotifyClient {
    private session: Session;
    private userId: string;
    private cachedClient: SpotifyWebApi | null = null;

    constructor(session: Session) {
        if (!session.user?.id) {
            throw new Error('Invalid session: user ID is required');
        }
        this.session = session;
        this.userId = session.user.id;
    }

    private async getSpotifyAccount() {
        const [account] = await db
            .select()
            .from(accounts)
            .where(and(eq(accounts.userId, this.userId), eq(accounts.provider, 'spotify')))
            .limit(1);

        return account;
    }

    private async refreshAccessToken(refreshToken: string): Promise<{
        access_token: string;
        expires_at: number;
        refresh_token?: string;
    }> {
        const spotifyApi = new SpotifyWebApi({
            clientId: SPOTIFY_CLIENT_ID,
            clientSecret: SPOTIFY_CLIENT_SECRET,
            refreshToken: refreshToken
        });

        try {
            const data = await spotifyApi.refreshAccessToken();

            return {
                access_token: data.body.access_token,
                expires_at: Math.floor(Date.now() / 1000) + data.body.expires_in,
                refresh_token: data.body.refresh_token
            };
        } catch (error: any) {
            throw new Error(`Failed to refresh access token: ${error.message || 'Unknown error'}`);
        }
    }

    async getClient(): Promise<SpotifyWebApi> {
        const account = await this.getSpotifyAccount();

        if (!account) {
            throw new Error('No Spotify account found for user');
        }

        if (!account.access_token) {
            throw new Error('No access token found in account. Please re-authenticate.');
        }

        const now = Math.floor(Date.now() / 1000);
        const expiresAt = account.expires_at || 0;
        let accessToken = account.access_token;

        if (expiresAt <= now + 300) {
            if (!account.refresh_token) {
                throw new Error('No refresh token available. Please re-authenticate with Spotify.');
            }

            const newTokens = await this.refreshAccessToken(account.refresh_token);

            await db
                .update(accounts)
                .set({
                    access_token: newTokens.access_token,
                    expires_at: newTokens.expires_at,
                    ...(newTokens.refresh_token && { refresh_token: newTokens.refresh_token })
                })
                .where(and(eq(accounts.userId, this.userId), eq(accounts.provider, 'spotify')));

            accessToken = newTokens.access_token;
        }

        const spotifyApi = new SpotifyWebApi({
            clientId: SPOTIFY_CLIENT_ID,
            clientSecret: SPOTIFY_CLIENT_SECRET,
            accessToken: accessToken!
        });

        this.cachedClient = spotifyApi;
        return spotifyApi;
    }

    getUserId(): string {
        return this.userId;
    }

    async getTopTracks(
        timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
        limit = 50
    ) {
        const client = await this.getClient();
        const data = await client.getMyTopTracks({ time_range: timeRange, limit });
        return data.body.items;
    }

    async getTopArtists(
        timeRange: 'short_term' | 'medium_term' | 'long_term' = 'medium_term',
        limit = 50
    ) {
        const client = await this.getClient();
        const data = await client.getMyTopArtists({ time_range: timeRange, limit });
        return data.body.items;
    }

    async getRecentlyPlayed(limit = 50) {
        const client = await this.getClient();
        const data = await client.getMyRecentlyPlayedTracks({ limit });
        return data.body.items;
    }

    async searchArtists(query: string, limit = 20) {
        const client = await this.getClient();
        const data = await client.searchArtists(query, { limit });
        return data.body.artists?.items || [];
    }

    async getArtist(artistId: string) {
        const client = await this.getClient();
        const data = await client.getArtist(artistId);
        return data.body;
    }

    async getArtists(artistIds: string[]) {
        const client = await this.getClient();
        const data = await client.getArtists(artistIds);
        return data.body.artists;
    }

    async getCurrentUserProfile() {
        const client = await this.getClient();
        const data = await client.getMe();
        return data.body;
    }
}