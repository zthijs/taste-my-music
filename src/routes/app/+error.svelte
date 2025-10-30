<script lang="ts">
	import { Card, CardContent, CardHeader, CardTitle } from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';

	let { error } = $props();
</script>

<div class="flex items-center justify-center min-h-[400px]">
	<Card class="max-w-md w-full">
		<CardHeader>
			<CardTitle class="text-destructive">Something went wrong</CardTitle>
		</CardHeader>
		<CardContent class="space-y-4">
			<p class="text-muted-foreground">
				{error?.message || 'An unexpected error occurred'}
			</p>
			<div class="flex gap-2">
				<Button onclick={() => window.location.reload()}>Retry</Button>
				<Button variant="outline" onclick={() => (window.location.href = '/app')}>
					Go to Dashboard
				</Button>
			</div>
		</CardContent>
	</Card>
</div>
