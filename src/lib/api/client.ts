import { browser } from '$app/environment';

// Types for error handling
export class ApiError extends Error {
    constructor(
        public status: number,
        public message: string,
        public errors?: Record<string, string>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

// Helper to get token safely (only in browser)
function getToken(): string | null {
    if (browser) {
        return localStorage.getItem('token');
    }
    return null;
}

// Generic request handler
async function request<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    // 1. Prepare Headers
    const headers = new Headers(options.headers);

    if (!headers.has('Content-Type')) {
        headers.set('Content-Type', 'application/json');
    }

    const token = getToken();
    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    // 2. Perform Fetch
    // Note: We rely on Vite proxy for /api during dev, or a full URL in prod
    const url = endpoint.startsWith('http') ? endpoint : endpoint;

    const response = await fetch(url, {
        ...options,
        headers
    });

    // 3. Handle Errors
    if (!response.ok) {
        // Handle 401 Unauthorized globally if needed (e.g. redirect to login)
        if (response.status === 401 && browser) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }

        let errorMessage = 'An unexpected error occurred';
        let validationErrors: Record<string, string> | undefined;

        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
            if (errorData.errors) {
                validationErrors = errorData.errors;
            }
        } catch {
            // Response wasn't JSON
        }

        throw new ApiError(response.status, errorMessage, validationErrors);
    }

    // 4. Parse Response
    // Some endpoints (like 204 No Content) might not have a body
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}

// Export HTTP verbs
export const api = {
    get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),

    post: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body)
        }),

    put: <T>(endpoint: string, body: unknown) =>
        request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body)
        }),

    delete: <T>(endpoint: string) => request<T>(endpoint, { method: 'DELETE' })
};