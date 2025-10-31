<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Avatar, AvatarFallback, AvatarImage } from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import {
		AlertDialog,
		AlertDialogHeader,
		AlertDialogFooter,
		AlertDialogTitle,
		AlertDialogDescription
	} from '$lib/components/ui/alert-dialog';
	import PageHeader from '$lib/components/page-header.svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import TrashIcon from '@tabler/icons-svelte/icons/trash';
	import { enhance } from '$app/forms';

	let { data } = $props();

	let showDeleteDialog = $state(false);
	let isDeleting = $state(false);

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

		<!-- Danger Zone -->
		<div in:fly={{ y: 20, duration: 500, delay: 200, easing: cubicOut }}>
			<Card class="border-destructive/50">
				<CardHeader>
					<CardTitle class="text-destructive">Danger Zone</CardTitle>
					<CardDescription>Permanently delete your account and all associated data</CardDescription>
				</CardHeader>
				<CardContent>
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div class="space-y-1">
							<p class="text-sm font-medium">Delete Account</p>
							<p class="text-sm text-muted-foreground">
								This action cannot be undone. All your data including music profiles,
								recommendations, and listening history will be permanently deleted.
							</p>
						</div>
						<Button
							variant="destructive"
							onclick={() => (showDeleteDialog = true)}
							disabled={isDeleting}
							class="shrink-0"
						>
							<TrashIcon class="size-4" />
							Delete Account
						</Button>
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

<!-- Delete Confirmation Dialog -->
<AlertDialog bind:open={showDeleteDialog}>
	<AlertDialogHeader>
		<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
		<AlertDialogDescription>
			This action cannot be undone. This will permanently delete your account and remove all your
			data from our servers, including:
		</AlertDialogDescription>
	</AlertDialogHeader>

	<ul class="list-disc list-inside text-sm text-muted-foreground space-y-1 my-4">
		<li>Music profile and taste analysis</li>
		<li>Listening history and preferences</li>
		<li>Artist recommendations</li>
		<li>All connected accounts</li>
	</ul>

	<AlertDialogFooter>
		<Button variant="outline" onclick={() => (showDeleteDialog = false)} disabled={isDeleting}>
			Cancel
		</Button>
		<form
			method="POST"
			action="?/deleteAccount"
			use:enhance={() => {
				isDeleting = true;
				return async ({ update }) => {
					await update();
					isDeleting = false;
				};
			}}
		>
			<Button type="submit" variant="destructive" disabled={isDeleting}>
				{isDeleting ? 'Deleting...' : 'Delete Account'}
			</Button>
		</form>
	</AlertDialogFooter>
</AlertDialog>
