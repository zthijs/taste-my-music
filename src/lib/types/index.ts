export interface SpotifyTrack {
    id: string;
    name: string;
    artists: Array<{ name: string; id: string }>;
    album?: {
        name?: string;
        images?: Array<{ url: string; height?: number; width?: number }>;
    };
    external_urls?: { spotify: string };
    duration_ms?: number;
    popularity?: number;
}

export interface SpotifyArtist {
    id: string;
    name: string;
    genres: string[];
    images?: Array<{ url: string; height?: number; width?: number }>;
    popularity?: number;
    external_urls?: { spotify: string };
    followers?: { total?: number };
}

export interface SpotifyUser {
    id: string;
    display_name: string | null;
    email?: string;
    images?: Array<{ url: string; height: number; width: number }>;
    external_urls?: { spotify: string };
    followers?: { total: number };
}

export interface MusicProfile {
    profileText: string;
    topGenres: string[];
    updatedAt: Date;
}

export interface ListeningData {
    topTracks: SpotifyTrack[];
    topArtists: SpotifyArtist[];
    updatedAt: Date;
}

export interface ArtistRecommendation {
    id: string;
    artistName: string;
    artistId: string;
    reason: string;
    imageUrl: string | null;
    genres: string[];
    popularity: number;
    spotifyUrl: string | null;
    createdAt: number;
}
