<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';

	let {
		children,
		variant = 'primary',
		class: className = '',
		disabled = false,
		...rest
	}: HTMLButtonAttributes & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' } = $props();

	const variants = {
		primary:
			'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-md focus-visible:outline-blue-600 shadow-sm border border-transparent',
		secondary:
			'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 hover:ring-gray-400 shadow-sm',
		ghost: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
		danger:
			'bg-red-600 text-white hover:bg-red-500 hover:shadow-md focus-visible:outline-red-600 shadow-sm border border-transparent'
	};
</script>

<button
	class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 {variants[
		variant
	]} {className}"
	{disabled}
	{...rest}
>
	{@render children?.()}
</button>
