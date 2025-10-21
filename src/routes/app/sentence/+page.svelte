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
	import PageHeader from '$lib/components/page-header.svelte';
	import { enhance } from '$app/forms';
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import { IconCopy, IconCheck, IconSparkles, IconRefresh } from '@tabler/icons-svelte';

	let { data } = $props();

	let copied = $state(false);
	let regenerating = $state(false);

	async function copyToClipboard() {
		if (!data.styleSentence) return;

		try {
			await navigator.clipboard.writeText(data.styleSentence);
			copied = true;
			setTimeout(() => {
				copied = false;
			}, 2000);
		} catch (err) {}
	}
</script>

<svelte:head>
	<title>Style Sentence - Taste My Music</title>
	<meta
		name="description"
		content="Your music taste in one perfect sentence. Get an AI-generated description of your music style that you can share with friends or use in your bio."
	/>
	<meta
		name="keywords"
		content="music style, music taste sentence, music bio, spotify bio, music description"
	/>
</svelte:head>

<div class="space-y-4">
	<PageHeader
		title="Style Sentence"
		description="Your music taste in one perfect sentence"
		titleClass="text-4xl font-bold tracking-tight bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
		descriptionClass="text-muted-foreground text-lg"
	/>

	{#if data.error}
		<div in:fade={{ duration: 300 }}>
			<Card class="border-destructive">
				<CardContent class="pt-6">
					<p class="text-destructive mb-4">{data.error}</p>
					{#if data.profile}
						<form method="POST" action="?/regenerate">
							<Button type="submit">Generate Style Sentence</Button>
						</form>
					{:else}
						<a href="/app" data-sveltekit-preload-data="hover">
							<Button>Go to Dashboard</Button>
						</a>
					{/if}
				</CardContent>
			</Card>
		</div>
	{:else if !data.styleSentence && data.profile}
		<div in:fade={{ duration: 300 }}>
			<Card>
				<CardHeader>
					<CardTitle class="text-2xl flex items-center gap-2">
						<IconSparkles class="h-6 w-6 text-primary" />
						Generate Your Style Sentence
					</CardTitle>
					<CardDescription>
						Create a perfect one-sentence description of your music taste
					</CardDescription>
				</CardHeader>
				<CardContent>
					<p class="text-muted-foreground mb-4">
						Click the button below to generate a concise sentence that captures your music taste.
						Perfect for sharing with friends or using in your bio!
					</p>
					<form
						method="POST"
						action="?/regenerate"
						use:enhance={() => {
							regenerating = true;
							return async ({ update }) => {
								await update();
								regenerating = false;
							};
						}}
					>
						<Button type="submit" disabled={regenerating} size="lg">
							<IconSparkles class="h-5 w-5 mr-2 {regenerating ? 'animate-spin' : ''}" />
							{regenerating ? 'Generating...' : 'Generate My Style Sentence'}
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	{:else if data.styleSentence}
		<div in:fly={{ y: 20, duration: 500, delay: 100, easing: cubicOut }}>
			<Card class="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
				<CardHeader>
					<div class="flex items-start justify-between gap-4">
						<div class="flex-1">
							<CardTitle class="text-2xl flex items-center gap-2">
								<IconSparkles class="h-6 w-6 text-primary" />
								Your Style Sentence
							</CardTitle>
							<CardDescription class="text-base mt-2">
								When someone asks: "What kind of music do you listen to?"
							</CardDescription>
						</div>
						<form
							method="POST"
							action="?/regenerate"
							use:enhance={() => {
								regenerating = true;
								return async ({ update }) => {
									await update();
									regenerating = false;
								};
							}}
						>
							<Button
								variant="outline"
								size="sm"
								type="submit"
								disabled={regenerating}
								class="shrink-0"
							>
								<IconRefresh class="h-4 w-4 mr-2 {regenerating ? 'animate-spin' : ''}" />
								{regenerating ? 'Regenerating...' : 'Regenerate'}
							</Button>
						</form>
					</div>
				</CardHeader>
				<CardContent class="space-y-6">
					<div
						class="relative p-6 bg-linear-to-br from-primary/5 to-primary/10 rounded-lg border-2 border-primary/20"
					>
						<blockquote class="text-xl md:text-2xl font-medium leading-relaxed text-foreground">
							"{data.styleSentence}"
						</blockquote>
					</div>

					<div class="flex flex-wrap gap-3">
						<Button
							variant="default"
							size="lg"
							onclick={copyToClipboard}
							disabled={copied}
							class="transition-all"
						>
							{#if copied}
								<IconCheck class="h-5 w-5 mr-2" />
								Copied!
							{:else}
								<IconCopy class="h-5 w-5 mr-2" />
								Copy to Clipboard
							{/if}
						</Button>

						<a href="/app/profile" data-sveltekit-preload-data="hover">
							<Button variant="outline" size="lg">View Full Profile</Button>
						</a>
					</div>

					{#if data.profile?.topGenres && data.profile.topGenres.length > 0}
						<div class="pt-4 border-t">
							<h4 class="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wide">
								Based on Your Top Genres
							</h4>
							<div class="flex flex-wrap gap-2">
								{#each data.profile.topGenres.slice(0, 8) as genre, i}
									<div in:scale={{ duration: 300, delay: 200 + i * 40, easing: cubicOut }}>
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
						<p class="text-sm text-muted-foreground leading-relaxed">
							💡 <strong>Tip:</strong> Use this sentence when introducing yourself, on dating apps, or
							whenever someone asks about your music taste. It's based on your actual listening history
							and updated with your profile!
						</p>
					</div>
				</CardContent>
			</Card>
		</div>
	{/if}
</div>
