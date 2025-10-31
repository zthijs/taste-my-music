export function createMusicProfilePrompt(data: {
    topTracks: Array<{ name: string; artists: Array<{ name: string }> }>;
    topArtists: Array<{ name: string; genres: string[] }>;
}) {
    const topTracksText = data.topTracks
        .slice(0, 20)
        .map((track, i) => `${i + 1}. "${track.name}" by ${track.artists.map((a) => a.name).join(', ')}`)
        .join('\n');

    const topArtistsText = data.topArtists
        .slice(0, 20)
        .map((artist, i) => `${i + 1}. ${artist.name} (${artist.genres.slice(0, 3).join(', ')})`)
        .join('\n');

    return `You are a music taste analyst. Analyze this user's Spotify listening data and create a concise, personalized music taste profile.

User's Top Tracks:
${topTracksText}

User's Top Artists:
${topArtistsText}

Based on this data, write EXACTLY TWO SENTENCES that:
1. Identify their main genres and music preferences
2. Describe their listening personality in an engaging way

Use personalized language (address the user as "you"). Be concise, insightful, and conversational.

IMPORTANT: Write exactly 2 sentences, no more, no less.`;
}

export function createRecommendationsPrompt(data: {
    musicProfile: string;
    topArtists: Array<{ name: string; genres: string[] }>;
    topGenres: string[];
    followedArtists?: string[];
}) {
    const topArtistsText = data.topArtists
        .slice(0, 15)
        .map((a) => a.name)
        .join(', ');
    const topGenresText = data.topGenres.slice(0, 10).join(', ');

    const followedArtistsText = data.followedArtists && data.followedArtists.length > 0
        ? `\n\nUser's Followed Artists (DO NOT recommend any of these):\n${data.followedArtists.join(', ')}`
        : '';

    return `You are a music recommendation expert. Based on this user's music taste profile and listening history, recommend 10 new artists they would love but might not know yet.

Music Taste Profile:
${data.musicProfile}

User's Top Artists:
${topArtistsText}

User's Top Genres:
${topGenresText}${followedArtistsText}

Generate 10 artist recommendations that:
1. Are NOT in their current top artists list
2. Are NOT in their followed artists list (if provided)
3. Match their music taste profile
4. Span a variety within their preferred genres
5. Include both established and emerging artists
6. Are specific and searchable on Spotify
7. Are artists the user likely does NOT already know about

For EACH artist, provide:
- Artist name (exact, searchable name)
- A brief reason why they'd enjoy this artist (1-2 sentences, personalized)

Format your response as a JSON array of objects with this structure:
[
  {
    "artistName": "Artist Name",
    "reason": "Why you'd love them..."
  }
]

IMPORTANT: 
- Return ONLY valid JSON, no other text
- Artist names must be exact and searchable on Spotify
- Make recommendations diverse and interesting
- NEVER recommend artists from their top artists or followed artists lists
- Focus on lesser-known artists that truly expand their musical horizons`;
}

export function createRecommendationExplanationPrompt(data: {
    artistName: string;
    userProfile: string;
    artistGenres: string[];
}) {
    return `Explain in 2-3 sentences why the artist "${data.artistName}" (genres: ${data.artistGenres.join(', ')}) is a great match for a user with this music taste profile:

${data.userProfile}

Make it personal and engaging, focusing on what specifically about this artist aligns with their taste.`;
}

export function createStyleSentencePrompt(data: {
    musicProfile: string;
    topGenres: string[];
    topArtists: Array<{ name: string; genres: string[] }>;
}) {
    const topGenresText = data.topGenres.slice(0, 5).join(', ');
    const topArtistsText = data.topArtists
        .slice(0, 10)
        .map((a) => a.name)
        .join(', ');

    return `You are a music expert who helps people describe their music taste concisely. Based on this user's music profile, create a single, natural-sounding sentence they can use when someone asks "What kind of music do you listen to?"

Music Profile:
${data.musicProfile}

Top Genres: ${topGenresText}
Top Artists: ${topArtistsText}

Create ONE sentence (15-25 words) that:
1. Sounds natural and conversational, like something a real person would say
2. Captures their main music taste without being too technical
3. Is interesting and gives a clear picture of their style
4. Includes 2-3 key genres or descriptors
5. Could mention 1-2 representative artists if relevant

IMPORTANT: 
- Write EXACTLY ONE sentence
- Make it sound natural, not like marketing copy
- Use casual, conversational language
- Don't use phrases like "I enjoy" or "I listen to" - start directly with the music description
- Return ONLY the sentence, nothing else`;
}
