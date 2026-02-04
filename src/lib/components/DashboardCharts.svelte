<script lang="ts">
	import type { DayAvailability, MemberInfo } from '$lib/types';
	import AvailabilityChart from './AvailabilityChart.svelte';

	let { days, members } = $props<{
		days: DayAvailability[];
		members: MemberInfo[];
	}>();
</script>

<div class="space-y-4">
	{#each days as day (day.dateLabel)}
		<AvailabilityChart {day} {members} />
	{/each}
</div>
