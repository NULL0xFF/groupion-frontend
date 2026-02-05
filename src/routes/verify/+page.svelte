<script lang="ts">
	import { verificationApi, type VerificationResult } from '$lib/api/verification';
	import { auth } from '$lib/stores/auth.svelte';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/Button.svelte';

	let token = $state<string | null>(null);
	let memberNo = $state('');
	let loading = $state(false);
	let result = $state<VerificationResult | null>(null);
	let error = $state<string | null>(null);

	// Wait for auth to load, then check authentication
	$effect(() => {
		if (!auth.loading && !auth.isAuthenticated) {
			goto('/login');
		}
	});

	async function generateToken() {
		loading = true;
		error = null;
		try {
			const response = await verificationApi.generateToken();
			token = response.token;
		} catch (e: any) {
			error = e.message || 'Failed to generate token';
		} finally {
			loading = false;
		}
	}

	async function verifyProfile() {
		loading = true;
		error = null;
		try {
			result = await verificationApi.verifyProfile(memberNo);
			
			// Update local user state
			if (auth.user && result.characterName) {
				auth.updateUser({
					characterNickname: result.characterName,
					isVerified: true
				});
			}
			
			// Wait 2 seconds then redirect to dashboard
			setTimeout(() => {
				goto('/dashboard');
			}, 2000);
		} catch (e: any) {
			error = e.message || 'Verification failed. Please check your member number and profile.';
		} finally {
			loading = false;
		}
	}

	function copyToken() {
		if (token) {
			navigator.clipboard.writeText(token);
		}
	}
</script>

<!-- Show loading screen while auth is initializing -->
{#if auth.loading}
	<div class="min-h-screen bg-gray-50 flex items-center justify-center">
		<div class="text-center">
			<div
				class="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"
			></div>
			<p class="mt-4 text-sm text-gray-500">Loading...</p>
		</div>
	</div>
{:else}
	<div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
		<div class="max-w-3xl mx-auto">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-gray-900">Verify Your Game Profile</h1>
				<p class="mt-2 text-gray-600">
					Link your Lost Ark character to unlock full features
				</p>
			</div>

			{#if !token}
				<!-- Step 1: Generate Token -->
				<div class="bg-white shadow rounded-lg p-6">
					<div class="text-center">
						<div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
							<svg
								class="h-6 w-6 text-blue-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						</div>
						<h3 class="mt-4 text-lg font-medium text-gray-900">Ready to verify?</h3>
						<p class="mt-2 text-sm text-gray-500">
							We'll generate a unique code for you to add to your profile
						</p>
						<div class="mt-6">
							<Button onclick={generateToken} disabled={loading} class="px-8 py-3">
								{loading ? 'Generating...' : 'Generate Verification Code'}
							</Button>
						</div>
					</div>
				</div>
			{:else if !result}
				<!-- Steps 2-4: Instructions and Verify -->
				<div class="space-y-6">
					<!-- Step 2: Copy Code -->
					<div class="bg-white shadow rounded-lg p-6">
						<div class="flex items-start">
							<div
								class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-bold flex-shrink-0"
							>
								1
							</div>
							<div class="ml-4 flex-1">
								<h3 class="text-lg font-medium text-gray-900 mb-3">Copy Your Code</h3>
								<div class="flex gap-2">
									<input
										type="text"
										value={token}
										readonly
										class="flex-1 px-4 py-3 text-lg font-mono font-bold text-center bg-gray-50 border-2 border-gray-300 rounded-lg focus:outline-none"
									/>
									<Button onclick={copyToken} variant="secondary">
										<svg
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
											/>
										</svg>
										Copy
									</Button>
								</div>
							</div>
						</div>
					</div>

					<!-- Step 3: Add to Profile -->
					<div class="bg-white shadow rounded-lg p-6">
						<div class="flex items-start">
							<div
								class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-bold flex-shrink-0"
							>
								2
							</div>
							<div class="ml-4">
								<h3 class="text-lg font-medium text-gray-900 mb-3">
									Add Code to Your Profile
								</h3>
								<ol class="list-decimal list-inside space-y-2 text-sm text-gray-600">
									<li>
										Visit <a
											href="https://profile.onstove.com/ko/"
											target="_blank"
											rel="noopener noreferrer"
											class="text-blue-600 hover:underline">profile.onstove.com</a
										>
									</li>
									<li>Log in to your account</li>
									<li>Edit your profile introduction</li>
									<li>
										Add the code <strong class="font-mono text-gray-900">{token}</strong> anywhere
										in your introduction
									</li>
									<li>Save your profile changes</li>
								</ol>
								<div class="mt-4">
									<a
										href="https://profile.onstove.com/ko/"
										target="_blank"
										rel="noopener noreferrer"
										class="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
									>
										Open Profile Page →
									</a>
								</div>
							</div>
						</div>
					</div>

					<!-- Step 4: Enter Member Number -->
					<div class="bg-white shadow rounded-lg p-6">
						<div class="flex items-start">
							<div
								class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 text-blue-600 font-bold flex-shrink-0"
							>
								3
							</div>
							<div class="ml-4 flex-1">
								<h3 class="text-lg font-medium text-gray-900 mb-3">
									Enter Your Member Number
								</h3>
								<p class="text-sm text-gray-600 mb-4">
									Your member number is visible in your profile URL (e.g.,
									profile.onstove.com/ko/<strong>12345678</strong>)
								</p>
								<div class="space-y-3">
									<input
										type="text"
										bind:value={memberNo}
										placeholder="Enter your member number (e.g., 70836315)"
										class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
										disabled={loading}
									/>
									<Button
										onclick={verifyProfile}
										disabled={loading || !memberNo.trim()}
										class="w-full py-3"
									>
										{#if loading}
											<svg
												class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
											>
												<circle
													class="opacity-25"
													cx="12"
													cy="12"
													r="10"
													stroke="currentColor"
													stroke-width="4"
												></circle>
												<path
													class="opacity-75"
													fill="currentColor"
													d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
												></path>
											</svg>
											Verifying...
										{:else}
											Verify Profile
										{/if}
									</Button>
								</div>
							</div>
						</div>
					</div>

					<!-- Error Display -->
					{#if error}
						<div class="bg-red-50 border-l-4 border-red-400 p-4 rounded">
							<div class="flex">
								<div class="flex-shrink-0">
									<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
											clip-rule="evenodd"
										/>
									</svg>
								</div>
								<div class="ml-3">
									<p class="text-sm text-red-700">{error}</p>
								</div>
							</div>
						</div>
					{/if}
				</div>
			{:else}
				<!-- Step 14: Success -->
				<div class="bg-white shadow rounded-lg p-8">
					<div class="text-center">
						<div
							class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100"
						>
							<svg
								class="h-8 w-8 text-green-600"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<h2 class="mt-6 text-2xl font-bold text-gray-900">Verification Successful!</h2>
						<p class="mt-2 text-gray-600">{result.message}</p>

						<div class="mt-8 bg-gray-50 rounded-lg p-6 text-left">
							<h3 class="text-sm font-medium text-gray-500 mb-4">Character Details</h3>
							<dl class="space-y-3">
								<div class="flex justify-between">
									<dt class="text-sm text-gray-600">Character Name:</dt>
									<dd class="text-sm font-medium text-gray-900">{result.characterName}</dd>
								</div>
								<div class="flex justify-between">
									<dt class="text-sm text-gray-600">Item Level:</dt>
									<dd class="text-sm font-medium text-gray-900">{result.itemLevel}</dd>
								</div>
								<div class="flex justify-between">
									<dt class="text-sm text-gray-600">Server:</dt>
									<dd class="text-sm font-medium text-gray-900">{result.serverName}</dd>
								</div>
								<div class="flex justify-between">
									<dt class="text-sm text-gray-600">Class:</dt>
									<dd class="text-sm font-medium text-gray-900">{result.className}</dd>
								</div>
							</dl>
						</div>

						<p class="mt-6 text-sm text-gray-500">Redirecting to dashboard...</p>
					</div>
				</div>
			{/if}
		</div>
	</div>
{/if}