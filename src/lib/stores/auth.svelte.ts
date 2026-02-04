import { browser } from '$app/environment';
import { authApi } from '$lib/api/auth';
import type { User } from '$lib/types';

class AuthStore {
    // Reactive state using runes
    user = $state<User | null>(null);
    token = $state<string | null>(null);
    loading = $state(true);

    constructor() {
        // Initialize from localStorage immediately if in browser
        if (browser) {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                this.token = storedToken;
                this.fetchUser();
            } else {
                this.loading = false;
            }
        } else {
            this.loading = false;
        }
    }

    // Derived state (getters act as $derived)
    get isAuthenticated() {
        return !!this.token && !!this.user;
    }

    async fetchUser() {
        this.loading = true;
        try {
            // This calls GET /api/auth/me
            this.user = await authApi.getMe();
        } catch (error) {
            console.error('Failed to restore session:', error);
            this.logout();
        } finally {
            this.loading = false;
        }
    }

    login(token: string, user: User) {
        this.token = token;
        this.user = user;
        if (browser) {
            localStorage.setItem('token', token);
        }
    }

    logout() {
        this.token = null;
        this.user = null;
        if (browser) {
            localStorage.removeItem('token');
            // Optional: Redirect or cleanup
        }
    }

    updateUser(updates: Partial<User>) {
        if (this.user) {
            this.user = { ...this.user, ...updates };
        }
    }
}

// Export a singleton instance
export const auth = new AuthStore();