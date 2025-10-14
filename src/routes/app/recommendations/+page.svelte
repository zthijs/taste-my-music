<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import RecommendationsSkeleton from '$lib/components/skeletons/recommendations-skeleton.svelte';
	import ArtistCard from '$lib/components/artist-card.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { data } = $props();

	let searchQuery = $state('');

	let filteredRecommendations = $derived(
		searchQuery
			? data.recommendations.filter(
					(rec) =>
						rec.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
						rec.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
						rec.genres.some((g: string) => g.toLowerCase().includes(searchQuery.toLowerCase()))
				)
			: data.recommendations
	);
</script>

<svelte:head>
	<title>Artist Recommendations - Taste My Music</title>
	<meta
		name="description"
		content="Discover new artists with AI-powered recommendations tailored to your music taste. Get personalized suggestions based on your Spotify listening habits."
	/>
	<meta
		name="keywords"
		content="music recommendations, artist discovery, AI music, spotify recommendations, new music, personalized music"
	/>
</svelte:head>

<div class="space-y-4">
	<PageHeader
		title="Recommendations"
		description="AI-powered music recommendations based on your taste."
	/>

	{#if data.isInitializing}
		<div in:fade={{ duration: 300 }}>
			<RecommendationsSkeleton />
		</div>
	{:else if data.recommendations.length === 0}
		<Card>
			<CardHeader>
				<CardTitle>Generating Your Recommendations</CardTitle>
				<CardDescription>
					Your personalized artist recommendations are being created...
				</CardDescription>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-muted-foreground mb-4">
					This usually takes a few moments. Please refresh the page if you don't see recommendations
					soon.
				</p>
				<a href="/app" data-sveltekit-preload-data="hover">
					<Button variant="outline">Go to Dashboard</Button>
				</a>
			</CardContent>
		</Card>
	{:else}
		<div
			in:fly={{ y: 20, duration: 500, delay: 100, easing: cubicOut }}
			class="flex items-center gap-4"
		>
			<Input
				type="search"
				placeholder="Search recommendations..."
				bind:value={searchQuery}
				class="max-w-md transition-all focus:ring-2 focus:ring-primary/50"
			/>
			<span class="text-sm text-muted-foreground font-medium">
				{filteredRecommendations.length}
				{filteredRecommendations.length === 1 ? 'artist' : 'artists'}
			</span>
		</div>

		<div class="grid gap-4 md:grid-cols-2">
			{#each filteredRecommendations as rec, i}
				<ArtistCard
					artistName={rec.artistName}
					imageUrl={rec.imageUrl}
					genres={rec.genres}
					reason={rec.reason}
					spotifyUrl={rec.spotifyUrl}
					index={i}
				/>
			{/each}
		</div>

		{#if filteredRecommendations.length === 0 && searchQuery}
			<Card>
				<CardContent class="pt-6">
					<p class="text-center text-muted-foreground">
						No recommendations match your search "{searchQuery}"
					</p>
				</CardContent>
			</Card>
		{/if}
	{/if}
</div>
