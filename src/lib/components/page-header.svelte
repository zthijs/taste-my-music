<script lang="ts">
	interface Props {
		title: string;
		description: string;
		titleClass?: string;
		descriptionClass?: string;
	}

	let {
		title,
		description,
		titleClass = 'text-3xl font-bold tracking-tight bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent',
		descriptionClass = 'text-muted-foreground'
	}: Props = $props();
</script>

<div class="px-1">
	<h1 class={titleClass}>
		{title}
	</h1>
	<p class={descriptionClass}>{description}</p>
</div>
