<script lang="ts">
	import { schedule } from '$lib/stores/schedule.svelte';

	const ROW_CONFIG = [
		{ day: 3, label: 'Wed', isNext: false },
		{ day: 4, label: 'Thu', isNext: false },
		{ day: 5, label: 'Fri', isNext: false },
		{ day: 6, label: 'Sat', isNext: false },
		{ day: 0, label: 'Sun', isNext: false },
		{ day: 1, label: 'Mon', isNext: false },
		{ day: 2, label: 'Tue', isNext: false },
		{ day: 3, label: 'Wed', isNext: true }
	];

	const HOURS = Array.from({ length: 24 }, (_, i) => i);

	let isDragging = $state(false);
	let dragValue = $state(true);

	// Determine if a cell is editable based on the Game Week logic
	function isEditable(rowIndex: number, hour: number): boolean {
		if (rowIndex === 0) {
			// First Wednesday: Only allow inputs AFTER maintenance (10:00+)
			return hour >= 10;
		}
		if (rowIndex === 7) {
			// Last Wednesday: Only allow inputs BEFORE maintenance (00:00 - 04:59)
			return hour < 5;
		}
		return true;
	}

	function handleMouseDown(rowIndex: number, day: number, hour: number, e: MouseEvent) {
		if (!isEditable(rowIndex, hour)) return;
		
		e.preventDefault();
		isDragging = true;
		dragValue = !schedule.grid[day][hour];
		schedule.setSlot(day, hour, dragValue);
	}

	function handleMouseEnter(rowIndex: number, day: number, hour: number) {
		if (isDragging && isEditable(rowIndex, hour)) {
			schedule.setSlot(day, hour, dragValue);
		}
	}

	function handleMouseUp() {
		isDragging = false;
	}
</script>

<svelte:window onmouseup={handleMouseUp} />

<div class="w-full overflow-x-auto select-none rounded-lg border border-gray-200 bg-white shadow-sm">
	<div class="min-w-[800px] p-4">
		<div class="mb-4 flex items-center justify-end gap-6 text-sm">
			<div class="flex items-center gap-2">
				<div class="h-4 w-4 rounded bg-emerald-500"></div>
				<span class="text-gray-600">Available</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="h-4 w-4 rounded border border-gray-200 bg-gray-50"></div>
				<span class="text-gray-600">Busy</span>
			</div>
			<div class="flex items-center gap-2">
				<div class="h-4 w-4 rounded bg-gray-100 opacity-50 relative overflow-hidden">
                    <div class="absolute inset-0 bg-gray-300/30"></div>
                </div>
				<span class="text-gray-400 text-xs">Blocked / Maintenance</span>
			</div>
		</div>

		<table class="w-full border-collapse">
			<thead>
				<tr>
					<th class="w-20 p-2"></th>
					{#each HOURS as hour}
						<th class="p-1 text-xs font-medium text-gray-500">
							{hour.toString().padStart(2, '0')}
						</th>
					{/each}
				</tr>
			</thead>
			<tbody>
				{#each ROW_CONFIG as { day, label, isNext }, rowIndex}
					<tr class={isNext ? "border-t-2 border-dashed border-gray-200" : ""}>
						<td class="whitespace-nowrap py-2 pr-3 text-right">
							<div class="flex flex-col items-end justify-center">
								<span class="text-sm font-semibold text-gray-700">{label}</span>
								{#if isNext}
									<span class="text-[10px] text-blue-600 font-medium">Next Reset</span>
								{/if}
							</div>
						</td>
						
						{#each HOURS as hour}
							{@const active = isEditable(rowIndex, hour)}
							{@const isMaintenance = (day === 3 && hour >= 5 && hour < 10)}
							
							<td class="p-[2px] relative">
								{#if !active}
                                    <div class="h-8 w-full min-w-[1.5rem] rounded-sm bg-gray-50 border border-transparent opacity-40 cursor-not-allowed relative overflow-hidden">
                                        {#if isMaintenance}
                                            <div class="absolute inset-0 opacity-20" 
                                                style="background-image: linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent); background-size: 4px 4px;">
                                            </div>
                                        {/if}
                                    </div>
								{:else}
                                    <div
										role="gridcell"
										tabindex="0"
										aria-selected={schedule.grid[day][hour]}
										onmousedown={(e) => handleMouseDown(rowIndex, day, hour, e)}
										onmouseenter={() => handleMouseEnter(rowIndex, day, hour)}
										class="h-8 w-full min-w-[1.5rem] cursor-pointer rounded-sm border transition-colors duration-75 ease-in-out
											{schedule.grid[day][hour]
												? 'bg-emerald-500 hover:bg-emerald-600 border-emerald-600'
												: 'bg-gray-50 hover:bg-gray-100 border-gray-100'}"
									></div>
								{/if}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
		
		<p class="mt-4 text-center text-xs text-gray-400">
			Note: 'Next Reset' Wednesday covers the late-night hours (00:00 - 05:00) before the weekly maintenance.
		</p>
	</div>
</div>