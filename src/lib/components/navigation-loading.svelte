<script lang="ts">
	import { navigating } from '$app/stores';
	import { fade } from 'svelte/transition';
</script>

{#if $navigating}
	<div
		transition:fade={{ duration: 150 }}
		class="fixed top-0 left-0 right-0 z-9999 h-0.5 bg-primary"
		style="
			animation: loading-bar 1s ease-in-out infinite;
		"
	></div>
{/if}

<style>
	@keyframes loading-bar {
		0% {
			width: 0%;
			margin-left: 0%;
		}
		50% {
			width: 40%;
			margin-left: 30%;
		}
		100% {
			width: 0%;
			margin-left: 100%;
		}
	}
</style>
