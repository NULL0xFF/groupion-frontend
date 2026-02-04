import { redirect } from '@sveltejs/kit';

export function load() {
    // For now, simply redirect root to dashboard. 
    // The client-side auth logic in dashboard will redirect to /login if not authenticated.
    throw redirect(307, '/dashboard');
}