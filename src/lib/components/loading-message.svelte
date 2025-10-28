<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { fade, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
	import IconSparkles from '@tabler/icons-svelte/icons/sparkles';
	import IconLoader2 from '@tabler/icons-svelte/icons/loader-2';

	interface Props {
		title?: string;
		description?: string;
		icon?: 'sparkles' | 'loader';
	}

	let {
		title = 'Generating Your Taste Profile',
		description = 'This can take some time as we analyze your listening history and create personalized recommendations.',
		icon = 'sparkles'
	}: Props = $props();
</script>

<div in:fade={{ duration: 400, easing: cubicOut }}>
	<Card
		class="border-primary/30 bg-linear-to-br from-primary/5 via-primary/10 to-primary/5 shadow-lg"
	>
		<CardContent class="pt-6">
			<div class="flex items-start gap-4">
				<div in:scale={{ duration: 500, delay: 200, easing: cubicOut }} class="shrink-0 mt-1">
					{#if icon === 'sparkles'}
						<IconSparkles class="h-6 w-6 text-primary animate-pulse" />
					{:else}
						<IconLoader2 class="h-6 w-6 text-primary animate-spin" />
					{/if}
				</div>
				<div class="flex-1 space-y-1">
					<h3 class="font-semibold text-lg text-foreground">
						{title}
					</h3>
					<p class="text-sm text-muted-foreground leading-relaxed">
						{description}
					</p>
				</div>
			</div>
		</CardContent>
	</Card>
</div>
