<script lang="ts">
	import type { DayAvailability, MemberInfo } from '$lib/types';

	let { day, members } = $props<{
		day: DayAvailability;
		members: MemberInfo[];
	}>();

	// Helper to lookup colors efficiently
	// const memberColors = new Map(members.map((m) => [m.id, m.colorHex]));
	const memberColors = $derived(new Map(members.map((m: MemberInfo) => [m.id, m.colorHex])));

	function getColor(userId: string) {
		return memberColors.get(userId) || '#d1d5db'; // gray-300 fallback
	}

	// Calculate maximum possible height (total members) to scale bars relatively
	// If 0 members, default to 1 to avoid division by zero
	// const maxCount = members.length || 1;
	const maxCount = $derived(members.length || 1);
</script>

<div
	class="group relative overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
>
	<div class="flex flex-col sm:flex-row">
		<div
			class="flex w-full shrink-0 flex-row items-center justify-between gap-2 border-b border-gray-100 bg-gray-50 px-4 py-2 sm:w-32 sm:flex-col sm:justify-center sm:border-r sm:border-b-0"
		>
			<div class="text-center">
				<h4 class="text-sm font-bold text-gray-900">{day.dayName}</h4>
				<span class="text-xs font-medium text-gray-500">{day.dateLabel}</span>
			</div>
			{#if day.isNextWeek}
				<span class="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-bold text-blue-700">
					Next Week
				</span>
			{/if}
		</div>

		<div class="relative min-h-[100px] flex-1 p-2 sm:h-28 sm:p-4">
			<div
				class="pointer-events-none absolute inset-0 top-4 right-0 left-0 mx-2 flex justify-between px-[2px] sm:mx-4"
			>
				<div class="h-full w-px bg-transparent"></div>
				<div class="h-full w-px border-l border-dashed border-gray-200"></div>
				<div class="h-full w-px border-l border-dashed border-gray-300"></div>
				<div class="h-full w-px border-l border-dashed border-gray-200"></div>
				<div class="h-full w-px bg-transparent"></div>
			</div>

			<div class="relative flex h-full items-end gap-[1px] sm:gap-1">
				{#each day.hours as hour}
					<div
						class="group/bar relative flex h-full flex-1 flex-col-reverse justify-start overflow-hidden rounded-sm bg-gray-50 hover:bg-gray-100"
					>
						<div
							class="absolute bottom-full left-1/2 z-10 mb-2 hidden -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow-lg group-hover/bar:block"
						>
							<span class="font-bold">{hour.hour.toString().padStart(2, '0')}:00</span> • {hour
								.availableUserIds.length} Available
						</div>

						{#each hour.availableUserIds as userId}
							<div
								class="w-full border-b border-white/20 transition-opacity last:border-0 hover:opacity-80"
								style="
									background-color: {getColor(userId)}; 
									height: {100 / maxCount}%;
								"
							></div>
						{/each}
					</div>
				{/each}
			</div>

			<div class="mt-1 flex justify-between px-[2px] text-[10px] font-medium text-gray-400">
				<span>00</span>
				<span>06</span>
				<span>12</span>
				<span>18</span>
				<span>23</span>
			</div>
		</div>
	</div>
</div>
