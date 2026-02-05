export interface User {
    id: string;
    email: string;
    displayName: string;
    inGameNickname: string;
    colorHex: string;
    characterNickname?: string;
    characterItemLevel?: string;
    isVerified?: boolean;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface MemberInfo {
    id: string;
    displayName: string;
    inGameNickname: string;
    colorHex: string;
}

export interface AvailabilitySlot {
    dayOfWeek: number; // 0-6
    hourOfDay: number; // 0-23
    isAvailable: boolean;
}

export interface HourData {
    hour: number;
    availableUserIds: string[];
}

export interface DayAvailability {
    dayName: string;
    dateLabel: string;
    isNextWeek: boolean;
    hours: HourData[];
}

export interface GroupAvailability {
    days: DayAvailability[];
    members: MemberInfo[];
}