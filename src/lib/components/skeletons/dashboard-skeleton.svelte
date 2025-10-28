<script lang="ts">
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import LoadingMessage from '$lib/components/loading-message.svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

<div class="space-y-4">
	<LoadingMessage
		title="Generating Your Taste Profile"
		description="We're analyzing your Spotify listening history to create your personalized music profile and recommendations. This can take 30-60 seconds."
	/>

	<div in:fly={{ y: 20, duration: 500, delay: 200, easing: cubicOut }}>
		<Card class="border-2 transition-all">
			<CardHeader>
				<div class="flex items-center justify-between mb-4">
					<div class="flex-1">
						<Skeleton class="h-8 w-56 mb-2" />
						<Skeleton class="h-4 w-48" />
					</div>
				</div>
			</CardHeader>
			<CardContent class="space-y-4">
				<div class="space-y-2">
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-4/5" />
				</div>

				<div class="pt-4">
					<Skeleton class="h-4 w-32 mb-3" />
					<div class="flex flex-wrap gap-2">
						{#each Array(8) as _, i}
							<Skeleton class="h-7 w-20" />
						{/each}
					</div>
				</div>

				<div class="pt-4 border-t">
					<Skeleton class="h-4 w-32" />
				</div>
			</CardContent>
		</Card>
	</div>

	<div in:fly={{ y: 20, duration: 500, delay: 300, easing: cubicOut }}>
		<Card class="border-2 transition-all">
			<CardHeader>
				<div class="flex items-center justify-between mb-4">
					<div class="flex-1">
						<Skeleton class="h-8 w-56 mb-2" />
						<Skeleton class="h-4 w-64" />
					</div>
				</div>
			</CardHeader>
			<CardContent>
				<div class="grid gap-4 md:grid-cols-2">
					{#each Array(6) as _, i}
						<div class="flex gap-3 p-4 border rounded-lg">
							<Skeleton class="h-20 w-20 rounded-lg shrink-0" />
							<div class="flex-1 space-y-2">
								<Skeleton class="h-5 w-32" />
								<div class="flex gap-1">
									<Skeleton class="h-5 w-16" />
									<Skeleton class="h-5 w-16" />
								</div>
								<Skeleton class="h-4 w-full" />
							</div>
						</div>
					{/each}
				</div>
				<div class="mt-6 border-t pt-4">
					<Skeleton class="h-4 w-48" />
				</div>
			</CardContent>
		</Card>
	</div>
</div>
