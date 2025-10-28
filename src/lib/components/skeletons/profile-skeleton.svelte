<script lang="ts">
	import { Card, CardContent, CardHeader } from '$lib/components/ui/card';
	import { Skeleton } from '$lib/components/ui/skeleton';
	import LoadingMessage from '$lib/components/loading-message.svelte';
	import { fade, fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

<div class="space-y-4">
	<LoadingMessage
		title="Loading Your Music Profile"
		description="We're gathering your complete music taste analysis including top artists, tracks, and genre preferences."
		icon="loader"
	/>

	<div in:fade={{ duration: 400, delay: 100 }}>
		<Skeleton class="h-10 w-64 mb-3" />
		<Skeleton class="h-6 w-96 max-w-full" />
	</div>

	<div in:fly={{ y: 20, duration: 500, delay: 200, easing: cubicOut }}>
		<Card class="border-2 transition-all">
			<CardHeader>
				<Skeleton class="h-8 w-48 mb-2" />
				<Skeleton class="h-5 w-80 max-w-full" />
			</CardHeader>
			<CardContent>
				<div class="space-y-2">
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-full" />
					<Skeleton class="h-4 w-4/5" />
				</div>
			</CardContent>
		</Card>
	</div>

	<div in:fly={{ y: 20, duration: 500, delay: 300, easing: cubicOut }}>
		<Card class="border-2 transition-all">
			<CardHeader>
				<Skeleton class="h-8 w-32 mb-2" />
				<Skeleton class="h-4 w-48" />
			</CardHeader>
			<CardContent>
				<div class="flex flex-wrap gap-2">
					{#each Array(12) as _, i}
						<Skeleton class="h-7 w-24" />
					{/each}
				</div>
			</CardContent>
		</Card>
	</div>

	<div in:fly={{ y: 20, duration: 500, delay: 400, easing: cubicOut }}>
		<Card class="border-2 transition-all">
			<CardHeader>
				<Skeleton class="h-8 w-32 mb-2" />
				<Skeleton class="h-4 w-56" />
			</CardHeader>
			<CardContent>
				<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each Array(12) as _, i}
						<div class="flex gap-3 items-center p-2 rounded-lg">
							<Skeleton class="h-12 w-12 rounded-full shrink-0" />
							<div class="flex-1 space-y-2">
								<Skeleton class="h-4 w-32" />
								<Skeleton class="h-3 w-24" />
							</div>
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	</div>

	<div in:fly={{ y: 20, duration: 500, delay: 500, easing: cubicOut }}>
		<Card class="border-2 transition-all">
			<CardHeader>
				<Skeleton class="h-8 w-32 mb-2" />
				<Skeleton class="h-4 w-48" />
			</CardHeader>
			<CardContent>
				<div class="space-y-2">
					{#each Array(10) as _, i}
						<div class="flex gap-3 items-center p-2 rounded-lg">
							<Skeleton class="h-12 w-12 rounded shrink-0" />
							<div class="flex-1 space-y-2">
								<Skeleton class="h-4 w-48" />
								<Skeleton class="h-3 w-32" />
							</div>
							<Skeleton class="h-6 w-6" />
						</div>
					{/each}
				</div>
			</CardContent>
		</Card>
	</div>
</div>
