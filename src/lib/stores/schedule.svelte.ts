import { availabilityApi } from '$lib/api/availability';
import type { AvailabilitySlot } from '$lib/types';
import type { SlotDto } from '$lib/api/types-request';

class ScheduleStore {
    // 7 days x 24 hours grid
    // grid[day][hour] = boolean
    grid = $state<boolean[][]>(this.createEmptyGrid());
    loading = $state(false);
    dirty = $state(false);

    private createEmptyGrid(): boolean[][] {
        return Array.from({ length: 7 }, () => Array(24).fill(false));
    }

    // Initialize and load data from API
    async init() {
        this.loading = true;
        try {
            const slots = await availabilityApi.getMyAvailability();
            this.loadFromSlots(slots);
        } catch (error) {
            console.error('Failed to load schedule:', error);
        } finally {
            this.loading = false;
        }
    }

    // Convert API slots to Grid format
    private loadFromSlots(slots: AvailabilitySlot[]) {
        const newGrid = this.createEmptyGrid();
        for (const slot of slots) {
            if (slot.dayOfWeek >= 0 && slot.dayOfWeek < 7 && slot.hourOfDay >= 0 && slot.hourOfDay < 24) {
                newGrid[slot.dayOfWeek][slot.hourOfDay] = slot.isAvailable;
            }
        }
        this.grid = newGrid;
        this.dirty = false;
    }

    // Set a specific cell
    setSlot(day: number, hour: number, value: boolean) {
        if (this.grid[day][hour] !== value) {
            this.grid[day][hour] = value;
            this.dirty = true;
        }
    }

    // Toggle a specific cell
    toggleSlot(day: number, hour: number) {
        this.grid[day][hour] = !this.grid[day][hour];
        this.dirty = true;
    }

    // Save current grid to API
    async save() {
        this.loading = true;
        try {
            const slots: SlotDto[] = [];
            for (let d = 0; d < 7; d++) {
                for (let h = 0; h < 24; h++) {
                    if (this.grid[d][h]) {
                        slots.push({
                            dayOfWeek: d,
                            hourOfDay: h,
                            isAvailable: true
                        });
                    }
                }
            }
            await availabilityApi.updateMyAvailability(slots);
            this.dirty = false;
            return true;
        } catch (error) {
            console.error('Failed to save schedule:', error);
            throw error;
        } finally {
            this.loading = false;
        }
    }

    reset() {
        this.grid = this.createEmptyGrid();
        this.dirty = true;
    }
}

export const schedule = new ScheduleStore();