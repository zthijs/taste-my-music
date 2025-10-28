<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ExternalLink from '@tabler/icons-svelte/icons/external-link';
</script>

<header
	class="h-(--header-height) rounded-t-2xl group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) flex shrink-0 items-center gap-2 border-b transition-all duration-300 backdrop-blur-sm bg-background/95"
>
	<div class="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
		<Sidebar.Trigger class="-ml-1 hover:bg-primary/10 transition-colors" />
		<Separator orientation="vertical" class="mx-2 data-[orientation=vertical]:h-4" />
		<h1
			class="text-base font-semibold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-1"
		>
			Taste My Music
		</h1>
		<div class="ml-auto flex items-center gap-2">
			<Button
				href="https://www.spotify.com/nl/account/apps"
				variant="ghost"
				size="sm"
				class="dark:text-foreground hidden sm:flex hover:bg-primary/10 "
				target="_blank"
				rel="noopener noreferrer"
			>
				Revoke Access
				<ExternalLink class="size-4 ml-1" />
			</Button>
		</div>
	</div>
</header>
