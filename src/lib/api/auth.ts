import { api } from './client';
import type { AuthResponse, User } from '$lib/types';
import type { LoginRequest, SignupRequest } from './types-request';
import { browser } from '$app/environment';

export const authApi = {
    signup: (data: SignupRequest) => {
        return api.post<AuthResponse>('/api/auth/signup', data);
    },

    login: (data: LoginRequest) => {
        return api.post<AuthResponse>('/api/auth/login', data);
    },

    getMe: () => {
        return api.get<User>('/api/auth/me');
    },

    logout: () => {
        if (browser) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
    }
};