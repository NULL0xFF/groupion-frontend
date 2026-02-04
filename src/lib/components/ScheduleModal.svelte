<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { schedule } from '$lib/stores/schedule.svelte';
	import ScheduleGrid from './ScheduleGrid.svelte';
	import Button from './ui/Button.svelte';

	let { onClose, onSave } = $props<{
		onClose: () => void;
		onSave?: () => void;
	}>();

	let isSaving = $state(false);
	let error = $state<string | null>(null);

	// Load data on mount
	$effect(() => {
		schedule.init();
	});

	async function handleSave() {
		isSaving = true;
		error = null;
		try {
			await schedule.save();
			onSave?.();
			onClose();
		} catch (e) {
			error = 'Failed to save changes. Please try again.';
		} finally {
			isSaving = false;
		}
	}
</script>

<div
	class="fixed inset-0 z-40 bg-gray-900/60 backdrop-blur-sm"
	aria-hidden="true"
	onclick={onClose}
></div>

<div
	class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4"
>
	<div
		class="pointer-events-auto w-full max-w-5xl transform overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-gray-900/5"
		role="dialog"
		aria-modal="true"
		in:fly={{ y: 20, duration: 300 }}
		out:fade={{ duration: 150 }}
	>
		<div class="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
			<div>
				<h3 class="text-lg leading-6 font-bold text-gray-900">Edit Availability</h3>
				<p class="mt-1 text-sm text-gray-500">Click and drag to set your free time.</p>
			</div>
			<button
				onclick={onClose}
				class="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-500"
			>
				<span class="sr-only">Close</span>
				<svg
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke-width="1.5"
					stroke="currentColor"
				>
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>

		<div class="max-h-[70vh] overflow-x-auto bg-gray-50/50 px-6 py-6">
			{#if error}
				<div
					class="mb-4 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50 p-4 text-sm text-red-700"
				>
					<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
					{error}
				</div>
			{/if}

			<ScheduleGrid />
		</div>

		<div class="flex items-center justify-end gap-3 border-t border-gray-100 bg-white px-6 py-4">
			<Button
				variant="ghost"
				onclick={() => schedule.reset()}
				disabled={isSaving}
				class="text-red-600 hover:bg-red-50 hover:text-red-700"
			>
				Clear All
			</Button>
			<div class="flex-1"></div>
			<Button variant="secondary" onclick={onClose} disabled={isSaving}>Cancel</Button>
			<Button onclick={handleSave} disabled={isSaving} class="min-w-[120px]">
				{#if isSaving}
					<svg
						class="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
					>
						<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
						></circle>
						<path
							class="opacity-75"
							fill="currentColor"
							d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
						></path>
					</svg>
					Saving...
				{:else}
					Save Changes
				{/if}
			</Button>
		</div>
	</div>
</div>
