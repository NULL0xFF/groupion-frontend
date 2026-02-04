import { api } from './client';
import type { AvailabilitySlot, GroupAvailability } from '$lib/types';

export const availabilityApi = {
    getMyAvailability: async () => {
        // Backend returns wrapped object: { slots: [...] }
        const response = await api.get<{ slots: AvailabilitySlot[] }>('/api/availability/me');
        return response.slots;
    },

    updateMyAvailability: (slots: AvailabilitySlot[]) => {
        // Backend expects: { slots: [...] }
        return api.post<void>('/api/availability/me', { slots });
    },

    getGroupAvailability: () => {
        return api.get<GroupAvailability>('/api/availability/group');
    }
};