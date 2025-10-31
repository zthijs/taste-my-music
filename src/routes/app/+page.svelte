<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import DashboardSkeleton from '$lib/components/skeletons/dashboard-skeleton.svelte';
	import ArtistCard from '$lib/components/artist-card.svelte';
	import PageHeader from '$lib/components/page-header.svelte';
	import LoadingMessage from '$lib/components/loading-message.svelte';
	import { enhance } from '$app/forms';
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	let { data } = $props();

	let refreshing = $state(false);
	let refreshingRecs = $state(false);
	let isPolling = $state(data.isGenerating);
	let pollCount = $state(0);

	async function checkRecommendationStatus() {
		try {
			const response = await fetch('/app/api/recommendations/status');
			const result = await response.json();

			if (result.hasRecommendations) {
				isPolling = false;
				await invalidateAll();
			} else {
				pollCount++;
				if (isPolling && pollCount < 24) {
					setTimeout(checkRecommendationStatus, 5000);
				}
			}
		} catch (err) {
			console.error('Failed to check status:', err);
			if (isPolling && pollCount < 24) {
				setTimeout(checkRecommendationStatus, 5000);
			}
		}
	}

	onMount(() => {
		if (isPolling) {
			checkRecommendationStatus();
		}
	});
</script>

<svelte:head>
	<title>Dashboard - Taste My Music</title>
	<meta
		name="description"
		content="Your personalized music taste dashboard. Discover your unique music profile and get AI-powered artist recommendations based on your Spotify listening history."
	/>
	<meta
		name="keywords"
		content="music taste, spotify profile, music recommendations, AI music discovery, personalized playlist"
	/>
</svelte:head>

<div class="space-y-4">
	<PageHeader
		title="Welcome, {data.session.user?.name ?? 'there'}!"
		description="Discover your music taste and get personalized recommendations."
		titleClass="text-4xl font-bold tracking-tight bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
		descriptionClass="text-muted-foreground text-lg"
	/>

	{#if data.isInitializing}
		<div in:fade={{ duration: 300 }}>
			<DashboardSkeleton />
		</div>
	{:else if data.profile}
		<div in:fly={{ y: 20, duration: 500, delay: 100, easing: cubicOut }}>
			<Card class="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
				<CardHeader>
					<div class="flex items-center justify-between">
						<div>
							<CardTitle class="text-2xl">Your Music Taste Profile</CardTitle>
							<CardDescription>
								Last updated: {new Date(data.profile.updatedAt).toLocaleDateString()}
							</CardDescription>
						</div>
						{#if data.isDevelopment}
							<form
								method="POST"
								action="?/refreshProfile"
								use:enhance={() => {
									refreshing = true;
									return async ({ update }) => {
										await update();
										refreshing = false;
									};
								}}
							>
								<Button variant="outline" size="sm" type="submit" disabled={refreshing}>
									{refreshing ? 'Refreshing...' : 'Refresh'}
								</Button>
							</form>
						{/if}
					</div>
				</CardHeader>
				<CardContent class="space-y-4">
					<div class="prose prose-sm max-w-none dark:prose-invert">
						<p class="whitespace-pre-wrap text-base leading-relaxed">{data.profile.profileText}</p>
					</div>

					{#if data.profile.topGenres.length > 0}
						<div>
							<h4 class="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
								Your Top Genres
							</h4>
							<div class="flex flex-wrap gap-2">
								{#each data.profile.topGenres.slice(0, 8) as genre, i}
									<div in:scale={{ duration: 300, delay: 200 + i * 50, easing: cubicOut }}>
										<Badge
											variant="secondary"
											class="text-sm hover:bg-primary/20 transition-all cursor-default capitalize"
											>{genre}</Badge
										>
									</div>
								{/each}
							</div>
						</div>
					{/if}

					<div class="pt-4 border-t">
						<a
							href="/app/profile"
							data-sveltekit-preload-data="hover"
							class="text-sm font-medium text-primary inline-flex items-center gap-1 group"
						>
							View Full Profile
							<span>→</span>
						</a>
					</div>
				</CardContent>
			</Card>
		</div>

		<div in:fly={{ y: 20, duration: 500, delay: 200, easing: cubicOut }}>
			<Card class="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
				<CardHeader>
					<div class="flex items-center justify-between">
						<div>
							<CardTitle class="text-2xl">Artist Recommendations</CardTitle>
							<CardDescription>Discover new artists based on your taste</CardDescription>
						</div>
						{#if data.isDevelopment}
							<form
								method="POST"
								action="?/refreshRecommendations"
								use:enhance={() => {
									refreshingRecs = true;
									return async ({ update }) => {
										await update();
										refreshingRecs = false;
									};
								}}
							>
								<Button variant="outline" size="sm" type="submit" disabled={refreshingRecs}>
									{refreshingRecs ? 'Refreshing...' : 'Refresh'}
								</Button>
							</form>
						{/if}
					</div>
				</CardHeader>
				<CardContent>
					{#if isPolling}
						<div in:fade={{ duration: 300 }}>
							<LoadingMessage
								title="Generating Recommendations"
								icon="loader"
								messages={[
									'Analyzing your music taste...',
									'Exploring new artists...',
									'Finding perfect matches...'
								]}
							/>
							<p class="text-sm text-muted-foreground mt-4 text-center">
								This usually takes 30-60 seconds. The page will automatically update.
							</p>
						</div>
					{:else if data.recommendations.length > 0}
						<div class="grid gap-4 md:grid-cols-2">
							{#each data.recommendations as rec, i}
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
						<div class="mt-6 border-t pt-4">
							<a
								href="/app/recommendations"
								data-sveltekit-preload-data="hover"
								class="text-sm font-medium text-primary inline-flex items-center gap-1 group"
							>
								View All Recommendations
								<span>→</span>
							</a>
						</div>
					{:else}
						<div in:fade={{ duration: 300 }}>
							<p class="text-muted-foreground italic">No recommendations available yet.</p>
						</div>
					{/if}
				</CardContent>
			</Card>
		</div>
	{/if}
</div>
