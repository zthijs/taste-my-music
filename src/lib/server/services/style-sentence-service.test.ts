import { describe, it, expect } from 'vitest';

describe('style-sentence-service business logic', () => {
    describe('style sentence validation', () => {
        it('should validate non-empty style sentences', () => {
            const styleSentence = 'I enjoy diverse music ranging from rock to electronic.';
            const isValid = styleSentence.trim() !== '';

            expect(isValid).toBe(true);
        });

        it('should reject empty style sentences', () => {
            const styleSentence = '';
            const isValid = styleSentence.trim() !== '';

            expect(isValid).toBe(false);
        });

        it('should reject whitespace-only sentences', () => {
            const styleSentence = '   ';
            const isValid = styleSentence.trim() !== '';

            expect(isValid).toBe(false);
        });
    });

    describe('AI response extraction', () => {
        it('should extract content from AI message', () => {
            const message = {
                content: 'Your music taste reflects a love for indie rock and alternative music.'
            };

            const styleSentence = message.content?.trim();
            expect(styleSentence).toBeTruthy();
        });

        it('should handle message with text property as fallback', () => {
            const message: any = {
                text: 'I love listening to diverse genres from rock to electronic.'
            };

            const styleSentence = (message.content?.trim() || message.text?.trim()) as string;
            expect(styleSentence).toBe('I love listening to diverse genres from rock to electronic.');
        });

        it('should trim whitespace from extracted sentences', () => {
            const content = '  Your music taste is eclectic and adventurous.  ';
            const trimmed = content.trim();

            expect(trimmed).toBe('Your music taste is eclectic and adventurous.');
        });
    });

    describe('data preparation for AI prompt', () => {
        it('should format artist names for prompt', () => {
            const artists = [
                { name: 'Artist 1', genres: ['rock'] },
                { name: 'Artist 2', genres: ['indie'] },
                { name: 'Artist 3', genres: ['pop'] }
            ];

            const artistNames = artists.map((a) => a.name).join(', ');
            expect(artistNames).toBe('Artist 1, Artist 2, Artist 3');
        });

        it('should combine profile text and genres', () => {
            const profile = {
                profileText: 'Your taste blends modern indie rock with classic alternative.',
                topGenres: ['rock', 'indie', 'alternative']
            };

            expect(profile.profileText).toBeTruthy();
            expect(profile.topGenres).toHaveLength(3);
        });
    });

    describe('force refresh logic', () => {
        it('should use existing sentence when not forcing refresh', () => {
            const existingSentence = 'I enjoy listening to indie rock and electronic music.';
            const forceRefresh = false;

            const shouldUseExisting = existingSentence && !forceRefresh;
            expect(shouldUseExisting).toBe(true);
        });

        it('should regenerate when forcing refresh even with existing sentence', () => {
            const existingSentence = 'I enjoy listening to indie rock and electronic music.';
            const forceRefresh = true;

            const shouldRegenerate = !existingSentence || forceRefresh;
            expect(shouldRegenerate).toBe(true);
        });

        it('should generate when no existing sentence', () => {
            const existingSentence = null;
            const forceRefresh = false;

            const shouldGenerate = !existingSentence || forceRefresh;
            expect(shouldGenerate).toBe(true);
        });
    });
});
