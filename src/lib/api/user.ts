import { api } from './client';
import type { User, MemberInfo } from '$lib/types';

export const userApi = {
    updateProfile: (data: { displayName: string; inGameNickname: string }) => {
        return api.post<User>('/api/users/profile', data);
    },

    getAllMembers: () => {
        return api.get<MemberInfo[]>('/api/members');
    }
};