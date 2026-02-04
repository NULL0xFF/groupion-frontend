<script lang="ts">
	import type { MemberInfo } from '$lib/types';

	let { members } = $props<{ members: MemberInfo[] }>();
</script>

<div class="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
	<h3 class="mb-4 text-base leading-6 font-semibold text-gray-900">
		Members <span class="ml-1 text-xs font-normal text-gray-500">({members.length})</span>
	</h3>

	{#if members.length === 0}
		<p class="text-sm text-gray-500">No members yet.</p>
	{:else}
		<ul class="space-y-3">
			{#each members as member (member.id)}
				<li class="flex items-center gap-3">
					<div
						class="h-8 w-8 flex-shrink-0 rounded-full border-2 border-white shadow-sm"
						style="background-color: {member.colorHex}"
						aria-hidden="true"
					></div>
					<div class="min-w-0 flex-1">
						<p class="truncate text-sm font-medium text-gray-900">
							{member.displayName}
						</p>
						<p class="truncate text-xs text-gray-500">
							{member.inGameNickname}
						</p>
					</div>
				</li>
			{/each}
		</ul>
	{/if}
</div>
