<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import IconBrandSpotify from '@tabler/icons-svelte/icons/brand-spotify';
	import IconSparkles from '@tabler/icons-svelte/icons/sparkles';
</script>

<svelte:head>
	<title>Sign In - Taste My Music</title>
	<meta
		name="description"
		content="Sign in with Spotify to discover your unique music taste profile. Get personalized artist recommendations and insights into your listening habits."
	/>
	<meta
		name="keywords"
		content="spotify login, music taste analysis, spotify profile, sign in, music discovery"
	/>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-4">
	<div in:fade={{ duration: 500, easing: cubicOut }} class="w-full max-w-md">
		<div in:scale={{ duration: 600, delay: 100, easing: cubicOut }}>
			<Card class="border-2 shadow-2xl">
				<CardHeader class="text-center space-y-2">
					<div class="flex justify-center mb-4">
						<div
							class="h-16 w-16 bg-linear-to-br from-primary/20 to-primary/5 rounded-full flex items-center justify-center"
						>
							<IconSparkles class="h-8 w-8 text-primary" />
						</div>
					</div>
					<CardTitle
						class="text-3xl font-bold bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
					>
						Taste My Music
					</CardTitle>
					<CardDescription class="text-base">
						Discover your unique music taste profile
					</CardDescription>
				</CardHeader>
				<CardContent class="space-y-6">
					<div class="space-y-3 text-sm text-muted-foreground">
						<div class="flex items-start gap-3">
							<span class="text-primary font-bold">✓</span>
							<p>Analyze your Spotify listening history</p>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-primary font-bold">✓</span>
							<p>Get AI-powered artist recommendations</p>
						</div>
						<div class="flex items-start gap-3">
							<span class="text-primary font-bold">✓</span>
							<p>Share your music taste in one sentence</p>
						</div>
					</div>

					<form method="POST" use:enhance class="space-y-4">
						<Button
							type="submit"
							size="lg"
							class="w-full text-base font-semibold h-12 bg-[#1DB954] hover:bg-[#1ed760] text-white"
						>
							<IconBrandSpotify class="h-6 w-6 mr-2" />
							Sign in with Spotify
						</Button>
					</form>

					<p class="text-xs text-center text-muted-foreground">
						By signing in, you agree to connect your Spotify account. We only access your listening
						history to create your profile.
					</p>
				</CardContent>
			</Card>
		</div>
	</div>
</div>
