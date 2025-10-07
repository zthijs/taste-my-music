<script lang="ts">
	import '$lib/assets/app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import NavigationLoading from '$lib/components/navigation-loading.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<ModeWatcher defaultMode="dark" />
<NavigationLoading />

<div style="view-transition-name: main-content;">
	{@render children?.()}
</div>
