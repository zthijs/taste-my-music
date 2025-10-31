<script lang="ts" module>
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export type AlertDialogTitleProps = HTMLAttributes<HTMLHeadingElement> & {
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';

	let { class: className, children, ...restProps }: AlertDialogTitleProps = $props();
</script>

<h2 class={cn('text-lg font-semibold', className)} {...restProps}>
	{@render children?.()}
</h2>
