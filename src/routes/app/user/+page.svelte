<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import PageHeader from '$lib/components/page-header.svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	let { data } = $props();

	function formatDate(date: string | Date | undefined): string {
		if (!date) return 'N/A';
		return new Date(date).toLocaleString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	function getInitials(name: string | null | undefined): string {
		if (!name) return '??';
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<svelte:head>
	<title>Account Settings - Taste My Music</title>
	<meta
		name="description"
		content="View and manage your Taste My Music account settings, session details, and profile information."
	/>
	<meta name="keywords" content="account settings, user profile, session information" />
</svelte:head>

<div class="space-y-4">
	<PageHeader
		title="User Profile"
		description="Your account information and session details"
		titleClass="text-4xl font-bold tracking-tight bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
		descriptionClass="text-muted-foreground text-lg"
	/>

	{#if data.session?.user}
		<div in:fly={{ y: 20, duration: 500, delay: 100, easing: cubicOut }}>
			<Card class="hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/30">
				<CardHeader>
					<div class="flex items-center gap-4">
						<Avatar class="h-20 w-20">
							<AvatarImage
								class="object-cover"
								src={data.session.user.image ?? ''}
								alt={data.session.user.name ?? ''}
							/>
							<AvatarFallback class="text-2xl">
								{getInitials(data.session.user.name)}
							</AvatarFallback>
						</Avatar>
						<div>
							<CardTitle class="text-2xl">{data.session.user.name ?? 'Unknown User'}</CardTitle>
							<CardDescription class="text-base">{data.session.user.email ?? ''}</CardDescription>
						</div>
					</div>
				</CardHeader>
				<CardContent class="space-y-6">
					<div class="grid gap-4 md:grid-cols-2">
						<div class="space-y-2">
							<h4 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
								User ID
							</h4>
							<p class="text-sm font-mono bg-muted p-2 rounded">
								{data.session.user.id ?? 'N/A'}
							</p>
						</div>

						{#if data.session.expires}
							<div class="space-y-2">
								<h4 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
									Session Expires
								</h4>
								<p class="text-sm font-mono bg-muted p-2 rounded">
									{formatDate(data.session.expires)}
								</p>
							</div>
						{/if}
					</div>

					{#if data.session.user.image}
						<div class="space-y-2">
							<h4 class="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
								Profile Image URL
							</h4>
							<p class="text-sm font-mono bg-muted p-2 rounded break-all">
								{data.session.user.image}
							</p>
						</div>
					{/if}

					<div class="pt-4 border-t">
						<a
							href="/auth/signout"
							class="text-sm font-medium text-destructive inline-flex items-center gap-1 hover:underline"
						>
							Sign Out
							<span>→</span>
						</a>
					</div>
				</CardContent>
			</Card>
		</div>
	{:else}
		<div in:fade={{ duration: 300 }}>
			<Card class="border-destructive">
				<CardContent class="pt-6">
					<p class="text-destructive">No session data available</p>
				</CardContent>
			</Card>
		</div>
	{/if}
</div>
