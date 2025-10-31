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
	import LoadingMessage from '$lib/components/loading-message.svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	let searchQuery = $state('');
	let isPolling = $state(data.isGenerating);
	let pollCount = $state(0);

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

	async function checkStatus() {
		try {
			const response = await fetch('/app/api/recommendations/status');
			const result = await response.json();

			if (result.hasRecommendations) {
				isPolling = false;
				await invalidateAll();
			} else {
				pollCount++;
				if (isPolling && pollCount < 24) {
					setTimeout(checkStatus, 5000);
				}
			}
		} catch (err) {
			console.error('Failed to check status:', err);
			if (isPolling && pollCount < 24) {
				setTimeout(checkStatus, 5000);
			}
		}
	}

	onMount(() => {
		if (isPolling) {
			checkStatus();
		}
	});
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

	{#if isPolling}
		<div in:fade={{ duration: 300 }}>
			<Card>
				<CardHeader>
					<CardTitle>Generating Your Recommendations</CardTitle>
					<CardDescription>
						Your personalized artist recommendations are being created...
					</CardDescription>
				</CardHeader>
				<CardContent class="space-y-4">
					<LoadingMessage
						messages={[
							'Analyzing your music taste...',
							'Exploring new artists...',
							'Finding perfect matches...',
							'Almost there...'
						]}
					/>
					<p class="text-sm text-muted-foreground">
						This usually takes 30-60 seconds. The page will automatically update when ready.
					</p>
				</CardContent>
			</Card>
		</div>
	{:else if data.recommendations.length === 0}
		<Card>
			<CardHeader>
				<CardTitle>No Recommendations Yet</CardTitle>
				<CardDescription>We couldn't generate recommendations at this time.</CardDescription>
			</CardHeader>
			<CardContent>
				<p class="text-sm text-muted-foreground mb-4">
					This might happen if your profile hasn't been analyzed yet. Please visit your profile page
					first.
				</p>
				<a href="/app/profile" data-sveltekit-preload-data="hover">
					<Button variant="outline">Go to Profile</Button>
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
