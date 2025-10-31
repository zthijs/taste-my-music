<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type AlertDialogDescriptionProps = HTMLAttributes<HTMLParagraphElement> & {
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: AlertDialogDescriptionProps = $props();
</script>

<p class={cn('text-sm text-muted-foreground', className)} {...restProps}>
	{@render children?.()}
</p>
