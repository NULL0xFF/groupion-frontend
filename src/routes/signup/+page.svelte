<script lang="ts">
	import { authApi } from '$lib/api/auth';
	import { auth } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';
	import type { ApiError } from '$lib/api/client';

	let formData = $state({
		email: '',
		password: '',
		displayName: '',
		inGameNickname: ''
	});

	let error = $state<string | null>(null);
	let fieldErrors = $state<Record<string, string>>({});
	let isLoading = $state(false);

	async function handleSignup(e: Event) {
		e.preventDefault();
		error = null;
		fieldErrors = {};
		isLoading = true;

		try {
			const response = await authApi.signup(formData);
			auth.login(response.token, response.user);
			goto('/dashboard');
		} catch (err) {
			const apiError = err as ApiError;
			error = apiError.message || 'Signup failed';
			if (apiError.errors) {
				fieldErrors = apiError.errors;
			}
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div>
			<h2 class="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
				Create your account
			</h2>
			<p class="mt-2 text-center text-sm text-gray-600">
				Already have an account?
				<a href="/login" class="font-medium text-blue-600 hover:text-blue-500"> Sign in </a>
			</p>
		</div>

		<form class="mt-8 space-y-6" onsubmit={handleSignup}>
			<div class="space-y-4 rounded-md shadow-sm">
				<div>
					<label for="email" class="block text-sm leading-6 font-medium text-gray-900">Email</label>
					<div class="mt-2">
						<input
							id="email"
							name="email"
							type="email"
							required
							bind:value={formData.email}
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6"
						/>
						{#if fieldErrors.email}
							<p class="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
						{/if}
					</div>
				</div>

				<div>
					<label for="password" class="block text-sm leading-6 font-medium text-gray-900"
						>Password</label
					>
					<div class="mt-2">
						<input
							id="password"
							name="password"
							type="password"
							required
							minlength="8"
							bind:value={formData.password}
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6"
						/>
						{#if fieldErrors.password}
							<p class="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
						{/if}
					</div>
				</div>

				<div>
					<label for="displayName" class="block text-sm leading-6 font-medium text-gray-900"
						>Display Name</label
					>
					<div class="mt-2">
						<input
							id="displayName"
							name="displayName"
							type="text"
							required
							bind:value={formData.displayName}
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6"
						/>
						{#if fieldErrors.displayName}
							<p class="mt-1 text-sm text-red-600">{fieldErrors.displayName}</p>
						{/if}
					</div>
				</div>

				<div>
					<label for="inGameNickname" class="block text-sm leading-6 font-medium text-gray-900"
						>In-Game Nickname</label
					>
					<div class="mt-2">
						<input
							id="inGameNickname"
							name="inGameNickname"
							type="text"
							required
							bind:value={formData.inGameNickname}
							class="block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-gray-300 ring-inset placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 focus:ring-inset sm:text-sm sm:leading-6"
						/>
						{#if fieldErrors.inGameNickname}
							<p class="mt-1 text-sm text-red-600">{fieldErrors.inGameNickname}</p>
						{/if}
					</div>
				</div>
			</div>

			{#if error}
				<div class="rounded-md bg-red-50 p-4">
					<div class="flex">
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">{error}</h3>
						</div>
					</div>
				</div>
			{/if}

			<div>
				<button
					type="submit"
					disabled={isLoading}
					class="flex w-full justify-center rounded-md bg-blue-600 px-3 py-1.5 text-sm leading-6 font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50"
				>
					{#if isLoading}
						Creating account...
					{:else}
						Create account
					{/if}
				</button>
			</div>
		</form>
	</div>
</div>
