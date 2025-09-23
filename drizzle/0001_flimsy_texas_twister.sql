CREATE TABLE `artist_recommendation` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`artistName` text NOT NULL,
	`artistId` text NOT NULL,
	`reason` text NOT NULL,
	`imageUrl` text,
	`genres` text,
	`popularity` integer,
	`spotifyUrl` text,
	`createdAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `listening_data` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`topTracks` text NOT NULL,
	`topArtists` text NOT NULL,
	`recentlyPlayed` text NOT NULL,
	`audioFeatures` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `music_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`userId` text NOT NULL,
	`profileText` text NOT NULL,
	`topGenres` text NOT NULL,
	`listeningPatterns` text,
	`audioFeaturesSummary` text,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
