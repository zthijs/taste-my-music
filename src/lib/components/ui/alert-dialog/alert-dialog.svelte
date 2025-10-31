<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type AlertDialogProps = HTMLAttributes<HTMLDivElement> & {
		open?: boolean;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let {
		class: className,
		open = $bindable(false),
		children,
		...restProps
	}: AlertDialogProps = $props();
</script>

{#if open}
	<div class="fixed inset-0 z-50 flex items-center justify-center">
		<!-- Overlay -->
		<div class="fixed inset-0 bg-black/80" onclick={() => (open = false)} role="presentation"></div>

		<!-- Dialog -->
		<div
			class={cn(
				'relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg',
				className
			)}
			role="alertdialog"
			{...restProps}
		>
			{@render children?.()}
		</div>
	</div>
{/if}
