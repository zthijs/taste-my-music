<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	onMount(() => {
		goto('/app');
	});
</script>

<svelte:head>
	<title>Taste My Music - Discover Your Music Taste Profile</title>
	<meta
		name="description"
		content="Analyze your Spotify listening history with AI. Get personalized music recommendations, discover your top artists and genres, and share your music taste in one perfect sentence."
	/>
	<meta
		name="keywords"
		content="spotify analysis, music taste, AI music recommendations, spotify stats, music profile, listening history"
	/>
</svelte:head>
