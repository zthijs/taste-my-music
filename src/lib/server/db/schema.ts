import type { AdapterAccountType } from '@auth/sveltekit/adapters';
import { integer, sqliteTable, text, primaryKey } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('user', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text('name'),
	email: text('email').unique(),
	emailVerified: integer('emailVerified', { mode: 'timestamp_ms' }),
	image: text('image')
});

export const accounts = sqliteTable(
	'account',
	{
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		type: text('type').$type<AdapterAccountType>().notNull(),
		provider: text('provider').notNull(),
		providerAccountId: text('providerAccountId').notNull(),
		refresh_token: text('refresh_token'),
		access_token: text('access_token'),
		expires_at: integer('expires_at'),
		token_type: text('token_type'),
		scope: text('scope'),
		id_token: text('id_token'),
		session_state: text('session_state')
	},
	(account) => [
		primaryKey({
			columns: [account.provider, account.providerAccountId]
		})
	]
);

export const sessions = sqliteTable('session', {
	sessionToken: text('sessionToken').primaryKey(),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
});

export const verificationTokens = sqliteTable(
	'verificationToken',
	{
		identifier: text('identifier').notNull(),
		token: text('token').notNull(),
		expires: integer('expires', { mode: 'timestamp_ms' }).notNull()
	},
	(verificationToken) => [
		primaryKey({
			columns: [verificationToken.identifier, verificationToken.token]
		})
	]
);

export const authenticators = sqliteTable(
	'authenticator',
	{
		credentialID: text('credentialID').notNull().unique(),
		userId: text('userId')
			.notNull()
			.references(() => users.id, { onDelete: 'cascade' }),
		providerAccountId: text('providerAccountId').notNull(),
		credentialPublicKey: text('credentialPublicKey').notNull(),
		counter: integer('counter').notNull(),
		credentialDeviceType: text('credentialDeviceType').notNull(),
		credentialBackedUp: integer('credentialBackedUp', {
			mode: 'boolean'
		}).notNull(),
		transports: text('transports')
	},
	(authenticator) => [
		primaryKey({
			columns: [authenticator.userId, authenticator.credentialID]
		})
	]
);

export const musicProfiles = sqliteTable('music_profile', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	profileText: text('profileText').notNull(),
	styleSentence: text('styleSentence'),
	topGenres: text('topGenres').notNull(),
	listeningPatterns: text('listeningPatterns'),
	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull()
});

export const listeningData = sqliteTable('listening_data', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	topTracks: text('topTracks').notNull(),
	topArtists: text('topArtists').notNull(),
	recentlyPlayed: text('recentlyPlayed').notNull(),
	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull(),
	updatedAt: integer('updatedAt', { mode: 'timestamp_ms' }).notNull()
});

export const artistRecommendations = sqliteTable('artist_recommendation', {
	id: text('id')
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	userId: text('userId')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	artistName: text('artistName').notNull(),
	artistId: text('artistId').notNull(),
	reason: text('reason').notNull(),
	imageUrl: text('imageUrl'),
	genres: text('genres'),
	popularity: integer('popularity'),
	spotifyUrl: text('spotifyUrl'),
	createdAt: integer('createdAt', { mode: 'timestamp_ms' }).notNull()
});
