export const APP_NAME = 'Taste My Music';

export const SPOTIFY_LIMITS = {
    TOP_TRACKS: 50,
    TOP_ARTISTS: 50,
    RECENTLY_PLAYED: 50,
    RECOMMENDATIONS: 10
} as const;

export const AI_CONFIG = {
    MODEL: 'gpt-5-mini-2025-08-07',
    MAX_PROFILE_TOKENS: 3000,
    MAX_RECOMMENDATION_TOKENS: 4000
} as const;

export const CACHE_CONFIG = {
    PROFILE_REVALIDATE_DAYS: 7,
    RECOMMENDATIONS_REVALIDATE_DAYS: 3
} as const;

export const SESSION_CONFIG = {
    MAX_AGE: 30 * 24 * 60 * 60
} as const;

export const TIME_RANGES = {
    SHORT_TERM: 'short_term',
    MEDIUM_TERM: 'medium_term',
    LONG_TERM: 'long_term'
} as const;

export const ROUTES = {
    HOME: '/',
    APP: '/app',
    PROFILE: '/app/profile',
    RECOMMENDATIONS: '/app/recommendations',
    BROWSE: '/app/browse',
    SETTINGS: '/app/settings',
    SIGNIN: '/signin',
    SIGNOUT: '/auth/signout'
} as const;
