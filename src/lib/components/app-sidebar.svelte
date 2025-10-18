<script lang="ts">
	import MusicIcon from '@tabler/icons-svelte/icons/music';
	import HomeIcon from '@tabler/icons-svelte/icons/home';
	import SparklesIcon from '@tabler/icons-svelte/icons/sparkles';
	import ChartBarIcon from '@tabler/icons-svelte/icons/chart-bar';
	import BubbleIcon from '@tabler/icons-svelte/icons/bubble';
	import NavMain from './nav-main.svelte';
	import NavUser from './nav-user.svelte';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { ComponentProps } from 'svelte';
	import type { Session } from '@auth/sveltekit';

	let { session, ...restProps }: { session: Session } & ComponentProps<typeof Sidebar.Root> =
		$props();

	const navMain = [
		{
			title: 'Dashboard',
			url: '/app',
			icon: HomeIcon
		},
		{
			title: 'Profile',
			url: '/app/profile',
			icon: ChartBarIcon
		},
		{
			title: 'Recommendations',
			url: '/app/recommendations',
			icon: SparklesIcon
		},
		{
			title: 'Style Sentence',
			url: '/app/sentence',
			icon: BubbleIcon
		}
	];
</script>

<Sidebar.Root collapsible="offcanvas" {...restProps}>
	<Sidebar.Header>
		<Sidebar.Menu>
			<Sidebar.MenuItem>
				<Sidebar.MenuButton class="data-[slot=sidebar-menu-button]:p-1.5!">
					{#snippet child({ props })}
						<a href="/app" data-sveltekit-preload-data="hover" {...props}>
							<MusicIcon class="size-5!" />
							<span class="text-base font-semibold">Taste My Music</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
			</Sidebar.MenuItem>
		</Sidebar.Menu>
	</Sidebar.Header>
	<Sidebar.Content>
		<NavMain items={navMain} />
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {session} />
	</Sidebar.Footer>
</Sidebar.Root>
