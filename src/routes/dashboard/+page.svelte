<script lang="ts">
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import { availabilityApi } from '$lib/api/availability';
	import type { GroupAvailability } from '$lib/types';
	import { auth } from '$lib/stores/auth.svelte';

	import DashboardCharts from '$lib/components/DashboardCharts.svelte';
	import MemberList from '$lib/components/MemberList.svelte';
	import ScheduleModal from '$lib/components/ScheduleModal.svelte';
	import Button from '$lib/components/ui/Button.svelte';

	let groupData = $state<GroupAvailability | null>(null);
	let loading = $state(false);
	let error = $state<string | null>(null);
	let showScheduleModal = $state(false);

	async function loadData() {
		// If not authenticated, don't try to load data
		if (!auth.isAuthenticated) return;

		loading = true;
		error = null;
		try {
			groupData = await availabilityApi.getGroupAvailability();
		} catch (e) {
			error = 'Failed to load group availability. Please try refreshing.';
			console.error(e);
		} finally {
			loading = false;
		}
	}

	function handleScheduleSaved() {
		loadData();
	}

	// Reactively load data when auth state changes or on mount
	$effect(() => {
		if (auth.isAuthenticated && !groupData && !loading) {
			loadData();
		}
	});
</script>

<div class="min-h-screen bg-gray-50 pb-12 transition-colors duration-500">
	<header class="sticky top-0 z-30 border-b border-gray-200 bg-white/80 backdrop-blur-md">
		<div class="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
			<div class="flex items-center gap-2">
				<div
					class="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white shadow-sm"
				>
					GP
				</div>
				<h1 class="text-xl font-bold tracking-tight text-gray-900">Coordinator</h1>
			</div>

			<div class="flex items-center gap-4">
				{#if auth.isAuthenticated && auth.user}
					<div class="hidden text-right sm:block" transition:fade>
						<p class="text-xs text-gray-500">Logged in as</p>
						<p class="text-sm leading-tight font-semibold text-gray-900">{auth.user.displayName}</p>
					</div>
					<div class="hidden h-8 w-px bg-gray-200 sm:block"></div>
					<Button variant="secondary" class="text-xs" onclick={() => auth.logout()}>
						Sign Out
					</Button>
				{:else}
					<Button onclick={() => goto('/login')}>Sign In</Button>
				{/if}
			</div>
		</div>
	</header>

	<main class="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
		{#if !auth.isAuthenticated}
			<div class="flex min-h-[50vh] flex-col items-center justify-center text-center" in:fade>
				<h2 class="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
					Welcome to Game Party
				</h2>
				<p class="mt-4 max-w-lg text-lg text-gray-600">
					Sign in to view the group schedule and set your own availability.
				</p>
				<div class="mt-8">
					<Button onclick={() => goto('/login')} class="px-8 py-3 text-base">Get Started</Button>
				</div>
			</div>
		{:else}
			<div in:fade={{ duration: 300 }}>
				<div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<h2
							class="text-2xl leading-7 font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight"
						>
							Group Availability
						</h2>
						<p class="mt-1 text-sm text-gray-500">
							View the next 8 days of availability for the entire group.
						</p>
					</div>
					<div class="flex gap-3">
						<Button onclick={() => loadData()} variant="secondary" disabled={loading}>
							{#if loading}
								Refreshing...
							{:else}
								Refresh
							{/if}
						</Button>
						<Button onclick={() => (showScheduleModal = true)}>Edit My Schedule</Button>
					</div>
				</div>

				{#if loading && !groupData}
					<div
						class="flex h-96 w-full items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50/50"
						in:fade
					>
						<div class="text-center">
							<div
								class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent align-[-0.125em]"
							></div>
							<p class="mt-4 text-sm font-medium text-gray-500">Syncing schedules...</p>
						</div>
					</div>
				{:else if error}
					<div class="rounded-xl border border-red-100 bg-red-50 p-6 text-center" in:fade>
						<h3 class="text-sm font-medium text-red-800">Unable to load data</h3>
						<p class="mt-2 text-sm text-red-700">{error}</p>
						<div class="mt-4">
							<Button variant="danger" class="text-xs" onclick={() => loadData()}>Try Again</Button>
						</div>
					</div>
				{:else if groupData}
					<div class="grid grid-cols-1 gap-8 lg:grid-cols-4" in:fade>
						<div class="space-y-6 lg:col-span-3">
							<DashboardCharts days={groupData.days} members={groupData.members} />
						</div>

						<div class="lg:col-span-1">
							<div class="sticky top-24 space-y-6">
								<MemberList members={groupData.members} />

								<div class="rounded-xl border border-blue-100 bg-blue-50 p-5 shadow-sm">
									<h4 class="flex items-center gap-2 text-sm font-bold text-blue-900">
										<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
											/>
										</svg>
										Quick Tip
									</h4>
									<p class="mt-2 text-xs leading-relaxed text-blue-800">
										The taller the bar, the more people are free. Hover over any bar to see exactly
										who can make it!
									</p>
								</div>
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</main>
</div>

{#if showScheduleModal}
	<div transition:fade={{ duration: 150 }}>
		<ScheduleModal onClose={() => (showScheduleModal = false)} onSave={handleScheduleSaved} />
	</div>
{/if}
