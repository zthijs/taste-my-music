<script lang="ts">
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { IconExternalLink } from '@tabler/icons-svelte';
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';

	interface Props {
		artistName: string;
		imageUrl?: string | null;
		genres: string[];
		reason: string;
		spotifyUrl?: string | null;
		index?: number;
	}

	let { artistName, imageUrl, genres, reason, spotifyUrl, index = 0 }: Props = $props();
</script>

<div
	in:fly={{ x: -20, duration: 400, delay: 150 + index * 50, easing: cubicOut }}
	class="flex gap-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-all group overflow-hidden"
>
	{#if imageUrl}
		<img
			src={imageUrl}
			alt={artistName}
			class="w-32 h-full object-cover ring-2 ring-transparent group-hover:ring-primary/50 transition-all shrink-0"
		/>
	{:else}
		<div
			class="w-32 h-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0"
		>
			<span class="text-2xl">🎵</span>
		</div>
	{/if}
	<div class="flex-1 min-w-0 space-y-1 p-3">
		<div class="flex items-start justify-between gap-2">
			<h3 class="font-bold text-base group-hover:text-primary transition-colors truncate">
				{artistName}
			</h3>
			{#if spotifyUrl}
				<a href={spotifyUrl} target="_blank" rel="noopener noreferrer" class="shrink-0">
					<Button
						variant="ghost"
						size="icon"
						class="h-8 w-8 hover:bg-primary/10 hover:text-primary"
					>
						<IconExternalLink class="h-4 w-4" />
					</Button>
				</a>
			{/if}
		</div>
		{#if genres.length > 0}
			<div class="flex flex-wrap gap-1">
				{#each genres.slice(0, 3) as genre}
					<Badge
						variant="secondary"
						class="text-xs hover:bg-primary/20 transition-colors cursor-default">{genre}</Badge
					>
				{/each}
			</div>
		{/if}
		<p class="text-sm text-muted-foreground leading-relaxed line-clamp-2">{reason}</p>
	</div>
</div>
