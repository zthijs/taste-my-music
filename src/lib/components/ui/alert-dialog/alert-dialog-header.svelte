<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type AlertDialogHeaderProps = HTMLAttributes<HTMLDivElement> & {
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: AlertDialogHeaderProps = $props();
</script>

<div class={cn('flex flex-col space-y-2 text-center sm:text-left', className)} {...restProps}>
	{@render children?.()}
</div>
