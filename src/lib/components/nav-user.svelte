<script lang="ts">
	import DotsVerticalIcon from '@tabler/icons-svelte/icons/dots-vertical';
	import LogoutIcon from '@tabler/icons-svelte/icons/logout';
	import UserCircleIcon from '@tabler/icons-svelte/icons/user-circle';
	import MoonIcon from '@tabler/icons-svelte/icons/moon';
	import SunIcon from '@tabler/icons-svelte/icons/sun';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import type { Session } from '@auth/sveltekit';
	import { browser } from '$app/environment';

	let { session }: { session: Session } = $props();

	const sidebar = Sidebar.useSidebar();

	const user = $derived({
		name: session.user?.name ?? 'User',
		email: session.user?.email ?? '',
		avatar: session.user?.image ?? ''
	});

	const initials = $derived(
		user.name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2)
	);

	let isDark = $state(browser && localStorage.getItem('theme') === 'dark');

	$effect(() => {
		if (browser) {
			if (isDark) {
				document.documentElement.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			} else {
				document.documentElement.classList.remove('dark');
				localStorage.setItem('theme', 'light');
			}
		}
	});

	function toggleTheme() {
		isDark = !isDark;
	}
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image class="object-cover" src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">{initials}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="text-muted-foreground truncate text-xs">
								{user.email}
							</span>
						</div>
						<DotsVerticalIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={user.avatar} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">{initials}</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="text-muted-foreground truncate text-xs">
								{user.email}
							</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					<DropdownMenu.Item>
						<a href="/app/user" class="flex items-center gap-2 w-full">
							<UserCircleIcon />
							Account
						</a>
					</DropdownMenu.Item>
					<DropdownMenu.Item onclick={toggleTheme}>
						<button type="button" class="flex items-center gap-2 w-full">
							{#if isDark}
								<SunIcon />
								Light Mode
							{:else}
								<MoonIcon />
								Dark Mode
							{/if}
						</button>
					</DropdownMenu.Item>
				</DropdownMenu.Group>
				<DropdownMenu.Separator />
				<DropdownMenu.Item>
					<form action="/auth/signout" method="POST" class="w-full">
						<button type="submit" class="flex items-center gap-2 w-full">
							<LogoutIcon />
							Log out
						</button>
					</form>
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
