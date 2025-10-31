<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import PageHeader from '$lib/components/page-header.svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import PlayerPlayIcon from '@tabler/icons-svelte/icons/player-play';

	let { data } = $props();

	function formatDate(date: Date): string {
		return new Date(date).toLocaleString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<svelte:head>
	<title>Music Profile - Taste My Music</title>
	<meta
		name="description"
		content="View your complete music taste profile including top artists, tracks, and genres. See your personalized music analysis based on your Spotify listening history."
	/>
	<meta
		name="keywords"
		content="music profile, spotify stats, top artists, top tracks, music genres, listening history"
	/>
</svelte:head>

<div class="space-y-4">
	<PageHeader
		title="Music Profile"
		description="Your personalized music taste analysis."
		titleClass="text-4xl font-bold tracking-tight bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
		descriptionClass="text-muted-foreground text-lg"
	/>

	{#if data.error}
		<div in:fade={{ duration: 300 }}>
			<Card class="border-destructive">
				<CardContent class="pt-6">
					<p class="text-destructive">{data.error}</p>
				</CardContent>
			</Card>
		</div>
	{/if}

	{#if !data.profile}
		<Card>
			<CardHeader>
				<CardTitle>No Profile Yet</CardTitle>
				<CardDescription
					>Analyze your listening history to create your music profile</CardDescription
				>
			</CardHeader>
			<CardContent>
				<a href="/app" data-sveltekit-preload-data="hover">
					<Button>Go to Dashboard</Button>
				</a>
			</CardContent>
		</Card>
	{:else}
		<div in:fly={{ y: 20, duration: 500, delay: 100, easing: cubicOut }}>
			<Card class="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
				<CardHeader>
					<CardTitle class="text-2xl">Profile Description</CardTitle>
					<CardDescription class="text-base">
						Based on your listening history • Last updated: {formatDate(data.profile.updatedAt)}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="prose prose-sm max-w-none dark:prose-invert">
						<p class="whitespace-pre-wrap text-base leading-relaxed">{data.profile.profileText}</p>
					</div>
				</CardContent>
			</Card>
		</div>

		{#if data.profile.topGenres.length > 0}
			<div in:fly={{ y: 20, duration: 500, delay: 200, easing: cubicOut }}>
				<Card class="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
					<CardHeader>
						<CardTitle class="text-2xl">Top Genres</CardTitle>
						<CardDescription>Your most listened-to genres</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="flex flex-wrap gap-2">
							{#each data.profile.topGenres as genre, i}
								<div in:scale={{ duration: 300, delay: 250 + i * 40, easing: cubicOut }}>
									<Badge
										variant="secondary"
										class="text-sm hover:bg-primary/20 transition-all cursor-default capitalize"
										>{genre}</Badge
									>
								</div>
							{/each}
						</div>
					</CardContent>
				</Card>
			</div>
		{/if}

		{#if data.listeningData && data.listeningData.topArtists.length > 0}
			<div in:fly={{ y: 20, duration: 500, delay: 300, easing: cubicOut }}>
				<Card class="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
					<CardHeader>
						<CardTitle class="text-2xl">Top Artists</CardTitle>
						<CardDescription>Your most listened-to artists</CardDescription>
					</CardHeader>
					<CardContent>
						<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{#each data.listeningData.topArtists.slice(0, 12) as artist, i}
								<a
									href={artist.external_urls?.spotify}
									target="_blank"
									rel="noopener noreferrer"
									in:fly={{ x: -20, duration: 400, delay: 350 + i * 50, easing: cubicOut }}
									class="flex gap-3 items-center group hover:bg-muted/50 p-2 rounded-lg transition-all cursor-pointer"
								>
									{#if artist.images?.[0]?.url}
										<img
											src={artist.images[0].url}
											alt={artist.name}
											class="h-12 w-12 rounded-full object-cover ring-2 ring-transparent group-hover:ring-primary/50 transition-all"
										/>
									{:else}
										<div
											class="h-12 w-12 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center"
										>
											<span class="text-lg">🎵</span>
										</div>
									{/if}
									<div class="flex-1 min-w-0">
										<div class="font-semibold truncate group-hover:text-primary transition-colors">
											{i + 1}. {artist.name}
										</div>
										<div class="text-xs text-muted-foreground truncate">
											{artist.genres.slice(0, 2).join(', ') || 'No genres'}
										</div>
									</div>
								</a>
							{/each}
						</div>
					</CardContent>
				</Card>
			</div>
		{/if}

		{#if data.listeningData && data.listeningData.topTracks.length > 0}
			<Card class="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
				<CardHeader>
					<CardTitle>Top Tracks</CardTitle>
					<CardDescription>Your most played songs</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="space-y-2">
						{#each data.listeningData.topTracks.slice(0, 10) as track, i}
							<div
								class="flex gap-3 items-center group hover:bg-muted/50 p-2 rounded-lg transition-all cursor-pointer"
							>
								{#if track.album?.images?.[0]?.url}
									<img
										src={track.album.images[0].url}
										alt={track.name}
										class="h-12 w-12 rounded object-cover ring-2 ring-transparent group-hover:ring-primary/50 transition-all"
									/>
								{:else}
									<div class="h-12 w-12 rounded bg-muted flex items-center justify-center">
										<span class="text-lg">🎵</span>
									</div>
								{/if}
								<div class="flex-1 min-w-0">
									<div class="font-semibold truncate group-hover:text-primary transition-colors">
										{i + 1}. {track.name}
									</div>
									<div class="text-sm text-muted-foreground truncate">
										{track.artists.map((a: any) => a.name).join(', ')}
									</div>
								</div>
								{#if track.external_urls?.spotify}
									<a
										href={track.external_urls.spotify}
										target="_blank"
										rel="noopener noreferrer"
										class="text-primary hover:text-primary/80 transition-colors"
									>
										<PlayerPlayIcon class="size-6" />
									</a>
								{/if}
							</div>
						{/each}
					</div>
				</CardContent>
			</Card>
		{/if}
	{/if}
</div>
