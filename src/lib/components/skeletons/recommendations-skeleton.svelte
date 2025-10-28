<script lang="ts">
	import { Card, CardContent } from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import LoadingMessage from '$lib/components/loading-message.svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

<div class="space-y-4">
	<LoadingMessage
		title="Generating Personalized Recommendations"
		description="Our AI is analyzing your music taste to discover artists you'll love. This process can take up to a minute as we search through thousands of artists."
		icon="sparkles"
	/>

	<div in:fade={{ duration: 400, delay: 100 }}>
		<Skeleton class="h-10 w-64 mb-3" />
		<Skeleton class="h-6 w-96 max-w-full" />
	</div>

	<div
		in:fly={{ y: 20, duration: 500, delay: 200, easing: cubicOut }}
		class="flex items-center gap-4"
	>
		<Skeleton class="h-10 w-full max-w-md" />
		<Skeleton class="h-5 w-24" />
	</div>

	<div class="grid gap-4 md:grid-cols-2">
		{#each Array(8) as _, i}
			<div in:scale={{ duration: 400, delay: 250 + i * 75, easing: cubicOut }}>
				<Card class="overflow-hidden border-2 transition-all">
					<CardContent class="p-0">
						<div class="flex gap-4 p-4">
							<Skeleton class="h-20 w-20 rounded-lg shrink-0" />

							<div class="flex-1 space-y-2">
								<Skeleton class="h-5 w-40" />

								<div class="flex gap-1 flex-wrap">
									<Skeleton class="h-5 w-16" />
									<Skeleton class="h-5 w-20" />
									<Skeleton class="h-5 w-14" />
								</div>

								<div class="space-y-1 pt-1">
									<Skeleton class="h-3 w-full" />
									<Skeleton class="h-3 w-4/5" />
								</div>
							</div>
						</div>

						<div class="px-4 pb-4">
							<Skeleton class="h-9 w-full" />
						</div>
					</CardContent>
				</Card>
			</div>
		{/each}
	</div>
</div>
